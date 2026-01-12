
import { GoogleGenAI } from "@google/genai";
import { MediaInsight } from "../definitions";

// Utilizing the specific credentials provided
const provider = new GoogleGenAI({ apiKey: "AIzaSyBXsRiOyKmwy7V2ip01AUVW9R8jkBs5P8k" });

/**
 * Sanitizes and parses LLM generated JSON strings, handling edge cases 
 * like code blocks and malformed array terminations.
 */
const sanitizeAndExtract = (rawResponse: string): any => {
  // Strip potential markdown enclosures
  let processed = rawResponse.replace(/```(?:json)?/g, "").trim();

  // Handle multi-object emissions (stop at first closure)
  const boundary = processed.indexOf("}{");
  if (boundary !== -1) {
    processed = processed.substring(0, boundary + 1);
  }

  try {
    return JSON.parse(processed);
  } catch (initialError) {
    // Fallback logic for common structural mistakes (e.g., closing arrays with '}' instead of ']')
    const corrected = processed.replace(/([":\w\d])\s*}\s*}$/m, "$1]}");
    try {
      return JSON.parse(corrected);
    } catch {
      throw initialError;
    }
  }
};

/**
 * Orchestrates the multi-source media analysis using Gemini.
 */
export const performCoverageAudit = async (articleUrls: string[]): Promise<{ report: MediaInsight; citations: any[] }> => {
  if (!articleUrls || articleUrls.length === 0) throw new Error("Input URLs required");

  const coreInstructions = `
    Context: You are a high-level forensic media analyst. 
    Mission: Deconstruct news coverage of the same event into three specific tiers:
    1. Objective Reality (Atomic facts only)
    2. Framing & Rhetoric (How individual outlets spin those facts)
    3. Synthesis (A high-level view of the media landscape)
    
    Constraint: Use Google Search for external verification. Paraphrase all information; do not violate copyright.
  `;

  const analyticalRequest = `
    Analyze the reporting found at these specific endpoints:
    ${articleUrls.map(u => `- ${u}`).join("\n")}

    Required Structure:
    1. FACTUAL BASELINE: Enumerate only verifiable, adjective-free statements.
    2. NARRATIVE LAYERS: For every outlet, map their interpretation to specific facts. Identify loaded language.
    3. COMPARATIVE WRAP-UP: Identify what is universally accepted vs. where the spin diverges.

    MANDATORY RESPONSE FORMAT:
    Output ONLY a JSON object. No preamble. No markdown outside the block.
    
    Mapping Schema:
    {
      "verified_facts": [ { "index": number, "content": "string" } ],
      "publications": [
        {
          "publisher": "string",
          "source_url": "string",
          "political_alignment": "string",
          "narratives": [ { "fact_id": number, "framing_narrative": "string", "pivotal_terms": ["string"] } ]
        }
      ],
      "synthesis": {
        "consensus_points": ["string"],
        "divergent_perspectives": ["string"],
        "analytical_meta_notes": ["string"]
      }
    }
  `;

  try {
    const result = await provider.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: analyticalRequest }] }],
      config: {
        systemInstruction: coreInstructions,
        tools: [{ googleSearch: {} }],
      },
    });

    const raw = result.text || "";
    
    try {
      const report: MediaInsight = sanitizeAndExtract(raw);
      const citations = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { report, citations };
    } catch (err) {
      console.group("Extraction Failure");
      console.error(err);
      console.debug("Payload:", raw);
      console.groupEnd();
      throw new Error("The analysis engine returned an invalid data format.");
    }
  } catch (apiErr) {
    console.error("AI Service Error:", apiErr);
    throw apiErr;
  }
};
