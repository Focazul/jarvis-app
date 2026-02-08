/**
 * Natural Language Processing service for Jarvis
 * Parses user input and extracts intent, entities, and dates/times
 */

import { ParsedCommand, RecurrenceType } from "./types";

// Portuguese date expressions
const PT_DATE_PATTERNS = {
  hoje: 0,
  "hoje à noite": 0,
  "hoje de manhã": 0,
  "hoje de tarde": 0,
  amanhã: 1,
  "amanhã de manhã": 1,
  "amanhã à tarde": 1,
  "amanhã à noite": 1,
  "depois de amanhã": 2,
  "semana que vem": 7,
  "próxima semana": 7,
  "próximo mês": 30,
};

// Portuguese time expressions
const PT_TIME_PATTERNS: Record<string, string> = {
  "7 da manhã": "07:00",
  "8 da manhã": "08:00",
  "9 da manhã": "09:00",
  "10 da manhã": "10:00",
  "11 da manhã": "11:00",
  "meio-dia": "12:00",
  "12 da tarde": "12:00",
  "1 da tarde": "13:00",
  "2 da tarde": "14:00",
  "3 da tarde": "15:00",
  "4 da tarde": "16:00",
  "5 da tarde": "17:00",
  "6 da tarde": "18:00",
  "7 da noite": "19:00",
  "8 da noite": "20:00",
  "9 da noite": "21:00",
  "10 da noite": "22:00",
  "11 da noite": "23:00",
  "meia-noite": "00:00",
  "à noite": "19:00",
  "de manhã": "08:00",
  "de tarde": "14:00",
  "de noite": "19:00",
};

// Intent keywords - ordered by specificity (more specific first)
const INTENT_KEYWORDS = {
  delete_task: [
    "excluir tarefa",
    "deletar tarefa",
    "remover tarefa",
    "apagar tarefa",
  ],
  delete_alarm: [
    "excluir alarme",
    "deletar alarme",
    "remover alarme",
    "apagar alarme",
  ],
  complete_task: [
    "marcar como concluída",
    "concluir tarefa",
    "tarefa concluída",
    "feito",
    "pronto",
  ],
  edit_task: [
    "editar tarefa",
    "alterar tarefa",
    "mudar tarefa",
    "atualizar tarefa",
  ],
  edit_alarm: [
    "editar alarme",
    "alterar alarme",
    "mudar alarme",
    "atualizar alarme",
  ],
  list_tasks: [
    "listar tarefas",
    "minhas tarefas",
    "o que tenho",
    "o que preciso fazer",
    "quais são as tarefas",
  ],
  list_alarms: [
    "listar alarmes",
    "meus alarmes",
    "quais alarmes",
    "quais são os meus alarmes",
  ],
  create_alarm: [
    "criar alarme",
    "novo alarme",
    "me acorde",
    "despertar",
    "lembrete",
  ],
  create_task: [
    "adicionar tarefa",
    "criar tarefa",
    "nova tarefa",
    "lembrar",
    "me lembre",
    "adicione",
  ],
};

export function parseUserInput(input: string): ParsedCommand {
  const lowerInput = input.toLowerCase().trim();

  // Detect intent - check in order of specificity
  let intent: ParsedCommand["intent"] = "unknown";
  let confidence = 0;

  for (const [key, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerInput.includes(keyword)) {
        intent = key as ParsedCommand["intent"];
        confidence = 0.8;
        break;
      }
    }
    if (confidence > 0) break;
  }

  // Extract entities
  const entities: ParsedCommand["entities"] = {};

  // Extract date
  for (const [pattern, days] of Object.entries(PT_DATE_PATTERNS)) {
    if (lowerInput.includes(pattern)) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      entities.date = date.toISOString().split("T")[0];
      break;
    }
  }

  // Extract time
  for (const [pattern, time] of Object.entries(PT_TIME_PATTERNS)) {
    if (lowerInput.includes(pattern)) {
      entities.time = time;
      break;
    }
  }

  // Extract recurrence
  if (
    lowerInput.includes("diário") ||
    lowerInput.includes("todo dia") ||
    lowerInput.includes("cada dia")
  ) {
    entities.recurrence = "daily";
  } else if (
    lowerInput.includes("semanal") ||
    lowerInput.includes("toda semana") ||
    lowerInput.includes("cada semana")
  ) {
    entities.recurrence = "weekly";
  } else {
    entities.recurrence = "none";
  }

  // Extract title/description (remove common keywords and dates/times)
  let text = lowerInput;
  for (const keywords of Object.values(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      text = text.replace(keyword, "");
    }
  }
  for (const pattern of Object.keys(PT_DATE_PATTERNS)) {
    text = text.replace(pattern, "");
  }
  for (const pattern of Object.keys(PT_TIME_PATTERNS)) {
    text = text.replace(pattern, "");
  }

  const title = text
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 10)
    .join(" ");

  if (title) {
    if (
      intent === "create_task" ||
      intent === "edit_task" ||
      intent === "delete_task"
    ) {
      entities.title = title;
    } else if (
      intent === "create_alarm" ||
      intent === "edit_alarm" ||
      intent === "delete_alarm"
    ) {
      entities.description = title;
    }
  }

  const requiresConfirmation =
    (intent === "create_task" || intent === "create_alarm") &&
    (!entities.date || !entities.time);

  return {
    intent,
    entities,
    confidence,
    requiresConfirmation,
  };
}

export function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  if (date === todayStr) {
    return "hoje";
  } else if (date === tomorrowStr) {
    return "amanhã";
  }

  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);

  if (hour < 12) {
    return `${hours}:${minutes} da manhã`;
  } else if (hour < 18) {
    return `${hours}:${minutes} da tarde`;
  } else {
    return `${hours}:${minutes} da noite`;
  }
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekStartDate(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const weekStart = new Date(today.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}
