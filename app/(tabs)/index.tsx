import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConfirmDeleteSheet } from "@/components/ConfirmDeleteSheet";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { RoutineActionsSheet } from "@/components/RoutineActionsSheet";
import { RoutineCard } from "@/components/RoutineCard";
import { RoutineFormSheet } from "@/components/RoutineFormSheet";
import { completeRoutine } from "@/factories/routineManager";
import { getRoutineById, saveRoutine } from "@/storage/routineStorage";
import { Routine, showRoutineToast } from "@/types/routine";

import Header from "@/components/Header";
import { useRoutines } from "@/hooks/useRoutines";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const { routines, setRoutines, refreshRoutines } = useRoutines();
  const routineFormRef = useRef<BottomSheetModal>(null);
  const actionsSheetRef = useRef<BottomSheetModal>(null);
  const confirmDeleteRef = useRef<BottomSheetModal>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  const openActions = (routine: Routine) => {
    setSelectedRoutine(routine);
    actionsSheetRef.current?.present();
  };

  const handlePresentPress = () => routineFormRef.current?.present();
  const handleClosePress = () => routineFormRef.current?.dismiss();

  const handleCompleteRoutine = async (id: string) => {
    const routine = await getRoutineById(id);
    if (!routine) return;

    await completeRoutine(routine);
    if (routine.type === "laundry") {
      routine.inProgress = false;
    }
    await saveRoutine(routine);
    showRoutineToast(routine, "complete");

    await refreshRoutines();
  };

  const startLaundry = async (id: string) => {
    const routine = await getRoutineById(id);
    if (!routine) return;

    routine.inProgress = true;
    routine.lastCompletedAt = null;
    routine.nextReminderAt = new Date(
      Date.now() + routine.scheduleConfig.durationMinutes! * 60_000,
    );

    await saveRoutine(routine);
    showRoutineToast(routine, "start");

    await refreshRoutines();
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-1 p-4 rounded-xl">
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              minHeight: "100%",
              paddingBottom: 70,
            }}
          >
            {/* Header */}
            <Header />

            {/* Stats */}
            {/* Routine */}
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                status={routine.status}
                progressCount={routine.progressCount}
                targetCount={routine.targetCount}
                onMorePress={() => openActions(routine)}
                onComplete={handleCompleteRoutine}
                onStartLaundry={startLaundry}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {/* Floating Button */}
      <FloatingAddButton onPress={handlePresentPress} />

      {/* Bottom Sheet */}
      <RoutineFormSheet
        ref={routineFormRef}
        mode={selectedRoutine ? "edit" : "add"}
        routine={selectedRoutine}
        onDone={() => {
          setSelectedRoutine(null);
          handleClosePress();
          refreshRoutines();
        }}
      />
      <RoutineActionsSheet
        ref={actionsSheetRef}
        routineName={selectedRoutine?.name}
        routineType={selectedRoutine?.type}
        onEdit={() => {
          actionsSheetRef.current?.dismiss();
          setTimeout(() => {
            routineFormRef.current?.present();
          }, 250);
        }}
        onDelete={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          actionsSheetRef.current?.dismiss();

          setTimeout(() => {
            confirmDeleteRef.current?.present();
          }, 200);
        }}
        onBack={() => {
          actionsSheetRef.current?.dismiss();
        }}
      />
      <ConfirmDeleteSheet
        ref={confirmDeleteRef}
        title="Delete routine?"
        description={`Are you sure you want to delete "${selectedRoutine?.name}"?`}
        onCancel={() => confirmDeleteRef.current?.dismiss()}
        onConfirm={async () => {
          if (!selectedRoutine) return;

          const updated = routines.filter((r) => r.id !== selectedRoutine.id);

          setRoutines(updated);
          await AsyncStorage.setItem("routines", JSON.stringify(updated));

          Toast.show({
            type: "success",
            text1: `Routine deleted successfully`,
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          confirmDeleteRef.current?.dismiss();
          actionsSheetRef.current?.dismiss();
        }}
      />
    </SafeAreaView>
  );
}
