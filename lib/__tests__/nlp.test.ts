import { describe, it, expect } from "vitest";
import { parseUserInput, formatDate, formatTime, getTodayDate } from "../nlp";

describe("NLP Service", () => {
  describe("parseUserInput", () => {
    it("should parse create task intent", () => {
      const result = parseUserInput("criar tarefa: estudar Excel");
      expect(result.intent).toBe("create_task");
      expect(result.entities.title).toContain("estudar");
    });

    it("should parse create alarm intent", () => {
      const result = parseUserInput("criar alarme para pagar o cartão amanhã às 10 da manhã");
      expect(result.intent).toBe("create_alarm");
      expect(result.entities.description).toContain("pagar");
      expect(result.entities.date).toBeDefined();
      expect(result.entities.time).toBe("10:00");
    });

    it("should parse list tasks intent", () => {
      const result = parseUserInput("O que tenho para hoje?");
      expect(result.intent).toBe("list_tasks");
    });

    it("should parse list alarms intent", () => {
      const result = parseUserInput("quais são os meus alarmes?");
      expect(result.intent).toBe("list_alarms");
    });

    it("should parse delete task intent", () => {
      const result = parseUserInput("excluir tarefa estudar");
      expect(result.intent).toBe("delete_task");
    });

    it("should parse delete alarm intent", () => {
      const result = parseUserInput("deletar alarme das 7h");
      expect(result.intent).toBe("delete_alarm");
    });

    it("should extract today date", () => {
      const result = parseUserInput("criar tarefa hoje");
      expect(result.entities.date).toBe(getTodayDate());
    });

    it("should extract tomorrow date", () => {
      const result = parseUserInput("criar tarefa amanhã");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      expect(result.entities.date).toBe(tomorrowStr);
    });

    it("should extract time from expression", () => {
      const result = parseUserInput("alarme às 7 da manhã");
      expect(result.entities.time).toBe("07:00");
    });

    it("should extract recurrence daily", () => {
      const result = parseUserInput("alarme diário");
      expect(result.entities.recurrence).toBe("daily");
    });

    it("should extract recurrence weekly", () => {
      const result = parseUserInput("alarme semanal");
      expect(result.entities.recurrence).toBe("weekly");
    });

    it("should require confirmation for incomplete task", () => {
      const result = parseUserInput("criar tarefa");
      expect(result.requiresConfirmation).toBe(true);
    });

    it("should not require confirmation for list operations", () => {
      const result = parseUserInput("listar tarefas");
      expect(result.requiresConfirmation).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("should format today date as 'hoje'", () => {
      const today = getTodayDate();
      expect(formatDate(today)).toBe("hoje");
    });

    it("should format tomorrow date as 'amanhã'", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      expect(formatDate(tomorrowStr)).toBe("amanhã");
    });

    it("should format other dates with day name", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split("T")[0];
      const formatted = formatDate(futureDateStr);
      expect(formatted).toBeTruthy();
      expect(formatted).not.toBe("hoje");
      expect(formatted).not.toBe("amanhã");
    });
  });

  describe("formatTime", () => {
    it("should format morning time", () => {
      expect(formatTime("07:00")).toBe("07:00 da manhã");
    });

    it("should format afternoon time", () => {
      expect(formatTime("14:00")).toBe("14:00 da tarde");
    });

    it("should format evening time", () => {
      expect(formatTime("19:00")).toBe("19:00 da noite");
    });
  });

  describe("getTodayDate", () => {
    it("should return today's date in ISO format", () => {
      const today = getTodayDate();
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      expect(today).toMatch(regex);
    });
  });
});
