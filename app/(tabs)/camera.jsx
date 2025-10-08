import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Platform, Image, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";
import { styles } from "../../assets/styles/camera.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/color";

// Import receipt parsing (optional - will only load if needed)
let parseReceipt = null;
let parseReceiptWithHF = null;
let ReceiptChecklist = null;

try {
  const parseModule = require("../../lib/parseReceipt");
  parseReceipt = parseModule.parseReceipt;
  parseReceiptWithHF = parseModule.parseReceiptWithHF;
  ReceiptChecklist = require("../../components/ReceiptChecklist").default;
} catch (error) {
  console.log("Receipt parsing not available:", error.message);
}

const CameraScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState([]);
  const [hfResult, setHfResult] = useState(null);
  const [showReceiptParsing, setShowReceiptParsing] = useState(false);
  const [showHFResult, setShowHFResult] = useState(false);
  const [processingMethod, setProcessingMethod] = useState("local"); // "local" or "hf"

  // request permission for camera and media library
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      return cameraStatus === "granted" && mediaStatus === "granted";
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
      setParsedItems([]);
      setHfResult(null);
      setShowReceiptParsing(false);
      setShowHFResult(false);
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
      setParsedItems([]);
      setHfResult(null);
      setShowReceiptParsing(false);
      setShowHFResult(false);
    }
  };

  const recognizeText = async () => {
    if (image?.uri) {
      setIsProcessing(true);
      try {
        const result = await MlkitOcr.detectFromFile(image.uri);
        console.log("Recognized text:", result);
        
        // Extract text for HF processing
        const ocrText = result.map(block => block.text).join(" ");
        
        // Try local parsing first
        if (parseReceipt && result && result.length > 0) {
          try {
            const items = parseReceipt(result);
            if (items && items.length > 0) {
              setParsedItems(items);
              setShowReceiptParsing(true);
              console.log("Local parsed receipt items:", items);
            }
          } catch (parseError) {
            console.log("Local receipt parsing failed:", parseError);
          }
        }

        // Try HF parsing
        if (parseReceiptWithHF && ocrText) {
          try {
            const hfData = await parseReceiptWithHF(ocrText);
            if (hfData) {
              setHfResult(hfData);
              setShowHFResult(true);
              console.log("HF parsed receipt data:", hfData);
            }
          } catch (hfError) {
            console.log("HF receipt parsing failed:", hfError);
          }
        }
      } catch (err) {
        console.error("OCR error:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleShare = (message) => {
    Alert.alert("Share Message", message);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (image) {
      await recognizeText();
    }
    setRefreshing(false);
  };

  const clearImage = () => {
    setImage(null);
    setParsedItems([]);
    setHfResult(null);
    setShowReceiptParsing(false);
    setShowHFResult(false);
  };

  const toggleReceiptParsing = () => {
    setShowReceiptParsing(!showReceiptParsing);
  };

  const toggleHFResult = () => {
    setShowHFResult(!showHFResult);
  };

  const switchProcessingMethod = (method) => {
    setProcessingMethod(method);
  };

  useEffect(() => {
    if (image) {
      console.log("Picked image:", image);
      const handler = setTimeout(() => {
        recognizeText();
      }, 500); // 500ms debounce

      return () => clearTimeout(handler);
    }
  }, [image]);

  const renderHFResult = () => {
    if (!hfResult) return null;

    // Check if it's an error response
    const isError = hfResult.error || hfResult.message;

    return (
      <View style={styles.hfResultContainer}>
        <View style={styles.hfResultHeader}>
          <Text style={styles.hfResultTitle}>
            {isError ? "❌ AI Parsing Error" : "🤖 AI Parsed Receipt"}
          </Text>
          <TouchableOpacity onPress={toggleHFResult}>
            <Ionicons 
              name={showHFResult ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>
        
        {showHFResult && (
          <View style={styles.hfResultContent}>
            {isError ? (
              // Error display
              <View style={styles.hfErrorSection}>
                <Text style={styles.hfErrorTitle}>Error Details:</Text>
                <Text style={styles.hfErrorText}>{hfResult.error || "Unknown error"}</Text>
                {hfResult.message && (
                  <Text style={styles.hfErrorMessage}>{hfResult.message}</Text>
                )}
                {hfResult.rawText && (
                  <View style={styles.hfRawSection}>
                    <Text style={styles.hfRawTitle}>Raw Text Response:</Text>
                    <ScrollView style={styles.hfRawJson} nestedScrollEnabled>
                      <Text style={styles.hfRawText}>{hfResult.rawText}</Text>
                    </ScrollView>
                  </View>
                )}
                {hfResult.rawResponse && (
                  <View style={styles.hfRawSection}>
                    <Text style={styles.hfRawTitle}>Raw API Response:</Text>
                    <ScrollView style={styles.hfRawJson} nestedScrollEnabled>
                      <Text style={styles.hfRawText}>{hfResult.rawResponse}</Text>
                    </ScrollView>
                  </View>
                )}
              </View>
            ) : (
              // Success display
              <>
                {/* Store Info */}
                <View style={styles.hfInfoSection}>
                  <Text style={styles.hfInfoLabel}>Store:</Text>
                  <Text style={styles.hfInfoValue}>{hfResult.store || "N/A"}</Text>
                </View>
                
                <View style={styles.hfInfoSection}>
                  <Text style={styles.hfInfoLabel}>Date:</Text>
                  <Text style={styles.hfInfoValue}>{hfResult.date || "N/A"}</Text>
                </View>
                
                <View style={styles.hfInfoSection}>
                  <Text style={styles.hfInfoLabel}>Currency:</Text>
                  <Text style={styles.hfInfoValue}>{hfResult.currency || "N/A"}</Text>
                </View>

                {/* Items */}
                {hfResult.items && hfResult.items.length > 0 && (
                  <View style={styles.hfItemsSection}>
                    <Text style={styles.hfItemsTitle}>Items:</Text>
                    {hfResult.items.map((item, index) => (
                      <View key={index} style={styles.hfItemRow}>
                        <Text style={styles.hfItemName}>{item.name}</Text>
                        <View style={styles.hfItemDetails}>
                          <Text style={styles.hfItemQty}>Qty: {item.quantity}</Text>
                          <Text style={styles.hfItemPrice}>
                            {hfResult.currency || "RM"}{item.price?.toFixed(2) || "0.00"}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Total */}
                {hfResult.total && (
                  <View style={styles.hfTotalSection}>
                    <Text style={styles.hfTotalLabel}>Total:</Text>
                    <Text style={styles.hfTotalValue}>
                      {hfResult.currency || "RM"}{hfResult.total.toFixed(2)}
                    </Text>
                  </View>
                )}

                {/* Raw JSON */}
                <View style={styles.hfRawSection}>
                  <Text style={styles.hfRawTitle}>Raw JSON:</Text>
                  <ScrollView style={styles.hfRawJson} nestedScrollEnabled>
                    <Text style={styles.hfRawText}>
                      {JSON.stringify(hfResult, null, 2)}
                    </Text>
                  </ScrollView>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Receipt Scanner</Text>
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
          {image && (
            <TouchableOpacity
              style={[styles.backButton, { marginLeft: 10 }]}
              onPress={clearImage}
            >
              <Ionicons name="close" size={24} color={COLORS.expense} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {image ? (
          <View>
            {/* Image Display */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.receiptImage} />
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.white} />
                  <Text style={styles.processingText}>Processing with AI...</Text>
                </View>
              )}
            </View>

            {/* Processing Method Toggle */}
            <View style={styles.methodToggleContainer}>
              <TouchableOpacity 
                style={[
                  styles.methodButton, 
                  processingMethod === "local" && styles.methodButtonActive
                ]}
                onPress={() => switchProcessingMethod("local")}
              >
                <Text style={[
                  styles.methodButtonText,
                  processingMethod === "local" && styles.methodButtonTextActive
                ]}>
                  Local Parsing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.methodButton, 
                  processingMethod === "hf" && styles.methodButtonActive
                ]}
                onPress={() => switchProcessingMethod("hf")}
              >
                <Text style={[
                  styles.methodButtonText,
                  processingMethod === "hf" && styles.methodButtonTextActive
                ]}>
                  AI Parsing
                </Text>
              </TouchableOpacity>
            </View>

            {/* Local Parsing Results */}
            {parsedItems.length > 0 && processingMethod === "local" && (
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={styles.toggleButton} 
                  onPress={toggleReceiptParsing}
                >
                  <Ionicons 
                    name={showReceiptParsing ? "eye-off" : "eye"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                  <Text style={styles.toggleButtonText}>
                    {showReceiptParsing ? "Hide" : "Show"} Local Parsed Items
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Local Receipt Items */}
            {showReceiptParsing && processingMethod === "local" && ReceiptChecklist && (
              <ReceiptChecklist
                items={parsedItems}
                receiptImage={image.uri}
                onShare={handleShare}
              />
            )}

            {/* HF Results */}
            {hfResult && processingMethod === "hf" && renderHFResult()}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.placeholderText}>
              Take a photo or upload a receipt to get started
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
                <Ionicons name="camera" size={20} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={uploadFromLocal}>
                <Ionicons name="image" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CameraScreen;
