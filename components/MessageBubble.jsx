import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../assets/styles/chat.styles';

export const MessageBubble = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (message.type === 'system') {
    return (
      <View style={styles.systemMessage}>
        <Text style={styles.systemMessageText}>
          {message.text}
        </Text>
      </View>
    );
  }

  if (message.type === 'date') {
    return (
      <View style={styles.dateSeparator}>
        <Text style={styles.dateText}>
          {formatDate(message.timestamp)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.messageBubble,
      isOwnMessage ? styles.messageBubbleSent : styles.messageBubbleReceived
    ]}>
      <Text style={[
        styles.messageText,
        isOwnMessage ? styles.messageTextSent : styles.messageTextReceived
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.messageTime,
        isOwnMessage ? styles.messageTimeSent : styles.messageTimeReceived
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}; 