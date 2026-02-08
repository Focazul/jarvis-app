import React, { createContext, useContext, useState, useCallback } from "react";
import { ChatMessage } from "./types";
import { jarvisService } from "./jarvis-service";

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  pendingConfirmation: boolean;
  sendMessage: (content: string) => Promise<void>;
  confirmAction: (confirmed: boolean) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      addMessage("user", content);
      setIsLoading(true);

      try {
        const response = await jarvisService.processUserInput(content);
        addMessage("assistant", response.message);
        setPendingConfirmation(response.requiresConfirmation || false);
      } catch (error) {
        console.error("Error processing message:", error);
        addMessage("assistant", "Desculpe, ocorreu um erro ao processar sua mensagem.");
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const confirmAction = useCallback(
    async (confirmed: boolean) => {
      const confirmText = confirmed ? "sim" : "não";
      addMessage("user", confirmText);
      setIsLoading(true);

      try {
        const response = await jarvisService.confirmLastCommand(confirmed);
        addMessage("assistant", response.message);
        setPendingConfirmation(false);
      } catch (error) {
        console.error("Error confirming action:", error);
        addMessage("assistant", "Desculpe, ocorreu um erro ao confirmar a ação.");
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setPendingConfirmation(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        pendingConfirmation,
        sendMessage,
        confirmAction,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
