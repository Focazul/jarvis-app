import { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeContext } from "@/lib/theme-provider";
import { settingsStorage, AppSettings } from "@/lib/settings-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await settingsStorage.getSettings();
    setNotificationsEnabled(settings.notificationsEnabled);
    setSoundEnabled(settings.soundEnabled);
  };

  const toggleTheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await settingsStorage.saveSettings({ notificationsEnabled: newValue });
  };

  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await settingsStorage.saveSettings({ soundEnabled: newValue });
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja apagar todas as tarefas e alarmes? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            // Import storage dynamically to avoid cycles if any
            const { tasksStorage, alarmsStorage } = await import("@/lib/storage");
            await tasksStorage.clear(); // Assuming clear exists or I implement it
            await alarmsStorage.clear(); // Assuming clear exists or I implement it
            Alert.alert("Sucesso", "Dados apagados com sucesso.");
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100, paddingHorizontal: 20 }}
    >
      <Text className="text-3xl font-bold text-foreground mb-8">Configurações</Text>

      <View className="bg-surface rounded-xl p-4 mb-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3 gap-3">
            <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
              <IconSymbol name="moon.fill" size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>
            <Text className="text-lg font-medium text-foreground">Modo Escuro</Text>
          </View>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#007AFF" }}
            thumbColor={colorScheme === "dark" ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View className="h-[1px] bg-border" />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3 gap-3">
            <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center">
              <IconSymbol name="bell.fill" size={18} color="#22c55e" />
            </View>
            <Text className="text-lg font-medium text-foreground">Notificações</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#22c55e" }}
            thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View className="h-[1px] bg-border" />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3 gap-3">
            <View className="w-8 h-8 rounded-full bg-orange-500/20 items-center justify-center">
              <IconSymbol name="speaker.wave.2.fill" size={18} color="#f97316" />
            </View>
            <Text className="text-lg font-medium text-foreground">Sons</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: "#767577", true: "#f97316" }}
            thumbColor={soundEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      <Text className="text-sm font-medium text-muted mb-2 uppercase ml-2">Dados</Text>
      <View className="bg-surface rounded-xl overflow-hidden mb-6">
        <TouchableOpacity
          className="p-4 flex-row items-center space-x-3 gap-3"
          onPress={handleClearData}
        >
          <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center">
            <IconSymbol name="trash.fill" size={18} color="#ef4444" />
          </View>
          <Text className="text-lg font-medium text-error">Apagar Todos os Dados</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center text-muted text-sm mt-8">
        Jarvis v1.0.0
      </Text>
    </ScrollView>
  );
}
