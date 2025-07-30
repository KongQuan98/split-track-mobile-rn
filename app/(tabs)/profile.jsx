import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../assets/styles/profile.styles';
import { PaymentCard } from '../../components/PaymentCard';
import { PaymentModal } from '../../components/PaymentModal';
import { COLORS } from '../../constants/color';
import { useProfile } from '../../hooks/useProfile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignOutButton } from '@/components/SignOutButton';

const ProfileScreen = () => {
  const { user } = useUser();
  const {
    profileData,
    paymentMethods,
    isLoading: profileLoading,
    saveProfileData,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  } = useProfile(user?.id);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [localProfileData, setLocalProfileData] = useState(profileData);

  // Update local state when profile data changes
  useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const updatedData = {
          ...localProfileData,
          profileImage: result.assets[0].uri,
        };
        setLocalProfileData(updatedData);
        await saveProfileData(updatedData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSaveProfile = async () => {
    if (!localProfileData.firstName.trim() || !localProfileData.lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    setIsLoading(true);
    try {
      await saveProfileData(localProfileData);
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setPaymentModalVisible(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentModalVisible(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      if (editingPayment) {
        // Update existing payment
        await updatePaymentMethod(editingPayment.id, paymentData);
      } else {
        // Add new payment
        await addPaymentMethod(paymentData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save payment method');
    }
  };

  const handleDeletePayment = (paymentId) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePaymentMethod(paymentId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete payment method');
            }
          },
        },
      ]
    );
  };

  const renderProfileImage = () => {
    if (localProfileData.profileImage) {
      return (
        <Image
          source={{ uri: localProfileData.profileImage }}
          style={styles.profileImage}
        />
      );
    }
    return (
      <View style={[styles.profileImage, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="person" size={40} color={COLORS.textLight} />
      </View>
    );
  };

  if (profileLoading) {
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "create-outline"} 
              size={24} 
              color={isEditing ? COLORS.primary : COLORS.text} 
            />
          </TouchableOpacity>
          <SignOutButton />
        </View>
        
      </View>
      
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={30}
      >
        <View style={styles.container}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileImageContainer}>
                    {renderProfileImage()}
                    <TouchableOpacity 
                      style={[styles.editImageButton, { display: isEditing ? 'flex' : 'none'}]}
                      onPress={pickImage}
                    >
                      <Ionicons name="camera" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.profileName}>
                    {localProfileData.firstName} {localProfileData.lastName}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {user?.emailAddresses[0]?.emailAddress}
                  </Text>
                </View>

                {/* Personal Information */}
                <View>
                  <View style={styles.sectionIcon}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>
                      Personal Information
                    </Text>
                  </View>
                
                  <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.flex1]}>
                      <Text style={styles.inputLabel}>First Name</Text>
                      <TextInput
                        style={[
                          styles.input,
                          focusedInput === 'firstName' && styles.inputFocused,
                          !isEditing && { backgroundColor: COLORS.background }
                        ]}
                        value={localProfileData.firstName}
                        onChangeText={(text) => setLocalProfileData(prev => ({ ...prev, firstName: text }))}
                        placeholder="Enter first name"
                        placeholderTextColor={COLORS.textLight}
                        editable={isEditing}
                        onFocus={() => setFocusedInput('firstName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                    <View style={[styles.inputContainer, styles.flex1]}>
                      <Text style={styles.inputLabel}>Last Name</Text>
                      <TextInput
                        style={[
                          styles.input,
                          focusedInput === 'lastName' && styles.inputFocused,
                          !isEditing && { backgroundColor: COLORS.background }
                        ]}
                        value={localProfileData.lastName}
                        onChangeText={(text) => setLocalProfileData(prev => ({ ...prev, lastName: text }))}
                        placeholder="Enter last name"
                        placeholderTextColor={COLORS.textLight}
                        editable={isEditing}
                        onFocus={() => setFocusedInput('lastName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nickname</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'nickname' && styles.inputFocused,
                        !isEditing && { backgroundColor: COLORS.background }
                      ]}
                      value={localProfileData.nickname}
                      onChangeText={(text) => setLocalProfileData(prev => ({ ...prev, nickname: text }))}
                      placeholder="Enter nickname (optional)"
                      placeholderTextColor={COLORS.textLight}
                      editable={isEditing}
                      onFocus={() => setFocusedInput('nickname')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'phoneNumber' && styles.inputFocused,
                        !isEditing && { backgroundColor: COLORS.background }
                      ]}
                      value={localProfileData.phoneNumber}
                      onChangeText={(text) => setLocalProfileData(prev => ({ ...prev, phoneNumber: text }))}
                      placeholder="Enter phone number"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="phone-pad"
                      editable={isEditing}
                      onFocus={() => setFocusedInput('phoneNumber')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>

                  {isEditing && (
                    <TouchableOpacity
                      style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                      onPress={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={COLORS.white} />
                      ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Payment Methods Section */}
              <View style={styles.profileSection}>
                <View style={styles.sectionIcon}>
                  <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>
                    Payment Methods
                  </Text>
                </View>
                

                {paymentMethods.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onEdit={handleEditPayment}
                    onDelete={handleDeletePayment}
                  />
                ))}

                <TouchableOpacity
                  style={styles.addPaymentButton}
                  onPress={handleAddPayment}
                >
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                  <Text style={styles.addPaymentButtonText}>Add Payment Method</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Payment Modal */}
          <PaymentModal
            visible={paymentModalVisible}
            onClose={() => setPaymentModalVisible(false)}
            onSave={handleSavePayment}
            payment={editingPayment}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ProfileScreen;
