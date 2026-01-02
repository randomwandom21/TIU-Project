import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

// Hardcoded API key as requested by the user
const ai = new GoogleGenAI({ apiKey: "AIzaSyBXsRiOyKmwy7V2ip01AUVW9R8jkBs5P8k" });

const cleanAndParseJSON = (text: string): any => {
  // 1. Remove markdown code blocks
  let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

  // 2. Handle concatenated JSONs (e.g. "}{")
  // If the model outputs two JSON objects back-to-back, take the first one.
  // We look for the pattern "}{" or "}\n{"
  const splitMatch = clean.match(/}\s*\{/);
  if (splitMatch && splitMatch.index !== undefined) {
    clean = clean.substring(0, splitMatch.index + 1);
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    // 3. Attempt repair for common error: closing array with } instead of ]
    // Pattern: ... "string" } }  -> should be ... "string" ] }
    // This often happens at the end of the JSON structure.
    if (clean.match(/["\d|true|false]\s*}\s*}/)) {
       const fixed = clean.replace(/(["\d|true|false]\s*)}\s*}/, "$1]}");
       try {
         return JSON.parse(fixed);
       } catch (e2) {
         // continued failure, throw original
       }
    }
    throw e;
  }
};

export const analyzeNewsUrls = async (urls: string[]): Promise<{ data: AnalysisResult; grounding: any[] }> => {
  if (urls.length === 0) {
    throw new Error("No URLs provided");
  }

  const systemMsg = `
    You are an expert media analyst comparing how different news outlets report the same incident. 
    You MUST strictly separate (1) bare facts from (2) each outlet's interpretation and (3) a final neutral overview.
    
    You will be using Google Search to access information about the provided URLs or the stories they represent.
    Respect copyright: do NOT copy long passages or exact wording. Paraphrase concisely.
  `;

  const userMsg = `
    I need you to analyze the news coverage regarding the stories found at these URLs:
    ${urls.join("\n")}

    Your tasks:

    1. FACTS SECTION
       - Extract only directly reported, verifiable facts (who, what, when, where, official numbers or statements).
       - Do NOT include motives, opinions, predictions, emotional adjectives, or speculation.

    2. INTERPRETATION SECTION (PER OUTLET)
       - For each article/outlet identified, explain how it interprets or spins each fact.
       - Note: framing, who is blamed or defended, which actors are emphasized or downplayed.
       - Mention notable word choices or recurring themes, but paraphrase briefly.

    3. PERSPECTIVE SUMMARY SECTION
       - Summarize in a neutral tone the main clusters of viewpoints.
       - Explicitly distinguish between areas of agreement on facts and areas of disagreement in interpretation.

    OUTPUT FORMAT (VERY IMPORTANT):
    Return STRICTLY valid JSON. Ensure all arrays are closed with ']' and objects with '}'.
    Do not add any text before or after the JSON.

    Structure:
    {
      "facts": [
        {"id": 1, "statement": "..." }
      ],
      "outlets": [
        {
          "name": "Outlet name",
          "url": "Original URL provided",
          "claimed_leaning": "right | left | center | center-right | center-left | unclear",
          "interpretations": [
            {
              "fact_id": 1,
              "how_they_spin_it": "...",
              "notable_language": ["..."]
            }
          ]
        }
      ],
      "perspective_summary": {
        "areas_of_agreement": ["..."],
        "areas_of_disagreement": ["..."],
        "meta_observations": ["..."]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: userMsg }] },
      ],
      config: {
        systemInstruction: systemMsg,
        tools: [{ googleSearch: {} }],
      },
    });

    const textResponse = response.text || "";
    
    try {
      const data: AnalysisResult = cleanAndParseJSON(textResponse);
      
      // Extract grounding metadata to show sources used
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return { data, grounding };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw Text:", textResponse);
      throw new Error("Failed to parse the analysis results. Please try again.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
