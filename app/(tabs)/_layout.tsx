import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabIcon = ({ focused, name }: any) => (
  <Feather
    name={name}
    size={focused ? 24 : 21}
    color={focused ? "#7FAE9A" : "#6A7C75"}
  />
);
const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -2,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          height: 65,
          borderRadius: 50,
          marginHorizontal: 15,
          marginBottom: 25,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#7FAE9A",
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
