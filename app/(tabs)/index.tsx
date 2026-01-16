import { NudgeLogo } from "@/components/NudgeLogo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

import { RoutineCard } from "@/components/RoutineCard";
import { defaultRoutines } from '@/data/defaultRoutines';
import { Routine, getRoutineStatus } from '@/types/routine';

import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const loadRoutines = async () => {
      const stored = await AsyncStorage.getItem('routines');

      if (!stored) {
        // First launch → seed defaults
        await AsyncStorage.setItem(
          'routines',
          JSON.stringify(defaultRoutines)
        );
        setRoutines(defaultRoutines);
      } else {
        setRoutines(JSON.parse(stored));
      }
    };

    loadRoutines();
  }, []);
  return (
      <View className="flex-1 bg-background p-4 rounded-xl">
        <ScrollView 
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 10
          }}
        > 
          {/* Logo */}
          <View className="flex-col mb-5">
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

        {/* <View className="bg-laundry-bg mt-4 p-3 rounded-lg">
          <Text className="text-laundry-fg">
            Laundry routine
          </Text>
        </View> */}
      </View>
  );
}
