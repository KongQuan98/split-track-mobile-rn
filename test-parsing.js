// Test the parsing logic
import { parseReceipt, formatCurrency, calculateTotal } from "./lib/parseReceipt.js";

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

console.log("Testing receipt parsing...");
const parsedItems = parseReceipt(sampleOCRData);
console.log("Parsed items:", parsedItems);

// Test currency formatting
console.log("Currency formatting test:");
console.log("RM22.00:", formatCurrency(22.00));
console.log("RM15.10:", formatCurrency(15.10));

// Test total calculation
const selectedIds = [1, 2];
const total = calculateTotal(parsedItems, selectedIds);
console.log("Total for selected items:", formatCurrency(total));
