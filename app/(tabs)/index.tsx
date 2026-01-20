import { NudgeLogo } from "@/components/NudgeLogo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConfirmDeleteSheet } from "@/components/ConfirmDeleteSheet";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { RoutineActionsSheet } from "@/components/RoutineActionsSheet";
import { RoutineCard } from "@/components/RoutineCard";
import { RoutineFormSheet } from "@/components/RoutineFormSheet";
import { defaultRoutines } from "@/data/defaultRoutines";
import { completeRoutine } from "@/factories/routineManager";
import {
  getRoutineById,
  saveRoutine
} from "@/storage/routineStorage";
import { Routine, getRoutineStatus, showRoutineToast } from "@/types/routine";

import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const [routines, setRoutines] = useState<Routine[]>([]);
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

  const loadRoutines = async () => {
    const stored = await AsyncStorage.getItem("routines");
    if (!stored) {
      await AsyncStorage.setItem("routines", JSON.stringify(defaultRoutines));
      setRoutines(defaultRoutines);
    } else {
      setRoutines(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const handleCompleteRoutine = async (id: string) => {
    const routine = await getRoutineById(id);
    if (!routine) return;

    await completeRoutine(routine);

    // Update state immediately
    setRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
    showRoutineToast(routine, "complete");
  };

  const startLaundry = async (id: string) => {
    const routine = await getRoutineById(id);
    if (!routine) return;

    routine.lastCompletedAt = null;
    routine.nextReminderAt = new Date(
      Date.now() + routine.scheduleConfig.durationMinutes! * 60_000,
    );

    await saveRoutine(routine);
    // Refresh routines state
    setRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
    showRoutineToast(routine, "start");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <View className="flex-1 bg-background">
        <View className="flex-1 p-4 rounded-xl">
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              minHeight: "100%",
              paddingBottom: 70,
            }}
          >
            {/* Logo */}
            <View className="flex-col mb-5 mt-4 gap-1">
              <Text className="text-foreground text-sm">Good afternoon 👋</Text>
              <NudgeLogo />
            </View>
            {/* Stats */}
            {/* Routine */}
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                status={getRoutineStatus(routine)}
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
          loadRoutines();
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

          confirmDeleteRef.current?.dismiss();
          actionsSheetRef.current?.dismiss();
        }}
      />
    </SafeAreaView>
  );
}
