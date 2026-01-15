import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const TabIcon = ({ focused, name }: any) => {
  if (focused){
    return (
      <Feather name={name} size={24} color='#7FAE9A' />
    )
  }
  return (
  <Feather name={name} size={21} color='#6A7C75' />
  )
};


const _Layout = () => {
  return (
    <Tabs
    screenOptions={{
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      tabBarStyle: {
        borderRadius: 50,
        marginHorizontal: 15,
        marginBottom: 36,
        height: 50,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#7FAE9A'
      },
      tabBarActiveTintColor: '#7FAE9A',
      tabBarInactiveTintColor: '#6A7C75'
    }}
    >
        <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon 
                focused={focused}
                name='home'
            />
          ),
        }}
        />
        <Tabs.Screen
        name='history'
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon 
                focused={focused}
                name='clock'
            />
          ),
        }}
        />
        <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon 
                focused={focused}
                name='settings'
            />
          ),
        }}
        />
    </Tabs>
  )
}

export default _Layout