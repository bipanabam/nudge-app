import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

const STEP_KEY = "onboardingStep";
const DONE_KEY = "onboardingCompleted";

export const useOnboarding = () => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem(DONE_KEY);
      if (done === "true") {
        setStep(null);
        setLoading(false);
        return;
      }

      const savedStep = await AsyncStorage.getItem(STEP_KEY);
      setStep(savedStep ? Number(savedStep) : 0);
      setLoading(false);
    })();
  }, []);

  const saveStep = async (next: number) => {
    setStep(next);
    await AsyncStorage.setItem(STEP_KEY, String(next));
  };

  const finish = async () => {
    await AsyncStorage.setItem(DONE_KEY, "true");
    await AsyncStorage.removeItem(STEP_KEY);
    setStep(null);
    router.replace("/(onboarding)");
  };

  return { loading, step, saveStep, finish };
};
