
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFuturisticInspiration = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 fun, random, and slightly quirky predictions for the year 2026. Combine specific societal observations with humorous conclusions. Example: 'Tomato yields drop 50% globally; 2026 officially becomes the year of the White Pizza.' or 'Smart fridges start a union and demand better left-over management.' Keep descriptions under 20 words. The vibe should be lighthearted, surprising, and human-centric. No pink or purple references.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              topic: { type: Type.STRING }
            },
            required: ["text", "topic"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [
      { text: "Coffee beans become a global currency; your morning latte is now a high-stakes trade.", topic: "Economy" },
      { text: "Pigeons are discovered to be 40% more efficient at delivering local mail than drones.", topic: "Logistics" }
    ];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { text: "Self-driving cars refuse to move unless you compliment their paint job first.", topic: "Society" },
      { text: "Digital fashion for cats overtakes human haute couture in major fashion capitals.", topic: "Lifestyle" }
    ];
  }
};
