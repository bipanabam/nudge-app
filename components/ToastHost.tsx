import { Portal } from "@gorhom/portal";
import * as Haptics from "expo-haptics";
import { Bell, Check } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";

export const ToastHost = () => {
  return (
    <Portal hostName="root">
      <Toast
        position="top"
        topOffset={Platform.OS === "ios" ? 60 : 40}
        visibilityTime={2000}
        config={{
          // Custom "Nudge" theme
          nudge: ({
            text1,
            text2,
            props,
          }: BaseToastProps & {
            props: { icon?: string; onComplete?: () => void };
          }) => (
            <View
              className="mx-4 bg-secondary dark:bg-muted-dark border border-secondary dark:border-muted-dark rounded-2xl p-4 shadow-xl shadow-black/5 flex-row items-center justify-between"
              style={{ width: "92%" }}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className="bg-primary/10 rounded-full p-2 mr-3">
                  {props.icon ? (
                    <Text className="text-xl">{props.icon}</Text>
                  ) : (
                    <Bell size={18} color="#2F3A36" />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className="text-foreground dark:text-foreground-dark font-bold text-sm leading-tight"
                    numberOfLines={1}
                  >
                    {text1}
                  </Text>
                  <Text
                    className="text-mutedForeground text-xs mt-0.5 dark:text-mutedForeground-dark"
                    numberOfLines={1}
                  >
                    {text2}
                  </Text>
                </View>
              </View>

              {/* The Action Button */}
              {props.onComplete && (
                <Pressable
                  onPress={async () => {
                    await Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    props.onComplete?.();
                    Toast.hide();
                  }}
                  className="bg-primary px-3 py-2 rounded-xl flex-row items-center gap-1 active:opacity-80 dark:bg-primary-dark"
                >
                  <Check size={14} color="white" strokeWidth={3} />
                  <Text className="text-white font-bold text-xs dark:text-foreground">
                    Done
                  </Text>
                </Pressable>
              )}
            </View>
          ),
          info: (internalProps) => (
            <View className="mx-4 bg-zinc-800 rounded-xl p-4 w-[90%]">
              <Text className="text-secondary font-bold dark:text-muted-dark">
                {internalProps.text1}
              </Text>
              {internalProps.text2 && (
                <Text className="text-muted text-xs dark:text-muted-dark">
                  {internalProps.text2}
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Portal>
  );
};
