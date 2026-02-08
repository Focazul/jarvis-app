/**
 * Local storage service for tasks and alarms
 * Uses AsyncStorage for persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, Alarm } from "./types";
import { v4 as uuidv4 } from "uuid";

const TASKS_KEY = "jarvis_tasks";
const ALARMS_KEY = "jarvis_alarms";

// Tasks Storage
export const tasksStorage = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading tasks:", error);
      return [];
    }
  },

  async addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = await this.getTasks();
    tasks.push(newTask);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);

    if (filtered.length === tasks.length) return false;

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
    return true;
  },

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  async getTasksByDate(date: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.date === date);
  },

  async getTasksForWeek(startDate: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return tasks.filter((t) => {
      if (!t.date) return false;
      const taskDate = new Date(t.date);
      return taskDate >= start && taskDate < end;
    });
  },

  async getTasksWithoutDate(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => !t.date);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(TASKS_KEY);
  },
};

// Alarms Storage
export const alarmsStorage = {
  async getAlarms(): Promise<Alarm[]> {
    try {
      const data = await AsyncStorage.getItem(ALARMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading alarms:", error);
      return [];
    }
  },

  async addAlarm(alarm: Omit<Alarm, "id" | "createdAt" | "updatedAt">): Promise<Alarm> {
    const newAlarm: Alarm = {
      ...alarm,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const alarms = await this.getAlarms();
    alarms.push(newAlarm);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    return newAlarm;
  },

  async updateAlarm(id: string, updates: Partial<Alarm>): Promise<Alarm | null> {
    const alarms = await this.getAlarms();
    const index = alarms.findIndex((a) => a.id === id);

    if (index === -1) return null;

    alarms[index] = {
      ...alarms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    return alarms[index];
  },

  async deleteAlarm(id: string): Promise<boolean> {
    const alarms = await this.getAlarms();
    const filtered = alarms.filter((a) => a.id !== id);

    if (filtered.length === alarms.length) return false;

    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(filtered));
    return true;
  },

  async getAlarmById(id: string): Promise<Alarm | null> {
    const alarms = await this.getAlarms();
    return alarms.find((a) => a.id === id) || null;
  },

  async getActiveAlarms(): Promise<Alarm[]> {
    const alarms = await this.getAlarms();
    return alarms.filter((a) => a.active);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(ALARMS_KEY);
  },
};
