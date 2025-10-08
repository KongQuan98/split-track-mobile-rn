# Receipt Recognition Feature

## Overview
This feature allows users to scan receipts using their camera or upload receipt images, extract item details using OCR, and create shareable split bills.

## Components

### 1. parseReceipt.js
- **Location**: `lib/parseReceipt.js`
- **Purpose**: Parses OCR results to extract items, quantities, and prices
- **Key Functions**:
  - `parseReceipt(ocrResult)` - Main parsing function
  - `formatCurrency(amount)` - Formats currency as RM
  - `calculateTotal(items, selectedIds)` - Calculates total for selected items

### 2. ReceiptChecklist.jsx
- **Location**: `components/ReceiptChecklist.jsx`
- **Purpose**: UI component for displaying and selecting receipt items
- **Features**:
  - Item checklist with checkboxes
  - Quantity and price display
  - Select all/deselect all functionality
  - Total calculation
  - Share functionality

### 3. Camera Screen Integration
- **Location**: `app/(tabs)/camera.jsx`
- **Purpose**: Main camera interface with receipt scanning
- **Features**:
  - Camera and gallery access
  - OCR processing with ML Kit
  - Receipt parsing integration
  - Loading states and error handling

## Usage Flow

1. **Take/Upload Image**: User takes photo or uploads receipt image
2. **OCR Processing**: Image is processed using ML Kit OCR
3. **Parse Items**: OCR result is parsed to extract items, quantities, prices
4. **Display Checklist**: Items are shown in a user-friendly checklist
5. **Select Items**: User can select which items to include in split
6. **Share**: Generate shareable message with selected items and total

## Parsing Logic

The parsing logic uses multiple strategies to handle different receipt formats:

### Strategy 1: Price Pattern Matching
- Looks for RM, $, or decimal number patterns
- Handles various currency formats

### Strategy 2: Quantity Detection
- Identifies quantity patterns like "2 x 10", "x 2", etc.
- Handles different quantity formats

### Strategy 3: Text Cleaning
- Removes price and quantity text from item names
- Cleans up extra spaces and formatting

### Strategy 4: Proximity Grouping
- Groups nearby text blocks that belong to the same item
- Uses bounding box coordinates for spatial analysis

### Strategy 5: Fallback Logic
- If separate blocks are detected, tries to match quantity and price
- Assumes last number is price, previous number is quantity

## Error Handling

- **No Items Found**: Shows helpful message with retry option
- **OCR Errors**: Displays error message with retry functionality
- **Permission Issues**: Handles camera/gallery permission requests
- **Invalid Images**: Provides feedback for unclear or invalid images

## Testing

Use the test screen at `app/receipt-test.jsx` to test the parsing logic with sample data.

## Future Improvements

1. **Machine Learning**: Train custom models for better receipt parsing
2. **Multiple Languages**: Support for different languages and currencies
3. **Receipt Types**: Specialized parsing for different store types
4. **Cloud Processing**: Use cloud OCR services for better accuracy
5. **Batch Processing**: Process multiple receipts at once
6. **Export Options**: Export to various formats (PDF, Excel, etc.)

## Dependencies

- `react-native-mlkit-ocr` - For OCR functionality
- `expo-image-picker` - For camera and gallery access
- `@expo/vector-icons` - For UI icons
