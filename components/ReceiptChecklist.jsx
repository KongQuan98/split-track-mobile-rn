import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS } from "../constants/color";
import { calculateTotal, formatCurrency } from "../lib/parseReceipt";

const ReceiptChecklist = ({ 
  items = [], 
  receiptImage = null, 
  onShare = null 
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleShare = () => {
    const selectedItemsList = items.filter(item => selectedItems.has(item.id));
    
    if (selectedItemsList.length === 0) {
      Alert.alert("No Items Selected", "Please select at least one item to share.");
      return;
    }

    const total = calculateTotal(items, Array.from(selectedItems));
    
    let message = "Items to split:";
    selectedItemsList.forEach(item => {
      message += `- ${item.name} x${item.qty} = ${formatCurrency(item.price * item.qty)}
`;
    });
    message += `Total = ${formatCurrency(total)}`;

    console.log("Share message:", message);
    
    if (onShare) {
      onShare(message);
    } else {
      Alert.alert("Share Message", message);
    }
  };

  const total = calculateTotal(items, Array.from(selectedItems));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Receipt Image */}
      {receiptImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Receipt Items</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={selectAll}>
            <Text style={styles.headerButtonText}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={deselectAll}>
            <Text style={styles.headerButtonText}>Deselect All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>
              Make sure the receipt image is clear and contains item details
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                selectedItems.has(item.id) && styles.itemCardSelected
              ]}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.itemLeft}>
                <View style={[
                  styles.checkbox,
                  selectedItems.has(item.id) && styles.checkboxSelected
                ]}>
                  {selectedItems.has(item.id) && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDetails}>
                    Qty: {item.qty} × {formatCurrency(item.price)}
                  </Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.price * item.qty)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Total and Share Button */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Selected Total:</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(total)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.shareButton,
              selectedItems.size === 0 && styles.shareButtonDisabled
            ]}
            onPress={handleShare}
            disabled={selectedItems.size === 0}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.white} />
            <Text style={styles.shareButtonText}>Share Selected Items</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  itemsContainer: {
    padding: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "05",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    gap: 8,
  },
  shareButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ReceiptChecklist;
