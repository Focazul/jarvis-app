import { ScrollView, View, TextInput, Pressable, ActivityIndicator, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MessageBubble } from "@/components/message-bubble";
import { useChat } from "@/lib/chat-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function ChatScreen() {
  const colors = useColors();
  const { messages, isLoading, pendingConfirmation, sendMessage, confirmAction } = useChat();
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");
    await sendMessage(input.trim());
  };

  const handleConfirm = async (confirmed: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await confirmAction(confirmed);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <MaterialIcons name="smart-toy" size={64} color={colors.primary} />
            <Text className="text-2xl font-bold text-foreground mt-4 text-center">
              Bem-vindo ao Jarvis
            </Text>
            <Text className="text-base text-muted text-center mt-2">
              Sou seu assistente pessoal. Você pode me pedir para criar tarefas, alarmes, listar
              itens e muito mais.
            </Text>
            <Text className="text-sm text-muted text-center mt-4">
              Exemplos:{"\n"}• "Criar tarefa: estudar Excel"{"\n"}• "Me lembre de pagar o cartão
              amanhã às 10h"{"\n"}• "O que tenho para hoje?"
            </Text>
          </View>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))
        )}
        {isLoading && (
          <View className="flex-row justify-start px-4 mb-3">
            <View className="bg-surface rounded-2xl rounded-bl-none px-4 py-3 border border-border">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Buttons */}
      {pendingConfirmation && !isLoading && (
        <View className="px-4 py-3 gap-2 flex-row">
          <Pressable
            onPress={() => handleConfirm(true)}
            className="flex-1 bg-success rounded-lg py-3 items-center"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-white font-semibold">Sim</Text>
          </Pressable>
          <Pressable
            onPress={() => handleConfirm(false)}
            className="flex-1 bg-error rounded-lg py-3 items-center"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-white font-semibold">Não</Text>
          </Pressable>
        </View>
      )}

      {/* Input Area */}
      <View className="px-4 py-3 gap-3 border-t border-border bg-background">
        <View className="flex-row gap-2 items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.muted}
            className="flex-1 bg-surface border border-border rounded-full px-4 py-3 text-foreground"
            editable={!isLoading}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-primary rounded-full p-3 items-center justify-center"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <MaterialIcons name="send" size={24} color={colors.background} />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
