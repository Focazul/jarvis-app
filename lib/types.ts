/**
 * Data models for Jarvis application
 */

export type TaskStatus = "pending" | "completed";
export type RecurrenceType = "none" | "daily" | "weekly";

export interface Task {
  id: string;
  title: string;
  date?: string; // ISO format: YYYY-MM-DD
  time?: string; // HH:mm format
  status: TaskStatus;
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

export interface Alarm {
  id: string;
  description: string;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // HH:mm format
  recurrence: RecurrenceType;
  active: boolean;
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO format
}

export interface ParsedCommand {
  intent: "create_task" | "create_alarm" | "list_tasks" | "list_alarms" | "delete_task" | "delete_alarm" | "complete_task" | "edit_task" | "edit_alarm" | "unknown";
  entities: {
    title?: string;
    description?: string;
    date?: string; // ISO format
    time?: string; // HH:mm format
    recurrence?: RecurrenceType;
    taskId?: string;
    alarmId?: string;
  };
  confidence: number; // 0-1
  requiresConfirmation: boolean;
}

export interface JarvisResponse {
  message: string;
  action?: "create" | "delete" | "update" | "list" | "confirm";
  data?: Task | Alarm | Task[] | Alarm[];
  requiresConfirmation?: boolean;
}
