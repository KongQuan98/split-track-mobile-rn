import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import MlkitOcr from 'react-native-mlkit-ocr';
import { styles } from '../../assets/styles/camera.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/color';

const CameraScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);

  // request permission for camera and media library
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      return cameraStatus === 'granted' && mediaStatus === 'granted';
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const uploadFromLocal = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const recognizeText = async () => {
    if (image?.uri) {
      try {
        const result = await MlkitOcr.detectFromFile(image.uri);
        console.log('Recognized text:', result);
      } catch (err) {
        console.error('OCR error:', err);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh operation with a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // 1 second delay
  };

  useEffect(() => {
    if (image) {
      console.log('Picked image:', image);
      const handler = setTimeout(() => {
        recognizeText();
      }, 500); // 500ms debounce

      return () => clearTimeout(handler);
    }
  }, [image]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CameraScreen</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.backButton} onPress={uploadFromLocal}>
            <Ionicons name="image" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backButton, { marginLeft: 10 }]}
            onPress={openCamera}
          >
            <Ionicons name="camera" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      ></ScrollView>
    </View>
  );
};

export default CameraScreen;
