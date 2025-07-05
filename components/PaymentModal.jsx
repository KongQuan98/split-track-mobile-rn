import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../assets/styles/profile.styles';
import { COLORS } from '../constants/color';

export const PaymentModal = ({ visible, onClose, onSave, payment = null }) => {
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setAccountName(payment.accountName || '');
      setBankName(payment.bankName || '');
      setAccountNumber(payment.accountNumber || '');
    } else {
      setAccountName('');
      setBankName('');
      setAccountNumber('');
    }
    setErrors({});
  }, [payment, visible]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const paymentData = {
      id: payment?.id || Date.now().toString(),
      accountName: accountName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
    };

    onSave(paymentData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
            width: '90%',
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
                {payment ? 'Edit Payment Method' : 'Add Payment Method'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Name</Text>
                <TextInput
                  style={[styles.input, errors.accountName && styles.inputError]}
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Enter account name"
                  placeholderTextColor={COLORS.textLight}
                />
                {errors.accountName && (
                  <Text style={styles.errorText}>{errors.accountName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <TextInput
                  style={[styles.input, errors.bankName && styles.inputError]}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Enter bank name"
                  placeholderTextColor={COLORS.textLight}
                />
                {errors.bankName && (
                  <Text style={styles.errorText}>{errors.bankName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={[styles.input, errors.accountNumber && styles.inputError]}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Enter account number"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                />
                {errors.accountNumber && (
                  <Text style={styles.errorText}>{errors.accountNumber}</Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 15, marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.saveButton, { flex: 1, backgroundColor: COLORS.border }]}
                  onPress={onClose}
                >
                  <Text style={[styles.saveButtonText, { color: COLORS.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { flex: 1 }]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>
                    {payment ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}; 