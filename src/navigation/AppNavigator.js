import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseListScreen from '../screens/ExpenseListScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Expenses') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Statistics') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Add" 
          component={AddExpenseScreen}
          options={{ title: 'Add Expense' }}
        />
        <Tab.Screen 
          name="Expenses" 
          component={ExpenseListScreen}
          options={{ title: 'Expense List' }}
        />
        <Tab.Screen 
          name="Statistics" 
          component={StatisticsScreen}
          options={{ title: 'Statistics' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}