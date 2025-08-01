import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ExpenseProvider } from './src/context/ExpenseContext';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationPermissionModal from './src/components/NotificationPermissionModal';

export default function App() {
  return (
    <ExpenseProvider>
      <AppNavigator />
      <NotificationPermissionModal />
      <StatusBar style="light" />
    </ExpenseProvider>
  );
}
