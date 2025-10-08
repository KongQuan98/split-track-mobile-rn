import { InferenceClient } from "@huggingface/inference";

/**
 * Parses OCR result to extract receipt items with quantities and prices
 * @param {Array} ocrResult - OCR JSON array with bounding boxes and text
 * @returns {Array} Normalized array of items with id, name, qty, price
 */
export const parseReceipt = (ocrResult) => {
  if (!Array.isArray(ocrResult) || ocrResult.length === 0) {
    return [];
  }

  // Filter out header/footer text and focus on item lines
  const itemLines = filterItemLines(ocrResult);
  
  // Group related text blocks by proximity
  const groupedItems = groupByProximity(itemLines);
  
  // Parse each group into items
  const parsedItems = groupedItems.map((group, index) => {
    return parseItemGroup(group, index + 1);
  }).filter(item => item !== null);

  return parsedItems;
};

/**
 * Filters out header/footer text and identifies potential item lines
 */
const filterItemLines = (ocrResult) => {
  const headerKeywords = [
    "receipt", "invoice", "bill", "total", "subtotal", "tax", "gst", "vat",
    "date", "time", "store", "shop", "address", "phone", "thank", "visit",
    "cashier", "cash", "card", "payment", "change", "refund"
  ];

  return ocrResult.filter(block => {
    const text = block.text?.toLowerCase() || "";
    
    // Skip if it is likely header/footer text
    const isHeaderFooter = headerKeywords.some(keyword => 
      text.includes(keyword)
    );
    
    // Skip if it is too short (likely not an item)
    if (text.length < 3) return false;
    
    // Skip if it is just numbers without context
    if (/^\d+\.?\d*$/.test(text.trim())) return false;
    
    return !isHeaderFooter;
  });
};

/**
 * Groups text blocks by proximity (items with quantities and prices)
 */
const groupByProximity = (itemLines) => {
  const groups = [];
  const processed = new Set();

  itemLines.forEach((block, index) => {
    if (processed.has(index)) return;

    const group = [block];
    processed.add(index);

    // Find nearby blocks that might be related
    const currentY = block.bounding?.top || 0;
    const currentX = block.bounding?.left || 0;
    const currentHeight = block.bounding?.height || 0;

    itemLines.forEach((otherBlock, otherIndex) => {
      if (processed.has(otherIndex) || otherIndex === index) return;

      const otherY = otherBlock.bounding?.top || 0;
      const otherX = otherBlock.bounding?.left || 0;
      const otherHeight = otherBlock.bounding?.height || 0;

      // Check if blocks are on the same line (similar Y position)
      const yDiff = Math.abs(currentY - otherY);
      const isSameLine = yDiff < Math.max(currentHeight, otherHeight) * 0.5;

      // Check if blocks are close horizontally
      const xDiff = Math.abs(currentX - otherX);
      const isNearby = xDiff < 200; // Adjust threshold as needed

      if (isSameLine || isNearby) {
        group.push(otherBlock);
        processed.add(otherIndex);
      }
    });

    groups.push(group);
  });

  return groups;
};

/**
 * Parses a group of text blocks into a single item
 */
const parseItemGroup = (group, id) => {
  if (group.length === 0) return null;

  // Sort blocks by X position (left to right)
  const sortedGroup = group.sort((a, b) => 
    (a.bounding?.left || 0) - (b.bounding?.left || 0)
  );

  // Extract text from all blocks
  const fullText = sortedGroup.map(block => block.text).join(" ").trim();
  
  // Try to extract item name, quantity, and price
  const item = extractItemDetails(fullText, sortedGroup);
  
  if (!item.name || item.price === 0) {
    return null;
  }

  return {
    id,
    name: item.name,
    qty: item.qty || 1,
    price: item.price
  };
};

/**
 * Extracts item details from text using multiple strategies
 */
const extractItemDetails = (fullText, blocks) => {
  let name = "";
  let qty = 1;
  let price = 0;

  // Strategy 1: Look for price patterns (RM, $, numbers with decimals)
  const pricePatterns = [
    /RM\s*(\d+\.?\d*)/i,
    /\$\s*(\d+\.?\d*)/i,
    /(\d+\.\d{2})\s*$/,
    /(\d+\.\d{2})/
  ];

  for (const pattern of pricePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      price = parseFloat(match[1]);
      break;
    }
  }

  // Strategy 2: Look for quantity patterns
  const qtyPatterns = [
    /(\d+)\s*x\s*\d+/i, // "2 x 10"
    /x\s*(\d+)/i,       // "x 2"
    /^(\d+)\s+/         // "2 " at start
  ];

  for (const pattern of qtyPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      qty = parseInt(match[1]);
      break;
    }
  }

  // Strategy 3: Extract item name by removing quantity and price
  name = fullText
    .replace(/RM\s*\d+\.?\d*/gi, "")
    .replace(/\$\s*\d+\.?\d*/gi, "")
    .replace(/\d+\.\d{2}/g, "")
    .replace(/x\s*\d+/gi, "")
    .replace(/^\d+\s+/, "")
    .replace(/\s+/g, " ")
    .trim();

  // Strategy 4: If we have blocks, try to match quantity and price from separate blocks
  if (blocks.length > 1) {
    const lastBlock = blocks[blocks.length - 1];
    const secondLastBlock = blocks[blocks.length - 2];
    
    // Check if last block looks like a price
    const lastText = lastBlock.text?.trim() || "";
    if (/^\d+\.?\d*$/.test(lastText)) {
      const numValue = parseFloat(lastText);
      if (numValue > 0) {
        // If it is a small number, it might be quantity
        if (numValue <= 10 && !price) {
          qty = numValue;
        } else if (numValue > 10 || price === 0) {
          price = numValue;
        }
      }
    }

    // Check if second last block looks like quantity
    const secondLastText = secondLastBlock.text?.trim() || "";
    if (/^\d+$/.test(secondLastText)) {
      const numValue = parseInt(secondLastText);
      if (numValue > 0 && numValue <= 10) {
        qty = numValue;
      }
    }
  }

  // Fallback: if no price found, try to extract from the end of the text
  if (price === 0) {
    const priceMatch = fullText.match(/(\d+\.\d{2})$/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1]);
    }
  }

  return { name, qty, price };
};

/**
 * Helper function to format currency
 */
export const formatCurrency = (amount) => {
  return `RM${amount.toFixed(2)}`;
};

/**
 * Helper function to calculate total of selected items
 */
export const calculateTotal = (items, selectedIds) => {
  return items
    .filter(item => selectedIds.includes(item.id))
    .reduce((total, item) => total + (item.price * item.qty), 0);
};

const HUGGINGFACE_API_KEY = "";
const MODEL_ID = "";

/**
 * Safely extracts JSON from text using multiple strategies
 */
const extractJSONFromText = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  // Strategy 1: Look for complete JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log("JSON parse failed for matched text:", jsonMatch[0]);
    }
  }

  // Strategy 2: Look for JSON array
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (e) {
      console.log("JSON array parse failed:", arrayMatch[0]);
    }
  }

  // Strategy 3: Try to find JSON after common prefixes
  const prefixes = ["```json", "```", "JSON:", "Response:", "Result:"];
  for (const prefix of prefixes) {
    const prefixIndex = text.indexOf(prefix);
    if (prefixIndex !== -1) {
      const afterPrefix = text.substring(prefixIndex + prefix.length).trim();
      const jsonMatch = afterPrefix.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.log(`JSON parse failed after prefix "${prefix}":`, jsonMatch[0]);
        }
      }
    }
  }

  // Strategy 4: Try parsing the entire text as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("Failed to parse entire text as JSON:", text);
  }

  return null;
};

export async function parseReceiptWithHF(ocrText) {
  if (!ocrText || typeof ocrText !== "string") {
    console.log("Invalid OCR text provided");
    return null;
  }

  const prompt = `You are a receipt parser. Convert the following OCR text into structured JSON:
OCR Text: """${ocrText}"""

Return ONLY valid JSON with these exact keys:
{
  "store": "string",
  "date": "YYYY-MM-DD", 
  "items": [
    {"name": "string", "quantity": number, "price": number}
  ],
  "total": number,
  "currency": "string"
}`;

  try {
    console.log("Sending request to HF API...");
    const client = new InferenceClient(HUGGINGFACE_API_KEY);

    const response = await client.chatCompletion({
      model: MODEL_ID,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("HF API Response status:", response.choices[0].message);
    
    if (!response.ok) {
      // In React Native, we need to get the response text differently
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      console.error("HF API Error Response:", errorText);
      return {
        error: `API Error: ${response.status}`,
        message: errorText,
        rawResponse: errorText
      };
    }

    const result = await response.json();
    console.log("HF API Raw Result:", result);

    // Handle different response formats
    let textOutput = "";
    
    if (Array.isArray(result) && result.length > 0) {
      // Standard format: [{generated_text: "..."}]
      textOutput = result[0]?.generated_text || "";
    } else if (result.generated_text) {
      // Direct format: {generated_text: "..."}
      textOutput = result.generated_text;
    } else if (typeof result === "string") {
      // String format
      textOutput = result;
    } else {
      console.log("Unexpected response format:", result);
      return {
        error: "Unexpected response format",
        rawResponse: JSON.stringify(result, null, 2)
      };
    }

    console.log("Extracted text output:", textOutput);

    // Try to extract JSON from the text
    const jsonResult = extractJSONFromText(textOutput);
    
    if (jsonResult) {
      console.log("Successfully parsed JSON:", jsonResult);
      return jsonResult;
    } else {
      console.log("Could not extract valid JSON from response");
      return {
        error: "Could not parse JSON from response",
        rawText: textOutput,
        rawResponse: JSON.stringify(result, null, 2)
      };
    }

  } catch (err) {
    console.error("HF API error:", err);
    return {
      error: "Network or parsing error",
      message: err.message,
      rawError: err.toString()
    };
  }
}
