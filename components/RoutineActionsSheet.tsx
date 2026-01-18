import { getRoutineIcon } from "@/types/routine";
import { Feather } from "@expo/vector-icons";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { forwardRef, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  routineName?: string;
  routineType?: string;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export const RoutineActionsSheet = forwardRef<BottomSheetModal, Props>(
  ({ routineName, routineType, onEdit, onDelete, onBack }, ref) => {
    const snapPoints = useMemo(() => ["40%"], []);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        children={
          <BlurView style={{ flex: 1 }} intensity={80} tint="extraLight" />
        }
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "white", width: 40 }}
        backgroundStyle={{ backgroundColor: "#E8E6E1", borderRadius: 32 }}
      >
        <BottomSheetView className="px-6 py-4 pb-12 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row gap-3 items-center justify-center">
              <Text className="h-10 w-10 text-3xl">
                {getRoutineIcon(routineType)}
              </Text>
              <View className="flex-col items-start">
                <Text className="text-2xl font-bold text-foreground">
                  {routineName}
                </Text>
                <Text className="text-gray-500">Choose an action</Text>
              </View>
            </View>
            <Pressable
              onPress={() => onBack()}
              className="rounded-xl h-9 w-9 items-center justify-center bg-secondary"
            >
              <Text className="text-lg text-foreground">✕</Text>
            </Pressable>
          </View>

          {/* Edit */}
          <Pressable
            onPress={onEdit}
            className="flex-row items-center gap-3 p-4 rounded-xl bg-secondary"
          >
            <View className="rounded-[10px] items-center justify-center bg-card w-10 h-10">
              <Feather name="edit-2" size={18} color="#7FAE9A" />
            </View>
            <View>
              <Text className="font-medium">Edit Routine</Text>
              <Text className="text-xs text-muted-foreground text-gray-500">
                Change name or schedule
              </Text>
            </View>
          </Pressable>

          {/* Delete */}
          <Pressable
            onPress={onDelete}
            className="flex-row items-center gap-3 p-4 rounded-xl bg-red-50 mb-8"
          >
            <View className="rounded-[10px] items-center justify-center bg-red-100 w-10 h-10">
              <Feather name="trash-2" size={18} color="#DC2626" />
            </View>
            <View>
              <Text className="font-medium text-red-600">Delete Routine</Text>
              <Text className="text-xs text-gray-500">
                Remove this routine permanently
              </Text>
            </View>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
