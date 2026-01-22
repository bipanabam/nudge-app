import { Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";

export const ConfirmDeleteSheet = forwardRef<
  BottomSheetModal,
  {
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
>(({ title, description, onConfirm, onCancel }, ref) => {
  const snapPoints = useMemo(() => ["37%"], []);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundStyle={{
        borderRadius: 32,
        backgroundColor: isDarkMode ? "#1C1C1E" : "#E8E6E1",
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? "black" : "#D1D1D1",
        width: 40,
      }}
    >
      <View className="px-6 pt-4 mb-6">
        <View className="items-center mb-4">
          <View className="h-14 w-14 rounded-full bg-red-100 items-center justify-center mb-3 dark:bg-red-900/30">
            <Feather name="trash-2" size={24} color="#EF4444" />
          </View>

          <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
            {title ?? "Delete routine?"}
          </Text>

          <Text className="text-center text-mutedForeground mt-2">
            {description ??
              "This action cannot be undone. Are you sure you want to delete it?"}
          </Text>
        </View>

        <View className="flex-row justify-between gap-4">
          <Pressable
            onPress={onConfirm}
            className="flex-1 rounded-xl py-4 items-center bg-red-500 dark:bg-destructive-dark"
          >
            <Text className="text-white font-bold text-base">Delete</Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            className="flex-1 rounded-xl py-4 items-center bg-secondary dark:bg-muted-dark"
          >
            <Text className="font-semibold text-foreground dark:text-foreground-dark">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
});
