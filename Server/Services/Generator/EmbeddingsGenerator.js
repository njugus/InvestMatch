import { pipeline } from "@xenova/transformers";

const model = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");

export const generateEmbedding = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid input text");
    }

    const embedding = await model(text, { pooling: "mean", normalize: true });
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error.message);
    return null;
  }
};
