import { requestPermissions } from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "notificationsEnabled";
const FIRST_LAUNCH_KEY = "hasLaunchedBefore";

type NotificationsContextType = {
  enabled: boolean;
  loading: boolean;
  toggle: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  enabled: false,
  loading: true,
  toggle: async () => {},
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunchedBefore");
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (!hasLaunched) {
        // first launch — do NOT ask permission yet
        await AsyncStorage.setItem("hasLaunchedBefore", "true");
        setEnabled(false);
      } else {
        setEnabled(saved === "true");
      }

      setLoading(false);
    })();
  }, []);

  const toggle = async () => {
    if (!enabled) {
      const granted = await requestPermissions();
      if (granted) {
        setEnabled(true);
        await AsyncStorage.setItem(STORAGE_KEY, "true");
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setEnabled(false);
        await AsyncStorage.setItem(STORAGE_KEY, "false");
      }
    } else {
      // disable
      setEnabled(false);
      await AsyncStorage.setItem(STORAGE_KEY, "false");
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  return (
    <NotificationsContext.Provider value={{ enabled, loading, toggle }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
