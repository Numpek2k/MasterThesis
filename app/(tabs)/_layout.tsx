import {Tabs} from 'expo-router';
import React from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="activityJournal"
        options={{
          title: 'Aktywność',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="caloriesJournal"
        options={{
          title: 'Kalorie',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'nutrition' : 'nutrition-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="weeklyRank"
        options={{
          title: 'Ranga',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'medal' : 'medal-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="achievments"
        options={{
          title: 'Osiągnięcia',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'pricetag' : 'pricetag-outline'} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}
