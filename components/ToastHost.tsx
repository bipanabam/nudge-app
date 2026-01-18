import { Portal } from "@gorhom/portal";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const ToastHost = () => {
  return (
    <Portal hostName="root">
      <Toast
        position="top"
        topOffset={50}
        visibilityTime={1000}
        config={{
          info: (internalProps) => (
            <View
              style={{
                backgroundColor: "#6B9E9E",
                padding: 12,
                borderRadius: 12,
                marginHorizontal: 16,
                zIndex: 9999, // force above BottomSheet
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {internalProps.text1}
              </Text>
              {internalProps.text2 && (
                <Text style={{ color: "white" }}>{internalProps.text2}</Text>
              )}
            </View>
          ),
        }}
      />
    </Portal>
  );
};
