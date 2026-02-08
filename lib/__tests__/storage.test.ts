import { describe, it, expect, beforeEach, afterEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tasksStorage, alarmsStorage } from "../storage";
import { Task, Alarm } from "../types";

// Mock AsyncStorage
beforeEach(async () => {
  await AsyncStorage.clear();
});

afterEach(async () => {
  await AsyncStorage.clear();
});

describe("Tasks Storage", () => {
  it("should add a new task", async () => {
    const task = await tasksStorage.addTask({
      title: "Test Task",
      date: "2026-02-09",
      time: "10:00",
      status: "pending",
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.title).toBe("Test Task");
    expect(task.status).toBe("pending");
  });

  it("should get all tasks", async () => {
    await tasksStorage.addTask({
      title: "Task 1",
      status: "pending",
    });
    await tasksStorage.addTask({
      title: "Task 2",
      status: "pending",
    });

    const tasks = await tasksStorage.getTasks();
    expect(tasks).toHaveLength(2);
  });

  it("should update a task", async () => {
    const task = await tasksStorage.addTask({
      title: "Original Title",
      status: "pending",
    });

    const updated = await tasksStorage.updateTask(task.id, {
      title: "Updated Title",
      status: "completed",
    });

    expect(updated).toBeDefined();
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.status).toBe("completed");
  });

  it("should delete a task", async () => {
    const task = await tasksStorage.addTask({
      title: "Task to Delete",
      status: "pending",
    });

    const deleted = await tasksStorage.deleteTask(task.id);
    expect(deleted).toBe(true);

    const tasks = await tasksStorage.getTasks();
    expect(tasks).toHaveLength(0);
  });

  it("should get task by id", async () => {
    const task = await tasksStorage.addTask({
      title: "Find Me",
      status: "pending",
    });

    const found = await tasksStorage.getTaskById(task.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe("Find Me");
  });

  it("should get tasks by date", async () => {
    const today = new Date().toISOString().split("T")[0];

    await tasksStorage.addTask({
      title: "Today Task",
      date: today,
      status: "pending",
    });
    await tasksStorage.addTask({
      title: "No Date Task",
      status: "pending",
    });

    const todayTasks = await tasksStorage.getTasksByDate(today);
    expect(todayTasks).toHaveLength(1);
    expect(todayTasks[0].title).toBe("Today Task");
  });

  it("should get tasks without date", async () => {
    const today = new Date().toISOString().split("T")[0];

    await tasksStorage.addTask({
      title: "Today Task",
      date: today,
      status: "pending",
    });
    await tasksStorage.addTask({
      title: "No Date Task 1",
      status: "pending",
    });
    await tasksStorage.addTask({
      title: "No Date Task 2",
      status: "pending",
    });

    const noDateTasks = await tasksStorage.getTasksWithoutDate();
    expect(noDateTasks).toHaveLength(2);
  });
});

describe("Alarms Storage", () => {
  it("should add a new alarm", async () => {
    const alarm = await alarmsStorage.addAlarm({
      description: "Test Alarm",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });

    expect(alarm).toBeDefined();
    expect(alarm.id).toBeDefined();
    expect(alarm.description).toBe("Test Alarm");
    expect(alarm.active).toBe(true);
  });

  it("should get all alarms", async () => {
    await alarmsStorage.addAlarm({
      description: "Alarm 1",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });
    await alarmsStorage.addAlarm({
      description: "Alarm 2",
      date: "2026-02-10",
      time: "11:00",
      recurrence: "daily",
      active: true,
    });

    const alarms = await alarmsStorage.getAlarms();
    expect(alarms).toHaveLength(2);
  });

  it("should update an alarm", async () => {
    const alarm = await alarmsStorage.addAlarm({
      description: "Original Description",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });

    const updated = await alarmsStorage.updateAlarm(alarm.id, {
      description: "Updated Description",
      active: false,
    });

    expect(updated).toBeDefined();
    expect(updated?.description).toBe("Updated Description");
    expect(updated?.active).toBe(false);
  });

  it("should delete an alarm", async () => {
    const alarm = await alarmsStorage.addAlarm({
      description: "Alarm to Delete",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });

    const deleted = await alarmsStorage.deleteAlarm(alarm.id);
    expect(deleted).toBe(true);

    const alarms = await alarmsStorage.getAlarms();
    expect(alarms).toHaveLength(0);
  });

  it("should get alarm by id", async () => {
    const alarm = await alarmsStorage.addAlarm({
      description: "Find Me",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });

    const found = await alarmsStorage.getAlarmById(alarm.id);
    expect(found).toBeDefined();
    expect(found?.description).toBe("Find Me");
  });

  it("should get active alarms", async () => {
    await alarmsStorage.addAlarm({
      description: "Active Alarm",
      date: "2026-02-09",
      time: "10:00",
      recurrence: "none",
      active: true,
    });
    await alarmsStorage.addAlarm({
      description: "Inactive Alarm",
      date: "2026-02-10",
      time: "11:00",
      recurrence: "none",
      active: false,
    });

    const activeAlarms = await alarmsStorage.getActiveAlarms();
    expect(activeAlarms).toHaveLength(1);
    expect(activeAlarms[0].description).toBe("Active Alarm");
  });
});
