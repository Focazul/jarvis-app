import { ScrollView, View, TextInput, Pressable, ActivityIndicator, Text, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { MessageBubble } from "@/components/message-bubble";
import { useChat } from "@/lib/chat-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ChatScreen() {
  const colors = useColors();
  const { messages, isLoading: isChatLoading, pendingConfirmation, sendMessage, confirmAction } = useChat();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle speech results
  useSpeechRecognitionEvent("onSpeechResults", (event) => {
    const result = event.results[0]?.transcript;
    if (result) {
      setInput(result);
    }
  });

  useSpeechRecognitionEvent("onSpeechError", (event) => {
    console.log("Speech error:", event.error);
    setIsListening(false);
  });

  useSpeechRecognitionEvent("onSpeechEnd", () => {
    setIsListening(false);
  });

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isChatLoading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const textToSend = input.trim();
    setInput("");
    await sendMessage(textToSend);
  };

  const handleConfirm = async (confirmed: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await confirmAction(confirmed);
  };

  const toggleListening = async () => {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } else {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert("Permissão necessária", "Precisamos de acesso ao microfone para ouvir você.");
        return;
      }

      try {
        ExpoSpeechRecognitionModule.start({
          lang: "pt-BR",
          interimResults: true,
          maxAlternatives: 1,
        });
        setIsListening(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        console.error("Failed to start speech recognition", e);
        setIsListening(false);
      }
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <View className="bg-primary/10 p-6 rounded-full mb-6">
              <IconSymbol name="brain.head.profile" size={64} color={colors.primary} />
            </View>
            <Text className="text-2xl font-bold text-foreground mt-4 text-center">
              Olá! Sou o Jarvis.
            </Text>
            <Text className="text-base text-muted-foreground text-center mt-2 px-4 leading-6">
              Seu assistente pessoal para organizar tarefas e alarmes.
            </Text>

            <View className="mt-8 bg-surface p-4 rounded-xl border border-border w-full">
              <Text className="font-semibold text-foreground mb-2">Tente dizer:</Text>
              <Text className="text-sm text-muted-foreground mb-1">• "Lembrar de comprar leite amanhã"</Text>
              <Text className="text-sm text-muted-foreground mb-1">• "Me acorde às 7 da manhã"</Text>
              <Text className="text-sm text-muted-foreground">• "Quais são minhas tarefas?"</Text>
            </View>
          </View>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={msg.id || index} role={msg.role} content={msg.content} />
          ))
        )}
        {isChatLoading && (
          <View className="flex-row justify-start mb-3">
            <View className="bg-surface rounded-2xl rounded-bl-none px-4 py-3 border border-border">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Buttons */}
      {pendingConfirmation && !isChatLoading && (
        <View className="px-4 py-3 gap-3 flex-row border-t border-border bg-background">
          <Pressable
            onPress={() => handleConfirm(true)}
            className="flex-1 bg-green-500 rounded-xl py-3 items-center shadow-sm"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-white font-bold text-base">Confirmar</Text>
          </Pressable>
          <Pressable
            onPress={() => handleConfirm(false)}
            className="flex-1 bg-red-500 rounded-xl py-3 items-center shadow-sm"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-white font-bold text-base">Cancelar</Text>
          </Pressable>
        </View>
      )}

      {/* Input Area */}
      <View className="px-4 py-3 gap-3 border-t border-border bg-background pb-8">
        <View className="flex-row gap-3 items-end">
          <View className="flex-1 bg-surface border border-border rounded-2xl flex-row items-center px-4 py-2 min-h-[50px]">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={isListening ? "Ouvindo..." : "Digite sua mensagem..."}
              placeholderTextColor={colors.muted}
              className="flex-1 text-foreground text-base leading-5 pt-0 pb-0"
              editable={!isChatLoading}
              multiline
              maxHeight={100}
            />
            {input.length > 0 && (
              <Pressable onPress={() => setInput("")} className="p-1">
                 <IconSymbol name="xmark.circle.fill" size={16} color={colors.muted} />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={toggleListening}
            className={`w-12 h-12 rounded-full items-center justify-center shadow-sm ${
              isListening ? "bg-red-500" : "bg-surface border border-border"
            }`}
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <IconSymbol
              name={isListening ? "waveform" : "mic.fill"}
              size={24}
              color={isListening ? "white" : colors.primary}
            />
          </Pressable>

          <Pressable
            onPress={handleSendMessage}
            disabled={!input.trim() || isChatLoading}
            className={`w-12 h-12 rounded-full items-center justify-center shadow-sm ${
              !input.trim() || isChatLoading ? "bg-muted opacity-50" : "bg-primary"
            }`}
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <IconSymbol name="arrow.up" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
