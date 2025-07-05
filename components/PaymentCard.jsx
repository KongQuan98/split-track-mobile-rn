import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../assets/styles/profile.styles';
import { COLORS } from '../constants/color';

export const PaymentCard = ({ payment, onDelete, onEdit }) => {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentCardHeader}>
        <Text style={styles.paymentCardTitle}>{payment.accountName}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {onEdit && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onEdit(payment)}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(payment.id)}>
              <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.paymentCardContent}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Bank Name:</Text>
          <Text style={styles.paymentValue}>{payment.bankName}</Text>
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Account Number:</Text>
          <Text style={styles.paymentValue}>{payment.accountNumber}</Text>
        </View>
      </View>
    </View>
  );
}; 