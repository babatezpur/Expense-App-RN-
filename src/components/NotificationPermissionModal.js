import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../hooks/useNotifications';

const FIRST_LAUNCH_KEY = '@expense_tracker_first_launch';

export default function NotificationPermissionModal() {
  const [isVisible, setIsVisible] = useState(false);
  const { requestPermissions, enableNotifications } = useNotifications();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunchedBefore = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      if (!hasLaunchedBefore) {
        setIsVisible(true);
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const success = await enableNotifications();
      if (success) {
        setIsVisible(false);
      } else {
        Alert.alert(
          'Permission Denied',
          'You can enable notifications later in the Settings tab.',
          [{ text: 'OK', onPress: () => setIsVisible(false) }]
        );
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setIsVisible(false);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={60} color="#007AFF" />
          </View>
          
          <Text style={styles.title}>Stay on Track</Text>
          <Text style={styles.description}>
            Get daily reminders at 10 PM about your spending to stay on top of your expenses.
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Daily spending summaries</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Compare with previous days</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Smart insights and tips</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.enableButton} 
            onPress={handleEnableNotifications}
          >
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  features: {
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  enableButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    marginBottom: 15,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});