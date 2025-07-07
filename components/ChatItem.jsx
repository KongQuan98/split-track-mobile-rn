import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../assets/styles/inbox.styles';
import { COLORS } from '../constants/color';

export const ChatItem = ({ chat, onPress }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => {
    if (chat.avatar) {
      return (
        <View style={styles.chatAvatar}>
          <Ionicons name="person" size={24} color={COLORS.textLight} />
        </View>
      );
    }
    return (
      <View style={styles.chatAvatar}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          {getInitials(chat.name)}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.chatCard,
        chat.unreadCount > 0 && styles.chatCardUnread
      ]}
      onPress={() => onPress(chat)}
    >
      <View style={styles.chatHeader}>
        <View style={{ position: 'relative' }}>
          {renderAvatar()}
          {chat.isOnline ? (
            <View style={styles.onlineIndicator} />
          ) : (
            <View style={styles.offlineIndicator} />
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <Text style={styles.chatName} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.chatLastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          <Text style={styles.chatTime}>
            {formatTime(chat.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.chatMeta}>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
          {chat.isGroup && (
            <View style={styles.groupIndicator}>
              <Text style={styles.groupIndicatorText}>Group</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}; 