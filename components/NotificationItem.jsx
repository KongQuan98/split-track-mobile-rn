import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../assets/styles/notification.styles';

export const NotificationItem = ({ notification, onView, onDelete }) => {
  const getTypeStyle = (type) => {
    switch (type) {
      case 'transaction':
        return [styles.notificationType, styles.typeTransaction];
      case 'system':
        return [styles.notificationType, styles.typeSystem];
      case 'urgent':
        return [styles.notificationType, styles.typeUrgent];
      default:
        return [styles.notificationType, styles.typeSystem];
    }
  };

  const getTypeTextStyle = (type) => {
    switch (type) {
      case 'transaction':
        return [styles.typeText, styles.typeTransactionText];
      case 'system':
        return [styles.typeText, styles.typeSystemText];
      case 'urgent':
        return [styles.typeText, styles.typeUrgentText];
      default:
        return [styles.typeText, styles.typeSystemText];
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'transaction':
        return 'Transaction';
      case 'system':
        return 'System';
      case 'urgent':
        return 'Urgent';
      default:
        return 'System';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={[
      styles.notificationCard,
      !notification.read && styles.notificationCardUnread
    ]}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle} numberOfLines={2}>
          {notification.title}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTime(notification.timestamp)}
        </Text>
      </View>

      <View style={getTypeStyle(notification.type)}>
        <Text style={getTypeTextStyle(notification.type)}>
          {getTypeText(notification.type)}
        </Text>
      </View>

      <Text style={styles.notificationMessage} numberOfLines={3}>
        {notification.message}
      </Text>

      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => onView(notification)}
        >
          <Text style={[styles.actionButtonText, styles.viewButtonText]}>
            View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(notification.id)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 