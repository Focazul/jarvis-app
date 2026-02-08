import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppSettings = {
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  soundEnabled: boolean;
};

const SETTINGS_KEY = "jarvis_settings";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  notificationsEnabled: true,
  soundEnabled: true,
};

export const settingsStorage = {
  async getSettings(): Promise<AppSettings> {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Error loading settings:", error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving settings:", error);
      return DEFAULT_SETTINGS;
    }
  },
};
