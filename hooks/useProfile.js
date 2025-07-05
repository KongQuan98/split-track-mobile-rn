import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const PROFILE_STORAGE_KEY = 'user_profile_data';
const PAYMENT_STORAGE_KEY = 'user_payment_methods';

export const useProfile = (userId) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    phoneNumber: '',
    profileImage: null,
  });
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile data from storage
  const loadProfileData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const storedProfile = await AsyncStorage.getItem(`${PROFILE_STORAGE_KEY}_${userId}`);
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }, [userId]);

  // Load payment methods from storage
  const loadPaymentMethods = useCallback(async () => {
    if (!userId) return;
    
    try {
      const storedPayments = await AsyncStorage.getItem(`${PAYMENT_STORAGE_KEY}_${userId}`);
      if (storedPayments) {
        setPaymentMethods(JSON.parse(storedPayments));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }, [userId]);

  // Save profile data to storage
  const saveProfileData = useCallback(async (data) => {
    if (!userId) return;
    
    try {
      await AsyncStorage.setItem(`${PROFILE_STORAGE_KEY}_${userId}`, JSON.stringify(data));
      setProfileData(data);
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw error;
    }
  }, [userId]);

  // Save payment methods to storage
  const savePaymentMethods = useCallback(async (methods) => {
    if (!userId) return;
    
    try {
      await AsyncStorage.setItem(`${PAYMENT_STORAGE_KEY}_${userId}`, JSON.stringify(methods));
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error saving payment methods:', error);
      throw error;
    }
  }, [userId]);

  // Add payment method
  const addPaymentMethod = useCallback(async (payment) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString(),
    };
    const updatedPayments = [...paymentMethods, newPayment];
    await savePaymentMethods(updatedPayments);
    return newPayment;
  }, [paymentMethods, savePaymentMethods]);

  // Update payment method
  const updatePaymentMethod = useCallback(async (paymentId, updatedPayment) => {
    const updatedPayments = paymentMethods.map(p => 
      p.id === paymentId ? { ...updatedPayment, id: paymentId } : p
    );
    await savePaymentMethods(updatedPayments);
  }, [paymentMethods, savePaymentMethods]);

  // Delete payment method
  const deletePaymentMethod = useCallback(async (paymentId) => {
    const updatedPayments = paymentMethods.filter(p => p.id !== paymentId);
    await savePaymentMethods(updatedPayments);
  }, [paymentMethods, savePaymentMethods]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadProfileData(), loadPaymentMethods()]);
      } catch (error) {
        console.error('Error initializing profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [loadProfileData, loadPaymentMethods]);

  return {
    profileData,
    paymentMethods,
    isLoading,
    saveProfileData,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
}; 