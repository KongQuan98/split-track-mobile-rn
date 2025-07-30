import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../assets/styles/notification.styles';
import { NotificationItem } from '../../components/NotificationItem';
import { NotificationModal } from '../../components/NotificationModal';
import { COLORS } from '../../constants/color';

const NotificationScreen = () => {
  const { user } = useUser();
  
  // State
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // In a real app, you'd fetch this from your backend
      // For now, we'll use mock data
      const mockNotifications = [
        {
          id: '1',
          title: 'New Transaction Added',
          message: 'A new transaction of $150.00 has been added to your account. Category: Food & Drinks',
          type: 'transaction',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          read: false,
          details: 'Transaction ID: TXN-2024-001\nAmount: $150.00\nCategory: Food & Drinks\nDate: Today at 2:30 PM\nLocation: Starbucks Coffee'
        },
        {
          id: '2',
          title: 'Payment Reminder',
          message: 'Your monthly subscription payment of $29.99 is due in 3 days.',
          type: 'urgent',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          read: true,
          details: 'Subscription: Premium Plan\nAmount: $29.99\nDue Date: March 15, 2024\nPayment Method: Chase Bank ****1234'
        },
        {
          id: '3',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.',
          type: 'system',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: true,
          details: 'Maintenance Window: 2:00 AM - 4:00 AM\nAffected Services: Transaction History, Reports\nEstimated Duration: 2 hours\nStatus: Scheduled'
        },
        {
          id: '4',
          title: 'Budget Limit Reached',
          message: 'You have reached 90% of your monthly food budget. Consider reviewing your spending.',
          type: 'transaction',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          read: false,
          details: 'Budget Category: Food & Drinks\nMonthly Limit: $500.00\nCurrent Spending: $450.00\nRemaining: $50.00\nPercentage Used: 90%'
        },
        {
          id: '5',
          title: 'Welcome to SplitTrack!',
          message: 'Thank you for joining SplitTrack. We\'re excited to help you manage your finances better.',
          type: 'system',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true,
          details: 'Welcome to SplitTrack!\n\nWe\'re here to help you:\n• Track your expenses and income\n• Set and monitor budgets\n• Analyze your spending patterns\n• Achieve your financial goals\n\nGet started by adding your first transaction!'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
          },
        },
      ]
    );
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
          },
        },
      ]
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="notifications-off-outline" 
        size={48} 
        color={COLORS.textLight} 
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateText}>
        You're all caught up! Check back later for new notifications.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {getUnreadCount() > 0 && (
              <Text style={{
                fontSize: 14,
                color: COLORS.primary,
                marginTop: 4,
              }}>
                {getUnreadCount()} unread
              </Text>
            )}
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllNotifications}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Notifications List */}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onView={handleViewNotification}
              onDelete={handleDeleteNotification}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

      {/* Notification Detail Modal */}
      <NotificationModal
        visible={modalVisible}
        notification={selectedNotification}
        onClose={() => {
          setModalVisible(false);
          setSelectedNotification(null);
        }}
      />
    </View>
  );
};

export default NotificationScreen;