import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily if API key is present
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiAvailable: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Career Advisor / Roadmap Insights Endpoint
app.post("/api/ai/guidance", async (req, res) => {
  try {
    const { careerTitle, currentSkills, missingSkills, nextSkill } = req.body;

    if (!careerTitle) {
      return res.status(400).json({ error: "Career title is required." });
    }

    const ai = getGenAI();

    // If Gemini is available, provide AI insights
    if (ai) {
      const prompt = `You are a friendly, pragmatic senior engineering career mentor helping an entry-level student or graduate targeting the role of "${careerTitle}".
Current skills they already have: ${Array.isArray(currentSkills) && currentSkills.length > 0 ? currentSkills.join(", ") : "None yet"}.
Key missing skills they need to learn: ${Array.isArray(missingSkills) && missingSkills.length > 0 ? missingSkills.join(", ") : "None"}.
Immediate next recommended skill to focus on: "${nextSkill || "Foundations"}".

Please provide:
1. "mentorSummary": 2 concise sentences of encouragement and strategic direction.
2. "whyNextSkillMatters": 1-2 punchy sentences on why learning "${nextSkill || "the next skill"}" now unlocks hiring potential for ${careerTitle}.
3. "fastTrackTips": An array of 3 practical, actionable tips (each max 20 words) for mastering this role quickly without tutorial hell (e.g. building projects, GitHub practices, reading documentation).

Format response strictly as valid JSON with keys: mentorSummary, whyNextSkillMatters, fastTrackTips.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({
          source: "gemini",
          data: parsed,
        });
      }
    }

    // Curated high-quality fallback if no API key or if parsing fails
    return res.json({
      source: "rule-based",
      data: {
        mentorSummary: `You have an encouraging starting foundation for ${careerTitle}. Focus your energy on closing the core gaps step-by-step rather than trying to learn everything at once.`,
        whyNextSkillMatters: nextSkill
          ? `${nextSkill} is in high demand by hiring managers for ${careerTitle} and directly bridges your foundation to practical real-world work.`
          : `Solidifying your core technical tools gives you instant confidence in technical interviews.`,
        fastTrackTips: [
          "Build 1 real, end-to-end portfolio project rather than watching dozens of passive video tutorials.",
          "Document your weekly learning milestones and push clean commits to a public GitHub repo.",
          "Practice articulating why you chose specific tools and how they solve actual business problems.",
        ],
      },
    });
  } catch (error: any) {
    console.error("AI Guidance API fallback:", error?.message || error);
    // Graceful fallback on error so the frontend is never interrupted
    return res.json({
      source: "fallback",
      data: {
        mentorSummary: `Keep building momentum. Every single skill you check off brings you closer to being job-ready.`,
        whyNextSkillMatters: `Focusing on this skill bridges the gap between theoretical knowledge and practical production work.`,
        fastTrackTips: [
          "Focus on hands-on code exercises daily for 45 minutes.",
          "Build small utility apps to solidify every concept you learn.",
          "Review real job postings to see how this skill is paired in team environments.",
        ],
      },
    });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
