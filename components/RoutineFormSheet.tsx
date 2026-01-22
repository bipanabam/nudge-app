import { buildScheduleConfig } from "@/factories/buildScheduleConfig";
import {
  initRoutine,
  updateRoutineWithNotifications,
} from "@/factories/routineManager";
import { formatTime12h } from "@/hooks/helpers";
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
  useColorScheme,
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

export const RoutineFormSheet = forwardRef<
  BottomSheetModal,
  {
    mode: "add" | "edit";
    routine?: Routine | null;
    onDone: () => void;
  }
>(({ mode, routine, onDone }, ref) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
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
        const routine = await initRoutine({
          type,
          name: name || routineTypeConfig[type].label,
          schedule,
        });
        await addRoutine(routine);
      } else if (mode === "edit" && routine) {
        const updatedRoutine = await updateRoutineWithNotifications(routine, {
          name: name || routineTypeConfig[type].label,
          type,
          scheduleConfig: schedule,
        });

        await updateRoutine(updatedRoutine);
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
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? "black" : "#D1D1D1",
        width: 40,
      }}
      backgroundStyle={{
        backgroundColor: isDarkMode ? "#1C1C1E" : "#E8E6E1", // dark/light mode
        borderRadius: 32,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
            {mode === "add" ? "Add Routine" : "Edit Routine"}
          </Text>
          <Pressable
            onPress={() => onDone()}
            className="rounded-xl h-9 w-9 items-center justify-center bg-secondary dark:bg-card-dark"
          >
            <Text className="text-lg text-foreground dark:text-foreground-dark">
              ✕
            </Text>
          </Pressable>
        </View>

        {/* Routine Type Selector */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
            Routine Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(routineTypeConfig) as RoutineType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => handleTypeSelect(t)}
                className={`px-4 py-2 rounded-2xl border ${
                  type === t
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-200 dark:bg-muted-dark dark:border-muted-dark"
                }`}
              >
                <Text
                  className={`text-base font-semibold ${type === t ? "text-white" : "text-foreground dark:text-foreground-dark"}`}
                >
                  {routineTypeConfig[t].emoji} {routineTypeConfig[t].label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Name Input */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
            Name
          </Text>
          <TextInput
            placeholder={namePlaceholder[type]}
            value={name}
            onChangeText={setName}
            className="bg-secondary rounded-2xl p-4 h-16 text-base border border-secondary shadow-sm 
            dark:bg-muted-dark dark:border-muted-dark dark:text-foreground-dark"
            placeholderTextColor="#999"
          />
        </View>
        {/* Type-Specific Configuration */}
        <View className="mb-11">
          {type === "laundry" && (
            <View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-lg font-bold text-foreground mb-3 dark:text-foreground-dark">
                  Duration
                </Text>
                <Text className="text-primary dark:text-primary-dark font-bold mr-2">
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
              <Text className="text-lg font-bold text-foreground mb-3 dark:text-foreground-dark">
                Feeding Times
              </Text>
              {feedingTimes.map((time, i) => (
                <View key={i} className="flex-row items-center gap-2 mb-2">
                  <Pressable
                    onPress={() => setPickerIndex(i)}
                    className="flex-1 flex-row items-center justify-between bg-secondary p-4 rounded-xl mb-2 dark:bg-muted-dark"
                  >
                    <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
                      {formatTime12h(time)}
                    </Text>
                    <Feather name="clock" size={18} color="#6B9E9E" />
                  </Pressable>
                  <Pressable
                    onPress={() => removeFeedingTime(i)}
                    className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl"
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </Pressable>
                </View>
              ))}

              {pickerIndex !== null && (
                <View className="bg-secondary dark:bg-muted-dark rounded-3xl p-4">
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
                <Text className="text-primary dark:text-primary-dark font-semibold text-sm">
                  + Add feeding time
                </Text>
              </Pressable>
            </View>
          )}

          {type === "trash" && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-3 dark:text-foreground-dark">
                Pickup Days
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {weekDays.map((day, i) => (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(i)}
                    className={`px-3 py-2 rounded-xl ${
                      selectedDays.includes(i)
                        ? "bg-primary border-primary"
                        : "bg-secondary border-muted dark:bg-muted-dark dark:border-muted-dark"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        selectedDays.includes(i)
                          ? "text-white"
                          : "text-foreground dark:text-foreground-dark"
                      }`}
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
                <Text className="text-lg font-bold text-foreground mb-3 dark:text-foreground-dark">
                  Watering Interval (days)
                </Text>
                <Text className="text-primary dark:text-primary-dark font-bold">
                  {intervalDays}
                </Text>
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
        {/* Add/Edit Button */}
        <Pressable
          disabled={isSaving}
          onPress={handleSave}
          className={`rounded-xl py-4 px-5 items-center mb-6 ${
            isSaving
              ? "bg-gray-400 dark:bg-gray-700"
              : "bg-primary dark:bg-primary-dark"
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
