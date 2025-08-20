import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/analysis", async (req, res) => {
  const { description, location, latitude, longitude, images } = req.body;

  if (
    !description ||
    !location ||
    !latitude ||
    !longitude ||
    !images ||
    !Array.isArray(images)
  ) {
    return res.status(400).json({ error: "Missing or invalid fields." });
  }

  const parts = [];

  images.forEach((base64) => {
    parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: base64,
      },
    });
  });


  
  parts.push({
    text: `
You are a professional safety inspector AI.

Analyze the following incident report:
- Description: ${description}
- Location: ${location}
- Coordinates: ${latitude}, ${longitude}
- Multiple images are provided for visual inspection.

Based on all data (text + images), assess the safety risk.

Provide a JSON response ONLY in the following format:
{
  "risk_percentage": <number from 0 to 100>,
  "risk_level": "High" | "Medium" | "Low",
  "reason": "<short explanation of why this risk level was given>"
}

Rules:
- The risk_level must be one of: "High", "Medium", "Low"
- Do not include anything outside of the JSON object.
`,
  });

  const geminiUrl = `${process.env.GEMINI_URL}?key=${process.env.GEMINI_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: parts,
      },
    ],
  };

  try {
    const response = await axios.post(geminiUrl, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
      const parsed = JSON.parse(aiText);
      return res.json(parsed);
    } catch (e) {
      return res.json({ raw: aiText });
    }
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
