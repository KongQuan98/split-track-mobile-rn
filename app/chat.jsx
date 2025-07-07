import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../assets/styles/chat.styles';
import { MessageBubble } from '../components/MessageBubble';
import { COLORS } from '../constants/color';

const ChatScreen = () => {
  const { chatId, chatName, isGroup } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatInfo, setChatInfo] = useState({
    name: chatName || 'Chat',
    isOnline: true,
    isGroup: isGroup === 'true',
  });
  
  const flatListRef = useRef(null);

  // Load messages
  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      // In a real app, you'd fetch this from your backend
      // For now, we'll use mock data
      const mockMessages = [
        {
          id: '1',
          type: 'date',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'system',
          text: 'You started a conversation',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          text: 'Hey! How much do I owe you for dinner last night?',
          sender: 'other',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          text: 'It was $45.50 total, so $22.75 each',
          sender: 'me',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          text: 'Perfect! I\'ll send it to you right away',
          sender: 'other',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          type: 'date',
          timestamp: new Date().toISOString(),
        },
        {
          id: '7',
          text: 'Thanks for the split! I\'ll send you the money tomorrow.',
          sender: 'other',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          id: '8',
          text: 'No problem! Take your time',
          sender: 'me',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'me',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate received message
      const receivedMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks! I got your message.',
        sender: 'other',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, receivedMessage]);
    }, 2000);
  };

  const handleBack = () => {
    router.push('/(tabs)/inbox');
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Chat Options',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Profile', onPress: () => console.log('View Profile') },
        { text: 'Clear Chat', style: 'destructive', onPress: () => {
          Alert.alert(
            'Clear Chat',
            'Are you sure you want to clear all messages?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) },
            ]
          );
        }},
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender === 'me';
    return <MessageBubble message={item} isOwnMessage={isOwnMessage} />;
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
    return (
      <View style={styles.chatAvatar}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          {getInitials(chatInfo.name)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : insets.bottom}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            {renderAvatar()}
            
            <View style={styles.chatInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {chatInfo.name}
                </Text>
                {chatInfo.isOnline ? (
                  <View style={styles.onlineIndicator} />
                ) : (
                  <View style={styles.offlineIndicator} />
                )}
                {chatInfo.isGroup && (
                  <View style={styles.groupIndicator}>
                    <Text style={styles.groupIndicatorText}>Group</Text>
                  </View>
                )}
              </View>
              <Text style={styles.chatStatus}>
                {chatInfo.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleMoreOptions}>
              <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          style={styles.messagesContainer}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              {chatInfo.name} is typing...
            </Text>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 15 }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textLight}
              multiline
              maxLength={500}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={newMessage.trim() ? COLORS.white : COLORS.textLight} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen; 