import { ToastHost } from "@/components/ToastHost";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
