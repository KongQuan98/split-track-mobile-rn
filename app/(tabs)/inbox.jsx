import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../assets/styles/inbox.styles';
import { ChatItem } from '../../components/ChatItem';
import { COLORS } from '../../constants/color';

const InboxScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  
  // State
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Load chats
  useEffect(() => {
    loadChats();
  }, []);

  // Filter chats based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const loadChats = async () => {
    try {
      // In a real app, you'd fetch this from your backend
      // For now, we'll use mock data
      const mockChats = [
        {
          id: '1',
          name: 'John Smith',
          lastMessage: 'Thanks for the split! I\'ll send you the money tomorrow.',
          lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          unreadCount: 2,
          isOnline: true,
          isGroup: false,
          avatar: null,
        },
        {
          id: '2',
          name: 'Apartment Rent Group',
          lastMessage: 'Sarah: I\'ve paid the electricity bill. Total was $89.50',
          lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          unreadCount: 0,
          isOnline: false,
          isGroup: true,
          avatar: null,
        },
        {
          id: '3',
          name: 'Emma Johnson',
          lastMessage: 'Can you remind me how much I owe you for dinner?',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          unreadCount: 1,
          isOnline: true,
          isGroup: false,
          avatar: null,
        },
        {
          id: '4',
          name: 'Weekend Trip Group',
          lastMessage: 'Mike: I\'ve booked the hotel. Cost is $120 per person.',
          lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          unreadCount: 5,
          isOnline: false,
          isGroup: true,
          avatar: null,
        },
        {
          id: '5',
          name: 'David Wilson',
          lastMessage: 'Got it! I\'ll transfer the money right away.',
          lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          unreadCount: 0,
          isOnline: false,
          isGroup: false,
          avatar: null,
        },
        {
          id: '6',
          name: 'Lisa Chen',
          lastMessage: 'Thanks for organizing the dinner split!',
          lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          unreadCount: 0,
          isOnline: true,
          isGroup: false,
          avatar: null,
        },
      ];
      
      setChats(mockChats);
      setFilteredChats(mockChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const handleChatPress = (chat) => {
    // Navigate to chat screen
    router.push({
      pathname: '/chat',
      params: { 
        chatId: chat.id,
        chatName: chat.name,
        isGroup: chat.isGroup
      }
    });
  };

  const handleNewChat = () => {
    // Navigate to new chat screen
    router.push('/new-chat');
  };

  const getUnreadCount = () => {
    return chats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="chatbubbles-outline" 
        size={48} 
        color={COLORS.textLight} 
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No Conversations</Text>
      <Text style={styles.emptyStateText}>
        Start a new conversation to split expenses with friends and family.
      </Text>
    </View>
  );

  const renderSearchResults = () => {
    if (searchQuery.trim() === '') return null;
    
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          color: COLORS.textLight,
          marginBottom: 10,
        }}>
          {filteredChats.length} result{filteredChats.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    );
  };

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
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Inbox</Text>
            {getUnreadCount() > 0 && (
              <Text style={{
                fontSize: 14,
                color: COLORS.primary,
                marginTop: 4,
              }}>
                {getUnreadCount()} unread messages
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={handleNewChat}
          >
            <Ionicons name="add" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              searchFocused && styles.searchInputFocused
            ]}
            placeholder="Search conversations..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>

        {/* Search Results Info */}
        {renderSearchResults()}

        {/* Chats List */}
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              onPress={handleChatPress}
            />
          ))
        ) : searchQuery.trim() !== '' ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="search-outline" 
              size={48} 
              color={COLORS.textLight} 
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>No Results Found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with different keywords.
            </Text>
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
};

export default InboxScreen;