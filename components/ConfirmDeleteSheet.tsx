import { Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

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

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundStyle={{ borderRadius: 28, backgroundColor: "#FFF" }}
      handleIndicatorStyle={{ width: 40 }}
    >
      <View className="px-6 pt-4">
        <View className="items-center mb-4">
          <View className="h-14 w-14 rounded-full bg-red-100 items-center justify-center mb-3">
            <Feather name="trash-2" size={24} color="#EF4444" />
          </View>

          <Text className="text-xl font-bold text-foreground">
            {title ?? "Delete routine?"}
          </Text>

          <Text className="text-center text-gray-500 mt-2">
            {description ??
              "This action cannot be undone. Are you sure you want to delete it?"}
          </Text>
        </View>

        <Pressable
          onPress={onConfirm}
          className="bg-red-500 rounded-xl py-4 mb-3 items-center"
        >
          <Text className="text-white font-bold text-base">Delete</Text>
        </Pressable>

        <Pressable
          onPress={onCancel}
          className="bg-gray-100 rounded-xl py-4 items-center"
        >
          <Text className="font-semibold text-gray-700">Cancel</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
});
