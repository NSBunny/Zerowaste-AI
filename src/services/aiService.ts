/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface FoodAnalysis {
  foodName: string;
  quantityEst: string;
  freshnessScore: number; // 0-100
  expiryEstimation: string;
  isSafe: boolean;
  notes: string;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this food image for a food rescue app. 
    1. Identify the food items.
    2. Estimate the quantity.
    3. Assess freshness (0-100 score).
    4. Estimate how much longer it will be edible (e.g., "4-6 hours", "2 days").
    5. Determine if it looks safe for consumption.
    
    Return the analysis strictly as a JSON object with the following schema:
    {
      "foodName": "string",
      "quantityEst": "string",
      "freshnessScore": number,
      "expiryEstimation": "string",
      "isSafe": boolean,
      "notes": "string"
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as FoodAnalysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      foodName: "Unknown",
      quantityEst: "Unknown",
      freshnessScore: 50,
      expiryEstimation: "Unknown",
      isSafe: true,
      notes: "AI analysis failed."
    };
  }
}
