import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const GEMINI_URL = process.env.GEMINI_URL;
const GEMINI_KEY = process.env.GEMINI_KEY;

async function callGeminiAPI(prompt, imageBase64 = null) {
  try {
    if (!GEMINI_KEY) throw new Error("GEMINI_KEY is not set");

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...(imageBase64
              ? [{ inlineData: { mimeType: "image/png", data: imageBase64 } }]
              : []),
          ],
        },
      ],
    };

    const url = `${GEMINI_URL}?key=${GEMINI_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API Error Response:", errorText);
      throw new Error(
        `Gemini API request failed: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text returned from Gemini API");

    return text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error(`Gemini API failed: ${err.message}`);
  }
}

export async function analyzeBillboard(
  imageBase64,
  description,
  latitude,
  longitude
) {
  try {
    const prompt = `
You are an AI billboard analysis system.
Analyze the billboard image and return a JSON object with the following fields only:

{
  "extractedText": string,
  "riskPercentage": number,
  "riskLevel": "High" | "Medium" | "Low",
  "riskReason": string,
  "aiCategory": string,
  "contentAnalysis": {
    "obscene_detected": boolean,
    "political_detected": boolean,
    "content_compliant": boolean
  },
  "structuralAnalysis": {
    "structural_damage": boolean,
    "leaning": boolean,
    "broken_parts": boolean,
    "structural_hazard": boolean
  },
  "sizeAnalysis": {
    "size_appropriate": boolean,
    "obstructs_traffic": boolean,
    "blocks_visibility": boolean,
    "too_close_to_road": boolean
  }
}

Guidelines:
- Extract visible text from the billboard.
- aiCategory must be one of:
  Structural Hazard, Content Violation, Size & Placement,
  Safety Hazard, Regulatory Compliance, Environmental Impact.
- Risk assessment:
  * High Risk (>=70%): serious structural hazards, illegal/obscene content, dangerous placement
  * Medium Risk (41-69%): issues but not immediately dangerous
  * Low Risk (0-40%): safe, compliant
- Fill all boolean fields with true/false, no nulls.
- Do not include any explanation outside JSON.
Context:
- Description: "${description}"
- Location: (lat: ${latitude}, lng: ${longitude})
`;

    const response = await callGeminiAPI(prompt, imageBase64);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      extractedText: "",
      riskPercentage: 25,
      riskLevel: "Medium",
      riskReason: "Default fallback",
      aiCategory: "Safety Hazard",
      contentAnalysis: {
        obscene_detected: false,
        political_detected: false,
        content_compliant: true,
      },
      structuralAnalysis: {
        structural_damage: false,
        leaning: false,
        broken_parts: false,
        structural_hazard: false,
      },
      sizeAnalysis: {
        size_appropriate: true,
        obstructs_traffic: false,
        blocks_visibility: false,
        too_close_to_road: false,
      },
    };
  } catch (err) {
    console.error("Billboard Analysis Error:", err);
    return {
      extractedText: "",
      riskPercentage: 25,
      riskLevel: "Medium",
      riskReason: `Analysis failed: ${err.message}`,
      aiCategory: "Safety Hazard",
      contentAnalysis: {
        obscene_detected: false,
        political_detected: false,
        content_compliant: true,
      },
      structuralAnalysis: {
        structural_damage: false,
        leaning: false,
        broken_parts: false,
        structural_hazard: false,
      },
      sizeAnalysis: {
        size_appropriate: true,
        obstructs_traffic: false,
        blocks_visibility: false,
        too_close_to_road: false,
      },
    };
  }
}

export default router;
