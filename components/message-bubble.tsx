import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <View
      className={cn(
        "flex-row mb-3 px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <View
        className={cn(
          "max-w-xs px-4 py-3 rounded-2xl",
          isUser
            ? "bg-primary rounded-br-none"
            : "bg-surface rounded-bl-none border border-border"
        )}
      >
        <Text
          className={cn(
            "text-base leading-relaxed",
            isUser ? "text-background" : "text-foreground"
          )}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}
