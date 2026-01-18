import { buildScheduleConfig } from "@/factories/buildScheduleConfig";
import { createRoutine } from "@/factories/createRoutine";
import { addRoutine, updateRoutine } from "@/storage/routineStorage";
import { Routine, RoutineType } from "@/types/routine";
import { Feather } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const routineTypeConfig = {
  laundry: { emoji: "🧺", label: "Laundry" },
  plant: { emoji: "🪴", label: "Plant" },
  pet: { emoji: "🐕", label: "Pet Feeding" },
  trash: { emoji: "🗑️", label: "Trash" },
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const namePlaceholder: Record<RoutineType, string> = {
  laundry: "e.g., Weekly Laundry",
  plant: "e.g., Balcony Plants/Monstera",
  pet: "e.g., Haru (Pet name)",
  trash: "e.g., Recycling Pickup",
};

export const formatTime12h = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

export const RoutineFormSheet = forwardRef<
  BottomSheetModal,
  {
    mode: "add" | "edit";
    routine?: Routine | null;
    onDone: () => void;
  }
>(({ mode, routine, onDone }, ref) => {
  const [type, setType] = useState<RoutineType>("laundry");
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Dynamic Config States
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [intervalDays, setIntervalDays] = useState(3);
  const [feedingTimes, setFeedingTimes] = useState<string[]>([
    "08:00",
    "18:00",
  ]);
  const snapPoints = useMemo(() => {
    if (type === "pet") {
      const baseHeight = 0.75; // height for 2 feeding times
      const extraRows = feedingTimes.length - 2;
      const extraHeight = extraRows > 0 ? extraRows * 0.08 : 0;
      const finalHeight = Math.min(baseHeight + extraHeight, 0.95);
      return [`${finalHeight * 100}%`];
    }
    // Default for other types
    return ["62%"];
  }, [type, feedingTimes.length]);

  const [selectedDays, setSelectedDays] = useState<number[]>([1, 4]);
  const [isRecycling, setIsRecycling] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (mode === "edit" && routine) {
      setType(routine.type);
      setName(routine.name);

      const config = routine.scheduleConfig;

      if (routine.type === "laundry") {
        setDurationMinutes(config.durationMinutes ?? 45);
      }

      if (routine.type === "plant") {
        setIntervalDays(config.intervalDays ?? 3);
      }

      if (routine.type === "pet") {
        setFeedingTimes(config.feedingTimes ?? ["08:00", "18:00"]);
      }

      if (routine.type === "trash") {
        setSelectedDays(config.pickupDays ?? []);
        setIsRecycling(config.isRecycling ?? false);
      }
    }
  }, [mode, routine]);

  const onTimeChange = (_: any, selected?: Date) => {
    if (!selected || pickerIndex === null) return;

    const hours24 = selected.getHours();
    const minutes = selected.getMinutes();

    const hh = hours24.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    updateFeedingTime(pickerIndex, `${hh}:${mm}`);
    setPickerIndex(null);
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.6}
      // Custom component for blur
      children={
        <BlurView style={{ flex: 1 }} intensity={80} tint="extraLight" />
      }
    />
  );

  const handleTypeSelect = (selectedType: RoutineType) => {
    setType(selectedType);
    // Set default name based on type
    //   setName(routineTypeConfig[selectedType].label);
  };

  // Feeding Time Helpers
  const addFeedingTime = () => {
    if (feedingTimes.length >= 4) {
      Toast.show({
        type: "error",
        text1: "Limit reached",
        text2: "You can add up to 4 feeding times only",
      });
      return;
    }
    setFeedingTimes([...feedingTimes, "12:00"]);
  };
  const removeFeedingTime = (index: number) =>
    setFeedingTimes(feedingTimes.filter((_, i) => i !== index));
  const updateFeedingTime = (index: number, val: string) => {
    const updated = [...feedingTimes];
    updated[index] = val;
    setFeedingTimes(updated);
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort(),
    );
  };

  const resetForm = () => {
    setName("");
    setType("laundry");
    setDurationMinutes(45);
    setIntervalDays(3);
    setFeedingTimes(["08:00", "18:00"]);
    setSelectedDays([1, 4]);
    setIsRecycling(false);
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      const schedule = buildScheduleConfig(type, {
        laundry: { durationMinutes },
        plant: { intervalDays },
        pet: { feedingTimes },
        trash: { pickupDays: selectedDays, isRecycling },
      });

      if (mode === "add") {
        await addRoutine(
          createRoutine({
            type,
            name: name || routineTypeConfig[type].label,
            schedule,
          }),
        );
      } else if (mode === "edit" && routine) {
        await updateRoutine({
          ...routine,
          name: name || routineTypeConfig[type].label,
          type,
          scheduleConfig: schedule,
        });
      }
      Toast.show({
        type: "success",
        text1: `Routine ${mode}ed 🎉`,
        text2: `${name || routineTypeConfig[type].label} ${mode}ed successfully`,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDone();
    } catch (e) {
      console.error(e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture
      enableHandlePanningGesture
      enableDynamicSizing={false}
      onDismiss={resetForm}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#D1D1D1", width: 40 }}
      backgroundStyle={{ backgroundColor: "#E8E6E1", borderRadius: 32 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-foreground">
            {mode === "add" ? "Add Routine" : "Edit Routine"}
          </Text>
          <Pressable
            onPress={() => onDone()}
            className="rounded-xl h-9 w-9 items-center justify-center bg-secondary"
          >
            <Text className="text-lg text-foreground">✕</Text>
          </Pressable>
        </View>

        {/* Routine Type Selector */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-foreground mb-2">
            Routine Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(routineTypeConfig) as RoutineType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => handleTypeSelect(t)}
                className={`px-4 py-2 rounded-2xl border ${
                  type === t
                    ? "bg-[#6B9E9E] border-[#6B9E9E]"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-base font-semibold ${type === t ? "text-white" : "text-gray-700"}`}
                >
                  {routineTypeConfig[t].emoji} {routineTypeConfig[t].label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Name Input */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-foreground mb-2">Name</Text>
          <TextInput
            placeholder={namePlaceholder[type]}
            value={name}
            onChangeText={setName}
            className="bg-secondary rounded-2xl p-4 h-16 text-base border border-secondary shadow-sm"
            placeholderTextColor="#999"
          />
        </View>
        {/* Type-Specific Configuration */}
        <View className="mb-11">
          {type === "laundry" && (
            <View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-lg font-bold text-foreground mb-3">
                  Duration
                </Text>
                <Text className="text-primary font-bold mr-2">
                  {durationMinutes}m
                </Text>
              </View>
              <Slider
                value={durationMinutes}
                onValueChange={setDurationMinutes}
                minimumValue={15}
                maximumValue={120}
                step={5}
                minimumTrackTintColor="#6B9E9E"
                thumbTintColor="#6B9E9E"
              />
            </View>
          )}

          {type === "pet" && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">
                Feeding Times
              </Text>
              {feedingTimes.map((time, i) => (
                <View key={i} className="flex-row items-center gap-2 mb-2">
                  <Pressable
                    onPress={() => setPickerIndex(i)}
                    className="flex-1 flex-row items-center justify-between bg-white p-4 rounded-xl mb-2"
                  >
                    <Text className="text-base font-medium">
                      {formatTime12h(time)}
                    </Text>
                    <Feather name="clock" size={18} color="#6B9E9E" />
                  </Pressable>
                  <Pressable
                    onPress={() => removeFeedingTime(i)}
                    className="p-3 bg-red-50 rounded-xl"
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </Pressable>
                </View>
              ))}

              {pickerIndex !== null && (
                <View className="bg-background rounded-3xl p-4">
                  <DateTimePicker
                    mode="time"
                    value={new Date()}
                    is24Hour={false}
                    display="spinner"
                    accentColor="#6B9E9E"
                    onChange={onTimeChange}
                  />
                </View>
              )}

              <Pressable onPress={addFeedingTime} className="mt-2">
                <Text className="text-primary font-semibold text-sm">
                  + Add feeding time
                </Text>
              </Pressable>
            </View>
          )}

          {type === "trash" && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">
                Pickup Days
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {weekDays.map((day, i) => (
                  <Pressable
                    key={day}
                    onPress={() =>
                      setSelectedDays((prev) =>
                        prev.includes(i)
                          ? prev.filter((d) => d !== i)
                          : [...prev, i],
                      )
                    }
                    className={`px-3 py-2 rounded-xl ${selectedDays.includes(i) ? "bg-[#6B9E9E]" : "bg-white border border-gray-100"}`}
                  >
                    <Text
                      className={`text-xs font-bold ${selectedDays.includes(i) ? "text-white" : "text-gray-500"}`}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {type === "plant" && (
            <View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-lg font-bold text-foreground mb-3">
                  Watering Interval (days)
                </Text>
                <Text className="text-primary font-bold">{intervalDays}</Text>
              </View>
              <Slider
                value={intervalDays}
                onValueChange={setIntervalDays}
                minimumValue={1}
                maximumValue={14}
                step={1}
                minimumTrackTintColor="#6B9E9E"
                // maximumTrackTintColor="#DDD"
                thumbTintColor="#6B9E9E"
              />
            </View>
          )}
        </View>
        {/* 
          {type === 'trash' && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-3">Pickup Days</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {weekDays.map((day, index) => (
                  <Pressable
                    key={index}
                    onPress={() => toggleDay(index)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedDays.includes(index)
                        ? 'bg-[#6B9E9E] border-[#6B9E9E]'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedDays.includes(index) ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() => setIsRecycling(!isRecycling)}
                className="flex-row items-center gap-3"
              >
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center ${
                    isRecycling ? 'bg-[#6B9E9E] border-[#6B9E9E]' : 'bg-white border-gray-300'
                  }`}
                >
                  {isRecycling && <Text className="text-white text-sm">✓</Text>}
                </View>
                <Text className="text-base text-gray-900">Recycling Day</Text>
              </Pressable>
            </View>
          )} */}

        {/* Add/Edit Button */}
        <Pressable
          disabled={isSaving}
          onPress={handleSave}
          className={`rounded-xl py-4 px-5 items-center mb-6 ${
            isSaving ? "bg-gray-400" : "bg-[#6B9E9E]"
          }`}
        >
          {isSaving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold text-base">Saving...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-base">
              {mode === "add" ? "Add Routine" : "Save Changes"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </BottomSheetModal>
  );
});
