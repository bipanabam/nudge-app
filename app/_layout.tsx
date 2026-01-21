import { ToastHost } from "@/components/ToastHost";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { registerNotificationListeners } from "@/utils/notificationListeners";
import { setupAndroidNotificationChannel } from "@/utils/notifications";
import { registerNotificationCategories } from "@/utils/notificationsCategories";
import { rescheduleAllRoutines } from "@/utils/routineNotifications";

export default function RootLayout() {
  const { isFirstLaunch, isLoading } = useFirstLaunch();

  useEffect(() => {
    setupAndroidNotificationChannel();
    registerNotificationCategories();
    registerNotificationListeners();
    rescheduleAllRoutines();
  }, []);

  if (isLoading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationsProvider>
          <PortalProvider>
            <PortalHost name="root" />
            <BottomSheetModalProvider>
              <>
                <Stack screenOptions={{ headerShown: false }}>
                  {isFirstLaunch ? (
                    // Onboarding
                    <Stack.Screen
                      name="(onboarding)"
                      options={{ animation: "fade" }}
                    />
                  ) : (
                    // Main App
                    <Stack.Screen
                      name="(tabs)"
                      options={{ animation: "fade" }}
                    />
                  )}
                </Stack>
              </>
            </BottomSheetModalProvider>
            <ToastHost />
          </PortalProvider>
        </NotificationsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
