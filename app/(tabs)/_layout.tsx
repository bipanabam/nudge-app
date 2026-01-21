import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ focused, name }: any) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      width: 24,
      height: 24,
    }}
  >
    <Feather
      name={name}
      size={focused ? 24 : 22}
      color={focused ? "#7FAE9A" : "#6A7C75"}
    />
  </View>
);

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          paddingBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          height: 60,
          borderRadius: 32,
          marginHorizontal: 20,
          marginBottom: 30,
          position: "absolute",
          borderWidth: 1,
          borderColor: "#7FAE9A",
          // Add elevation and shadow for a "floating" look
          backgroundColor: "white",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: "#7FAE9A",
        tabBarInactiveTintColor: "#6A7C75",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="clock" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="settings" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
