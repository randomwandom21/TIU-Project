
import { GoogleGenAI, Type } from "@google/genai";
import { MediaInsight } from "../definitions";

/**
 * Initializes the GenAI client using the environment-provided API key.
 */
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robustly extracts and parses JSON from the model response.
 * Uses structured output config where possible, but handles edge cases.
 */
const extractInsightData = (text: string): MediaInsight => {
  // Strip markdown markers if the model ignored the system instruction
  const cleanJson = text.replace(/```(?:json)?/g, "").trim();
  
  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Critical Parsing Error. Raw payload:", text);
    throw new Error("The analysis engine provided an unreadable data format. Please refine your URLs and try again.");
  }
};

/**
 * Defines the strict schema for the MediaInsight response to prevent parsing errors.
 */
const InsightSchema = {
  type: Type.OBJECT,
  properties: {
    verified_facts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER, description: "The unique identifier for the fact." },
          content: { type: Type.STRING, description: "The objective statement of fact." }
        },
        required: ["index", "content"]
      }
    },
    publications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          publisher: { type: Type.STRING },
          source_url: { type: Type.STRING },
          political_alignment: { type: Type.STRING },
          narratives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fact_id: { type: Type.INTEGER },
                framing_narrative: { type: Type.STRING },
                pivotal_terms: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["fact_id", "framing_narrative", "pivotal_terms"]
            }
          }
        },
        required: ["publisher", "source_url", "political_alignment", "narratives"]
      }
    },
    synthesis: {
      type: Type.OBJECT,
      properties: {
        consensus_points: { type: Type.ARRAY, items: { type: Type.STRING } },
        divergent_perspectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        analytical_meta_notes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["consensus_points", "divergent_perspectives", "analytical_meta_notes"]
    }
  },
  required: ["verified_facts", "publications", "synthesis"]
};

/**
 * Performs an audit of news coverage across multiple URLs.
 */
export const performCoverageAudit = async (articleUrls: string[]): Promise<{ report: MediaInsight; citations: any[] }> => {
  if (!articleUrls || articleUrls.length === 0) {
    throw new Error("At least one news URL is required for analysis.");
  }

  const ai = getClient();
  
  const systemInstruction = `You are a world-class forensic media auditor. 
Your objective is to ingest multiple news reports on the same event and deconstruct them into objective facts versus editorial framing.
You MUST provide a neutral, analytical report in JSON format.
Strictly adhere to the provided schema. Do not include commentary outside the JSON structure.
Use Google Search grounding to verify claims if the provided content is ambiguous.`;

  const userPrompt = `Audit the following news articles:
${articleUrls.map(url => `- ${url}`).join("\n")}

Focus on:
1. Identifying the core atomic facts common to all reports.
2. Mapping how each specific outlet uses framing or rhetorical devices to interpret those facts.
3. Synthesizing the high-level landscape of the coverage.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: InsightSchema,
        temperature: 0.1, // Lower temperature for more stable JSON output
      },
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("The AI model returned an empty response. This may be due to safety filters or connectivity issues.");
    }

    const report = extractInsightData(responseText);
    const citations = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { report, citations };
  } catch (error: any) {
    console.error("AI Audit Error:", error);
    
    // Improved error messaging for the UI
    let errorMessage = "An unexpected error occurred during analysis.";
    if (error.message?.includes("JSON")) {
      errorMessage = "The analysis failed due to a data formatting error. Please try again with different URLs.";
    } else if (error.status === 429) {
      errorMessage = "The service is currently overloaded. Please wait a moment before trying again.";
    }
    
    throw new Error(errorMessage);
  }
};
