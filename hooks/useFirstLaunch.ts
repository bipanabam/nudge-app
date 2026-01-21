import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const DONE_KEY = "onboardingCompleted";

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const done = await AsyncStorage.getItem(DONE_KEY);
        // If 'done' is "true", it is NOT the first launch
        setIsFirstLaunch(done !== "true");
      } catch (e) {
        setIsFirstLaunch(false); // Fallback to main app on error
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { isFirstLaunch, isLoading };
};
