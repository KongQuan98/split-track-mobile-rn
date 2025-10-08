import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ReceiptChecklist from "../components/ReceiptChecklist";
import { COLORS } from "../constants/color";
import { parseReceipt } from "../lib/parseReceipt";

const ReceiptTestScreen = () => {
  const [parsedItems, setParsedItems] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);

  // Sample OCR data for testing
  const sampleOCRData = [
    {
      "bounding": { "height": 157, "left": 913, "top": 1564, "width": 580 },
      "text": ": 18/09/2025 7:53:11 PM : RC6238"
    },
    {
      "bounding": { "height": 157, "left": 628, "top": 1863, "width": 1053 },
      "text": "PRODETECT INFLUENZA A/B TEST KIT 1S 10024533PC"
    },
    {
      "bounding": { "height": 43, "left": 1146, "top": 1958, "width": 67 },
      "text": "2.0"
    },
    {
      "bounding": { "height": 44, "left": 1358, "top": 1950, "width": 123 },
      "text": "22.00"
    },
    {
      "bounding": { "height": 50, "left": 628, "top": 2000, "width": 800 },
      "text": "FLUGO CAPSULE 10S"
    },
    {
      "bounding": { "height": 44, "left": 1146, "top": 2050, "width": 67 },
      "text": "1"
    },
    {
      "bounding": { "height": 44, "left": 1358, "top": 2042, "width": 123 },
      "text": "15.10"
    }
  ];

  const handleTestParse = () => {
    try {
      const items = parseReceipt(sampleOCRData);
      setParsedItems(items);
      console.log("Parsed items:", items);
    } catch (error) {
      console.error("Error parsing receipt:", error);
      Alert.alert("Error", "Failed to parse receipt data");
    }
  };

  const handleShare = (message) => {
    Alert.alert("Share Message", message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receipt Parser Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={handleTestParse}>
          <Ionicons name="play" size={20} color={COLORS.white} />
          <Text style={styles.testButtonText}>Test Parse</Text>
        </TouchableOpacity>
      </View>

      {parsedItems.length > 0 ? (
        <ReceiptChecklist
          items={parsedItems}
          receiptImage={receiptImage}
          onShare={handleShare}
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.placeholderText}>
            Tap "Test Parse" to see parsed receipt items
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
    textAlign: "center",
  },
});

export default ReceiptTestScreen;
