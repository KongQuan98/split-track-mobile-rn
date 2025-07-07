import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../assets/styles/notification.styles';
import { COLORS } from '../constants/color';

const { width } = Dimensions.get('window');

export const NotificationModal = ({ visible, notification, onClose }) => {
  if (!notification) return null;

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
    return date.toLocaleString();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: COLORS.white,
          borderRadius: 20,
          padding: 20,
          width: width * 0.9,
          maxWidth: 400,
          maxHeight: '80%',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: COLORS.text,
            }}>
              Notification Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={getTypeStyle(notification.type)}>
              <Text style={getTypeTextStyle(notification.type)}>
                {getTypeText(notification.type)}
              </Text>
            </View>

            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: COLORS.text,
              marginBottom: 10,
            }}>
              {notification.title}
            </Text>

            <Text style={{
              fontSize: 12,
              color: COLORS.textLight,
              marginBottom: 20,
            }}>
              {formatTime(notification.timestamp)}
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.text,
              lineHeight: 24,
              marginBottom: 20,
            }}>
              {notification.message}
            </Text>

            {notification.details && (
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Additional Details:
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: COLORS.text,
                  lineHeight: 20,
                }}>
                  {notification.details}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={onClose}
            >
              <Text style={{
                color: COLORS.white,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}; 