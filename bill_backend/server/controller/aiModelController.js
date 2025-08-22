import fetch from "node-fetch";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_KEY = "AIzaSyBEUuYCDz-Iq4n8uhQEtsTzKa-1jfRQ7YE";

// ================= Helper: Gemini API =================
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
      console.error("❌ Gemini API Error Response:", errorText);
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

// ================= Analysis Modules =================
async function analyzeCategory(imageBase64) {
  try {
    const prompt = `Analyze this billboard image and determine the main violation category.
Choose from:
- Structural Hazard
- Content Violation
- Size & Placement
- Safety Hazard
- Regulatory Compliance
- Environmental Impact

Return ONLY the category name as a string.`;

    const response = await callGeminiAPI(prompt, imageBase64);
    return response.trim().replace(/["']/g, "");
  } catch {
    return "Safety Hazard";
  }
}

async function analyzeContent(imageBase64) {
  try {
    const prompt = `Analyze this billboard image for:
1. Obscene or inappropriate content
2. Political content
3. Overall content compliance

Return JSON: { "obscene_detected": boolean, "political_detected": boolean, "content_compliant": boolean }`;

    const response = await callGeminiAPI(prompt, imageBase64);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return {
      obscene_detected: false,
      political_detected: false,
      content_compliant: true,
    };
  } catch {
    return {
      obscene_detected: false,
      political_detected: false,
      content_compliant: true,
    };
  }
}

async function analyzeStructure(imageBase64) {
  try {
    const prompt = `Analyze billboard structure for safety hazards:
Return JSON: { "structural_damage": boolean, "leaning": boolean, "broken_parts": boolean, "structural_hazard": boolean }`;

    const response = await callGeminiAPI(prompt, imageBase64);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return {
      structural_damage: false,
      leaning: false,
      broken_parts: false,
      structural_hazard: false,
    };
  } catch {
    return {
      structural_damage: false,
      leaning: false,
      broken_parts: false,
      structural_hazard: false,
    };
  }
}

async function analyzeSizeAndPlacement(imageBase64) {
  try {
    const prompt = `Analyze billboard for size & placement issues.
Return JSON: { "size_appropriate": boolean, "obstructs_traffic": boolean, "blocks_visibility": boolean, "too_close_to_road": boolean }`;

    const response = await callGeminiAPI(prompt, imageBase64);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return {
      size_appropriate: true,
      obstructs_traffic: false,
      blocks_visibility: false,
      too_close_to_road: false,
    };
  } catch {
    return {
      size_appropriate: true,
      obstructs_traffic: false,
      blocks_visibility: false,
      too_close_to_road: false,
    };
  }
}

// ================= Risk Analysis =================
async function analyzeRisk(
  imageBase64,
  description,
  latitude,
  longitude,
  extractedText,
  category,
  contentAnalysis,
  structuralAnalysis,
  sizeAnalysis
) {
  try {
    const prompt = `You are an AI billboard risk assessor.

Context:
- Description: "${description}"
- Extracted Text: "${extractedText}"
- Category: ${category}
- Content Analysis: ${JSON.stringify(contentAnalysis)}
- Structural Analysis: ${JSON.stringify(structuralAnalysis)}
- Size & Placement Analysis: ${JSON.stringify(sizeAnalysis)}
- Location: (lat: ${latitude}, lng: ${longitude})

Task:
Determine the risk level and percentage.
Guidelines:
- High Risk (>=70%): Serious safety hazards, major structural issues, dangerous placement, or illegal/obscene content.
- Medium Risk (41-69%): Some issues but not immediately dangerous.
- Low Risk (0-40%): Safe, compliant, minimal issues.

Return JSON only:
{ "riskPercentage": number, "riskLevel": "High" | "Medium" | "Low", "reason": string }`;

    const response = await callGeminiAPI(prompt, imageBase64);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { riskPercentage: 35, riskLevel: "Low", reason: "Default fallback" };
  } catch {
    return {
      riskPercentage: 35,
      riskLevel: "Low",
      reason: "Risk analysis failed",
    };
  }
}

// ================= Main Controller =================
export async function analyzeBillboard(
  imageBase64,
  description,
  latitude,
  longitude
) {
  try {
    // Extract text first
    let extractedText = "";
    try {
      const extractionPrompt =
        "Extract all text visible in the billboard image. Return exactly the text.";
      extractedText = await callGeminiAPI(extractionPrompt, imageBase64);
    } catch {
      extractedText = "";
    }

    // Parallel analysis
    const [aiCategory, contentAnalysis, structuralAnalysis, sizeAnalysis] =
      await Promise.all([
        analyzeCategory(imageBase64),
        analyzeContent(imageBase64),
        analyzeStructure(imageBase64),
        analyzeSizeAndPlacement(imageBase64),
      ]);

    // Risk analysis
    const { riskPercentage, riskLevel, reason } = await analyzeRisk(
      imageBase64,
      description,
      latitude,
      longitude,
      extractedText,
      aiCategory,
      contentAnalysis,
      structuralAnalysis,
      sizeAnalysis
    );

    return {
      extractedText,
      riskPercentage,
      riskLevel,
      riskReason: reason,
      aiCategory,
      contentAnalysis,
      structuralAnalysis,
      sizeAnalysis,
    };
  } catch (err) {
    console.error("🚨 Billboard Analysis Error:", err);
    return {
      extractedText: "",
      riskPercentage: 25,
      riskLevel: "Medium",
      riskReason: `Analysis failed: ${err.message}`,
      aiCategory: "Safety Hazard",
    };
  }
}
