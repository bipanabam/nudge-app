import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";
import { ToastHost } from "@/components/ToastHost";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { registerNotificationListeners } from "@/utils/notificationListeners";
import { setupAndroidNotificationChannel } from "@/utils/notifications";
import { registerNotificationCategories } from "@/utils/notificationsCategories";
import { rescheduleAllRoutines } from "@/utils/routineNotifications";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isFirstLaunch, isLoading } = useFirstLaunch();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false);

  useEffect(() => {
    setupAndroidNotificationChannel();
    registerNotificationCategories();
    registerNotificationListeners();
    rescheduleAllRoutines();
  }, []);

  // When first launch check is done, hide the native splash
  useEffect(() => {
    if (!isLoading) {
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (!isAppReady || !isSplashAnimationComplete) {
    return (
      <SafeAreaProvider>
        <AnimatedSplashScreen
          onAnimationFinish={() => setIsSplashAnimationComplete(true)}
        />
      </SafeAreaProvider>
    );
  }

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
                    <Stack.Screen
                      name="(onboarding)"
                      options={{ animation: "fade" }}
                    />
                  ) : (
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
