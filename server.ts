import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Configure multer for memory storage
  const upload = multer({ storage: multer.memoryStorage() });

  // API Routes
  app.post("/api/parse-cv", upload.single("cv"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      // Determine mime type
      const mimeType = req.file.mimetype;
      if (mimeType !== "application/pdf" && !mimeType.startsWith("text/") && mimeType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or text document." });
      }

      const fileData = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: mimeType,
        },
      };

      const prompt = `
        You are an expert CV parser. Extract the following information from the provided CV document and return it as a structured JSON object.
        If a piece of information is not found, leave it as an empty string or null.
        
        Required fields in JSON:
        - full_name: string (Full Name)
        - permanent_address: string
        - present_address: string
        - contact: string (Phone number)
        - education_qualification: string (One of: "SSC", "HSC", "Diploma", "Bachelor", "Masters", "PhD")
        - experience: string (One of: "No experience", "Less than 1 year", "1-2 years", "3-5 years", "5+ years")
        - college_university: string (Name of current or most recent college/university)
        - nid: string (National ID number, if present)
        
        Optional fields:
        - subjects: array of strings (Subjects they can teach, e.g. ["Bengali", "English", "Math", "Science", "Physics"])
        - class_levels: array of strings (Class levels they can teach, e.g. ["Play/Nursery", "Class 1-5", "Class 6-8", "Class 9-10", "SSC", "HSC", "University", "Skills"])
        - medium: string (One of: "Bangla Medium", "English Medium", "Both")
        - preferred_area: string (Preferred teaching locations/areas)
        - expected_salary: number (Expected monthly salary in BDT, extract number only)
        - bio: string (A short professional summary, max 300 chars)

        Respond ONLY with a valid JSON object. No markdown wrapping or other text.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [fileData, { text: prompt }] }
            ],
            generationConfig: {
              responseMimeType: "application/json",
            }
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate content");
      }

      let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      try {
        const parsedData = JSON.parse(responseText);
        return res.json(parsedData);
      } catch (parseError) {
        return res.status(500).json({ error: "Failed to parse AI response as JSON" });
      }

    } catch (error: any) {
      console.error("Error parsing CV:", error);
      return res.status(500).json({ error: error.message || "An error occurred during CV parsing" });
    }
  });

  // Vite middleware for development
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
