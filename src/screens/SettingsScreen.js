import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';
import { useExpenses } from '../context/ExpenseContext';

export default function SettingsScreen() {
  const { 
    isEnabled: notificationsEnabled,
    enableNotifications,
    disableNotifications,
    testNotification,
    requestPermissions,
  } = useNotifications();
  
  const { expenses } = useExpenses();
  const [isToggling, setIsToggling] = useState(false);

  const handleNotificationToggle = async (value) => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    try {
      if (value) {
        const success = await enableNotifications();
        if (!success) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily spending reminders.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
            ]
          );
        }
      } else {
        await disableNotifications();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsToggling(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const success = await testNotification();
      if (success) {
        Alert.alert('Test Sent', 'Check your notifications!');
      } else {
        Alert.alert('Permission Required', 'Please enable notifications first');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const SettingItem = ({ title, subtitle, icon, rightComponent, onPress, disabled = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, disabled && styles.disabledItem]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const StatItem = ({ label, value, icon, color = '#007AFF' }) => (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoriesUsed = new Set(expenses.map(expense => expense.category)).size;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Statistics</Text>
        <View style={styles.statsContainer}>
          <StatItem
            label="Total Expenses"
            value={totalExpenses.toString()}
            icon="receipt"
            color="#007AFF"
          />
          <StatItem
            label="Total Amount"
            value={`₹${totalAmount.toFixed(2)}`}
            icon="cash"
            color="#34C759"
          />
          <StatItem
            label="Categories Used"
            value={categoriesUsed.toString()}
            icon="grid"
            color="#FF9500"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          title="Daily Reminders"
          subtitle="Get notified at 10 PM about your daily spending"
          icon="notifications"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={isToggling}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor="#fff"
            />
          }
        />
        
        <SettingItem
          title="Test Notification"
          subtitle="Send a test notification now"
          icon="send"
          onPress={handleTestNotification}
          disabled={!notificationsEnabled}
          rightComponent={
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem
          title="App Version"
          subtitle="1.0.0"
          icon="information-circle"
          rightComponent={null}
        />
        
        <SettingItem
          title="Data Storage"
          subtitle="All data is stored locally on your device"
          icon="phone-portrait"
          rightComponent={null}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Expense Tracker helps you manage your daily expenses with ease.
        </Text>
        <Text style={styles.footerText}>
          Built with React Native & Expo
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginVertical: 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledItem: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  disabledText: {
    color: '#999',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
});