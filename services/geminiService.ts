
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCulturalInsight = async (title: string, artist: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed cultural and historical analysis of a fictional artwork titled "${title}" by "${artist}". The description of the piece is: "${description}". Focus on potential influences, symbolism, and its place in modern art history. Format the response as a short educational essay.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching cultural insight:", error);
    return "Could not retrieve cultural history at this time.";
  }
};

export const getGalleryGuideResponse = async (userMessage: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are the 'ArtForge' AI Assistant. You are a sophisticated, friendly, and knowledgeable gallery guide. Help users navigate the gallery, explain art concepts, and suggest artworks based on their interests. Keep responses concise and inspiring.",
      }
    });
    
    // Note: In a real implementation we'd pass history, but for simplicity we'll just send the message
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
    });
    return response.text;
  } catch (error) {
    console.error("Error in AI Assistant:", error);
    return "I'm currently contemplating some deep artistic concepts. How else can I assist you today?";
  }
};

export const generateBrandStory = async (appName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a sophisticated and inspiring brand story for a digital art platform named "${appName}". Focus on themes of digital craftsmanship, the intersection of art and technology, and the preservation of creative legacy. Format it as a short, elegant narrative.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating brand story:", error);
    return "The forge is currently cold. Please try again later.";
  }
};
