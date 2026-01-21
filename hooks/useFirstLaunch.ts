import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FIRST_LAUNCH_KEY = "hasLaunchedBefore";

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const hasLaunched = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);

      if (hasLaunched === null) {
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    })();
  }, []);

  return isFirstLaunch;
};
