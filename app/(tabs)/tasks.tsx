import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { Task } from "@/lib/types";
import { tasksStorage } from "@/lib/storage";
import { getTodayDate, formatDate, formatTime } from "@/lib/nlp";
import * as Haptics from "expo-haptics";

type TabType = "today" | "week" | "other";

export default function TasksScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const allTasks = await tasksStorage.getTasks();
    setTasks(allTasks);
    setLoading(false);
  };

  const getFilteredTasks = (): Task[] => {
    const today = getTodayDate();
    const weekStart = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    switch (activeTab) {
      case "today":
        return tasks.filter((t) => t.date === today && t.status === "pending");
      case "week":
        return tasks.filter(
          (t) =>
            t.date &&
            t.date > today &&
            t.date <= weekEndStr &&
            t.status === "pending"
        );
      case "other":
        return tasks.filter((t) => !t.date && t.status === "pending");
      default:
        return [];
    }
  };

  const handleToggleTask = async (taskId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const task = await tasksStorage.getTaskById(taskId);
    if (task) {
      await tasksStorage.updateTask(taskId, {
        status: task.status === "pending" ? "completed" : "pending",
      });
      await loadTasks();
    }
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    Alert.alert("Excluir tarefa", `Tem certeza que quer excluir "${title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await tasksStorage.deleteTask(taskId);
          await loadTasks();
        },
      },
    ]);
  };

  const filteredTasks = getFilteredTasks();
  const tabLabels = {
    today: "Hoje",
    week: "Semana",
    other: "Sem data",
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      {/* Tabs */}
      <View className="flex-row border-b border-border bg-background">
        {(["today", "week", "other"] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 py-4 px-4 items-center border-b-2"
            style={{
              borderBottomColor:
                activeTab === tab ? colors.primary : "transparent",
            }}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab ? "text-primary" : "text-muted"
              }`}
            >
              {tabLabels[tab]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tasks List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Carregando tarefas...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="check-circle" size={64} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground mt-4 text-center">
            Nenhuma tarefa
          </Text>
          <Text className="text-sm text-muted text-center mt-2">
            {activeTab === "today"
              ? "Você não tem tarefas para hoje!"
              : activeTab === "week"
                ? "Você não tem tarefas para esta semana!"
                : "Você não tem tarefas sem data!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          renderItem={({ item }) => (
            <View
              className="flex-row items-center gap-3 bg-surface rounded-lg p-3 border border-border"
              style={{ alignItems: "center" }}
            >
              <Pressable
                onPress={() => handleToggleTask(item.id)}
                className="p-2"
              >
                <MaterialIcons
                  name={
                    item.status === "completed"
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={24}
                  color={
                    item.status === "completed" ? colors.success : colors.muted
                  }
                />
              </Pressable>

              <View className="flex-1">
                <Text
                  className={`font-semibold ${
                    item.status === "completed"
                      ? "text-muted line-through"
                      : "text-foreground"
                  }`}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {item.date && (
                  <Text className="text-xs text-muted mt-1">
                    {formatDate(item.date)}
                    {item.time ? ` às ${formatTime(item.time)}` : ""}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => handleDeleteTask(item.id, item.title)}
                className="p-2"
              >
                <MaterialIcons name="delete" size={20} color={colors.error} />
              </Pressable>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}
