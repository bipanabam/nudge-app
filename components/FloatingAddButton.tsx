import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

export const FloatingAddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 96,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 32,
        backgroundColor: "#7FAE9A",
        alignItems: "center",
        justifyContent: "center",
        elevation: 12,
        zIndex: 1000,
      }}
      // className="absolute bottom-24 right-5 w-16 h-16 rounded-full bg-primary items-center justify-center shadow-lg"
    >
      <Feather name="plus" size={28} color="white" />
    </Pressable>
  );
};
