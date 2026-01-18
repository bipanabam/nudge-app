import { NudgeLogo } from "@/components/NudgeLogo";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from "react";

import { FloatingAddButton } from "@/components/FloatingAddButton";
import { RoutineCard } from "@/components/RoutineCard";
import { defaultRoutines } from '@/data/defaultRoutines';
import { AddRoutine } from "@/routine/AddRoutine";
import { Routine, getRoutineStatus } from '@/types/routine';

import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const sheetRef = useRef<BottomSheetModal>(null);

  const handlePresentPress = () => sheetRef.current?.present();
  const handleClosePress = () => sheetRef.current?.dismiss();

  const loadRoutines = async () => {
    const stored = await AsyncStorage.getItem('routines');
    if (!stored) {
      await AsyncStorage.setItem('routines', JSON.stringify(defaultRoutines));
      setRoutines(defaultRoutines);
    } else {
      setRoutines(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  return (
    <>
    <View className="flex-1 bg-background">
      <View className="flex-1 p-4 rounded-xl">
        <ScrollView 
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 70
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
              onComplete={() => {}}
              onStartLaundry={() => {}}
            />
          ))}
        </ScrollView>
      </View>
    </View>
    {/* Floating Button */}
      <FloatingAddButton onPress={handlePresentPress} />

      {/* Bottom Sheet */}
      <AddRoutine
        ref={sheetRef}
        onAdded={() => {
          handleClosePress();
          loadRoutines();
        }}
      />
    </>
  );
}
