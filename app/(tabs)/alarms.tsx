import { View, Text, FlatList, Pressable, Alert, Switch } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { Alarm } from "@/lib/types";
import { alarmsStorage } from "@/lib/storage";
import { formatDate, formatTime } from "@/lib/nlp";
import * as Haptics from "expo-haptics";

export default function AlarmsScreen() {
  const colors = useColors();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    setLoading(true);
    const allAlarms = await alarmsStorage.getAlarms();
    setAlarms(allAlarms);
    setLoading(false);
  };

  const handleToggleAlarm = async (alarmId: string, currentActive: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await alarmsStorage.updateAlarm(alarmId, {
      active: !currentActive,
    });
    await loadAlarms();
  };

  const handleDeleteAlarm = (alarmId: string, description: string) => {
    Alert.alert(
      "Excluir alarme",
      `Tem certeza que quer excluir "${description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await alarmsStorage.deleteAlarm(alarmId);
            await loadAlarms();
          },
        },
      ]
    );
  };

  const getRecurrenceLabel = (recurrence: string): string => {
    switch (recurrence) {
      case "daily":
        return "Diário";
      case "weekly":
        return "Semanal";
      default:
        return "";
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Meus Alarmes</Text>
      </View>

      {/* Alarms List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Carregando alarmes...</Text>
        </View>
      ) : alarms.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="alarm-off" size={64} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground mt-4 text-center">
            Nenhum alarme
          </Text>
          <Text className="text-sm text-muted text-center mt-2">
            Use o chat para criar um novo alarme!
          </Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          renderItem={({ item }) => (
            <View
              className="bg-surface rounded-lg p-4 border border-border"
              style={{
                opacity: item.active ? 1 : 0.6,
              }}
            >
              {/* Top row: Time and Toggle */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name="alarm"
                    size={20}
                    color={item.active ? colors.primary : colors.muted}
                  />
                  <Text className="text-2xl font-bold text-foreground">
                    {item.time}
                  </Text>
                </View>
                <Switch
                  value={item.active}
                  onValueChange={() =>
                    handleToggleAlarm(item.id, item.active)
                  }
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor={item.active ? colors.primary : colors.muted}
                />
              </View>

              {/* Description */}
              <Text className="text-base text-foreground font-semibold mb-2">
                {item.description}
              </Text>

              {/* Date and Recurrence */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name="calendar-today"
                    size={16}
                    color={colors.muted}
                  />
                  <Text className="text-sm text-muted">
                    {formatDate(item.date)}
                  </Text>
                  {item.recurrence !== "none" && (
                    <>
                      <Text className="text-sm text-muted">•</Text>
                      <Text className="text-sm text-muted">
                        {getRecurrenceLabel(item.recurrence)}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* Delete Button */}
              <Pressable
                onPress={() => handleDeleteAlarm(item.id, item.description)}
                className="flex-row items-center justify-center gap-2 py-2 px-3 rounded-lg bg-error/10"
              >
                <MaterialIcons name="delete" size={18} color={colors.error} />
                <Text className="text-sm font-semibold text-error">
                  Excluir
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}
