import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize with official Google Gemini API for text enhancement
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY
});

export const generateCampaignImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string | null> => {
  try {
    // First, enhance the prompt with Gemini for better image generation
    const enhanceResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{
        role: 'user',
        parts: [{
          text: `You are a prompt engineer for image generation. Enhance this prompt for better image generation: "${prompt}". Make it vivid, detailed, and funny for flight satire theme. Return ONLY the enhanced prompt, nothing else.`
        }]
      }],
    });

    const enhancedPrompt = enhanceResponse.text || prompt;

    // Call backend API for image generation
    const response = await fetch('http://localhost:5000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: enhancedPrompt }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    // Convert blob to data URL for persistence
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};