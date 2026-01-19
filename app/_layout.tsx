import { NotificationsProvider } from "@/app/context/NotificationsContext";
import { ToastHost } from "@/components/ToastHost";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import { registerNotificationListeners } from "@/utils/notificationListeners";
import { registerNotificationCategories } from "@/utils/notificationsCategories";
import { rescheduleAllRoutines } from "@/utils/routineNotifications";

export default function RootLayout() {
  useEffect(() => {
    registerNotificationCategories();
    registerNotificationListeners();
    rescheduleAllRoutines();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationsProvider>
          <PortalProvider>
            <PortalHost name="root" />
            <BottomSheetModalProvider>
              <>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />
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
