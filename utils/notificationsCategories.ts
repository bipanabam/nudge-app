import * as Notifications from "expo-notifications";

export const ROUTINE_CATEGORY = "ROUTINE_ACTIONS";

export const registerNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync(ROUTINE_CATEGORY, [
    {
      identifier: "DONE",
      buttonTitle: "Done ✅",
      options: {
        opensAppToForeground: false,
      },
    },
    {
      identifier: "SNOOZE_10",
      buttonTitle: "Snooze 10m ⏳",
      options: {
        opensAppToForeground: false,
      },
    },
  ]);
};
