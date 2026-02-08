/**
 * Jarvis Service - Main orchestrator for task and alarm management
 */

import { Task, Alarm, JarvisResponse, ParsedCommand } from "./types";
import { tasksStorage, alarmsStorage } from "./storage";
import { parseUserInput, formatDate, formatTime, getTodayDate, getWeekStartDate } from "./nlp";

export class JarvisService {
  private lastParsedCommand: ParsedCommand | null = null;

  async processUserInput(input: string): Promise<JarvisResponse> {
    this.lastParsedCommand = parseUserInput(input);
    const { intent, entities, requiresConfirmation } = this.lastParsedCommand;

    switch (intent) {
      case "create_task":
        return this.handleCreateTask(entities, requiresConfirmation);
      case "create_alarm":
        return this.handleCreateAlarm(entities, requiresConfirmation);
      case "list_tasks":
        return this.handleListTasks();
      case "list_alarms":
        return this.handleListAlarms();
      case "delete_task":
        return this.handleDeleteTask(entities);
      case "delete_alarm":
        return this.handleDeleteAlarm(entities);
      case "complete_task":
        return this.handleCompleteTask(entities);
      case "edit_task":
        return this.handleEditTask(entities);
      case "edit_alarm":
        return this.handleEditAlarm(entities);
      default:
        return {
          message:
            "Desculpe, não entendi. Você pode me pedir para criar uma tarefa, criar um alarme, listar tarefas ou alarmes, ou gerenciar itens existentes.",
        };
    }
  }

  async confirmLastCommand(confirmed: boolean): Promise<JarvisResponse> {
    if (!this.lastParsedCommand) {
      return { message: "Nenhum comando pendente para confirmar." };
    }

    if (!confirmed) {
      return { message: "Operação cancelada." };
    }

    const { intent, entities } = this.lastParsedCommand;

    if (intent === "create_task") {
      return this.createTask(entities);
    } else if (intent === "create_alarm") {
      return this.createAlarm(entities);
    }

    return { message: "Comando confirmado." };
  }

  private async handleCreateTask(
    entities: ParsedCommand["entities"],
    requiresConfirmation: boolean
  ): Promise<JarvisResponse> {
    if (!entities.title) {
      return {
        message: "Qual é o título da tarefa?",
        requiresConfirmation: true,
      };
    }

    if (!entities.date) {
      return {
        message: `Quando você quer fazer "${entities.title}"? (ex: hoje, amanhã, segunda-feira)`,
        requiresConfirmation: true,
      };
    }

    if (requiresConfirmation) {
      const dateStr = formatDate(entities.date);
      const timeStr = entities.time ? formatTime(entities.time) : "sem hora específica";
      return {
        message: `Confirma a tarefa "${entities.title}" para ${dateStr} ${timeStr}?`,
        requiresConfirmation: true,
      };
    }

    return this.createTask(entities);
  }

  private async createTask(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    if (!entities.title || !entities.date) {
      return { message: "Informações insuficientes para criar a tarefa." };
    }

    const task = await tasksStorage.addTask({
      title: entities.title,
      date: entities.date,
      time: entities.time,
      status: "pending",
    });

    return {
      message: `✅ Tarefa "${task.title}" criada com sucesso para ${formatDate(task.date!)}${
        task.time ? ` às ${formatTime(task.time)}` : ""
      }.`,
      action: "create",
      data: task,
    };
  }

  private async handleCreateAlarm(
    entities: ParsedCommand["entities"],
    requiresConfirmation: boolean
  ): Promise<JarvisResponse> {
    if (!entities.description) {
      return {
        message: "Qual é a descrição do alarme?",
        requiresConfirmation: true,
      };
    }

    if (!entities.date || !entities.time) {
      return {
        message: `Quando você quer ser lembrado? (ex: amanhã às 7 da manhã)`,
        requiresConfirmation: true,
      };
    }

    if (requiresConfirmation) {
      const dateStr = formatDate(entities.date);
      const timeStr = formatTime(entities.time);
      return {
        message: `Confirma o alarme "${entities.description}" para ${dateStr} às ${timeStr}?`,
        requiresConfirmation: true,
      };
    }

    return this.createAlarm(entities);
  }

  private async createAlarm(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    if (!entities.description || !entities.date || !entities.time) {
      return { message: "Informações insuficientes para criar o alarme." };
    }

    const alarm = await alarmsStorage.addAlarm({
      description: entities.description,
      date: entities.date,
      time: entities.time,
      recurrence: entities.recurrence || "none",
      active: true,
    });

    return {
      message: `✅ Alarme "${alarm.description}" criado com sucesso para ${formatDate(
        alarm.date
      )} às ${formatTime(alarm.time)}.`,
      action: "create",
      data: alarm,
    };
  }

  private async handleListTasks(): Promise<JarvisResponse> {
    const tasks = await tasksStorage.getTasks();

    if (tasks.length === 0) {
      return { message: "Você não tem nenhuma tarefa." };
    }

    const today = getTodayDate();
    const weekStart = getWeekStartDate();
    const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const todayTasks = tasks.filter((t) => t.date === today && t.status === "pending");
    const weekTasks = tasks.filter(
      (t) => t.date && t.date >= weekStart && t.date <= weekEnd && t.status === "pending"
    );
    const otherTasks = tasks.filter((t) => !t.date && t.status === "pending");

    let message = "📋 Suas tarefas:\n\n";

    if (todayTasks.length > 0) {
      message += "📅 Hoje:\n";
      todayTasks.forEach((t) => {
        message += `  • ${t.title}${t.time ? ` às ${formatTime(t.time)}` : ""}\n`;
      });
      message += "\n";
    }

    if (weekTasks.length > 0) {
      message += "📆 Semana:\n";
      weekTasks.forEach((t) => {
        message += `  • ${t.title} (${formatDate(t.date!)})${t.time ? ` às ${formatTime(t.time)}` : ""}\n`;
      });
      message += "\n";
    }

    if (otherTasks.length > 0) {
      message += "📌 Sem data:\n";
      otherTasks.forEach((t) => {
        message += `  • ${t.title}\n`;
      });
    }

    return { message, action: "list", data: tasks };
  }

  private async handleListAlarms(): Promise<JarvisResponse> {
    const alarms = await alarmsStorage.getAlarms();

    if (alarms.length === 0) {
      return { message: "Você não tem nenhum alarme." };
    }

    const activeAlarms = alarms.filter((a) => a.active);

    if (activeAlarms.length === 0) {
      return { message: "Você não tem alarmes ativos." };
    }

    let message = "🔔 Seus alarmes:\n\n";

    activeAlarms.forEach((a) => {
      const recurrence =
        a.recurrence === "daily"
          ? " (diário)"
          : a.recurrence === "weekly"
            ? " (semanal)"
            : "";
      message += `  • ${a.description} - ${formatDate(a.date)} às ${formatTime(a.time)}${recurrence}\n`;
    });

    return { message, action: "list", data: alarms };
  }

  private async handleDeleteTask(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    if (entities.taskId) {
      const deleted = await tasksStorage.deleteTask(entities.taskId);
      if (deleted) {
        return { message: "✅ Tarefa excluída com sucesso." };
      }
      return { message: "Tarefa não encontrada." };
    }

    return {
      message: "Qual tarefa você quer excluir?",
      requiresConfirmation: true,
    };
  }

  private async handleDeleteAlarm(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    if (entities.alarmId) {
      const deleted = await alarmsStorage.deleteAlarm(entities.alarmId);
      if (deleted) {
        return { message: "✅ Alarme excluído com sucesso." };
      }
      return { message: "Alarme não encontrado." };
    }

    return {
      message: "Qual alarme você quer excluir?",
      requiresConfirmation: true,
    };
  }

  private async handleCompleteTask(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    if (entities.taskId) {
      const updated = await tasksStorage.updateTask(entities.taskId, {
        status: "completed",
      });
      if (updated) {
        return { message: `✅ Tarefa "${updated.title}" marcada como concluída.` };
      }
    }

    return { message: "Qual tarefa você quer marcar como concluída?" };
  }

  private async handleEditTask(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    return { message: "Qual tarefa você quer editar e o que deseja mudar?" };
  }

  private async handleEditAlarm(entities: ParsedCommand["entities"]): Promise<JarvisResponse> {
    return { message: "Qual alarme você quer editar e o que deseja mudar?" };
  }
}

export const jarvisService = new JarvisService();
