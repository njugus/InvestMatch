import { connectDB } from "../../Utils/Connection.js";
import generateEmbedding from "../Generator/EmbeddingsGenerator.js";

const updateStartupEmbeddings = async () => {
  try {
    // Connect to the database
    const db = await connectDB();
    const startupCollection = db.collection("Startup");

    // Fetch all startups without embeddings
    const startups = await startupCollection.find({ Embedding: { $exists: false } }).toArray();

    const bulkOperations = [];
    for (let startup of startups) {
      // Convert startup profile to text format, including Mission and Vision
      const profileText = `Startup Name: ${startup.Name}.
      Industry: ${startup.Industry}.
      Funding Stage: ${startup.FundingStage}.
      Traction Metrics: ${startup.TractionMetrics}.
      Mission: ${startup.Mission}.
      Vision: ${startup.Vision}.`;

      // Generate embedding
      const embedding = await generateEmbedding(profileText);
      if (!embedding) {
        console.error(`Failed to generate embedding for Startup: ${startup.StartupID}`);
        continue;
      }

      // Add to bulk update operations
      bulkOperations.push({
        updateOne: {
          filter: { StartupID: startup.StartupID },
          update: { $set: { Embedding: embedding } },
        },
      });

      console.log(`Prepared embedding update for Startup: ${startup.StartupID}`);
    }

    // Execute bulk update if there are any updates to process
    if (bulkOperations.length > 0) {
      await startupCollection.bulkWrite(bulkOperations);
      console.log(`Successfully updated ${bulkOperations.length} startup embeddings.`);
    } else {
      console.log("No startups needed embedding updates.");
    }

  } catch (err) {
    console.error("Error updating startup embeddings:", err.message);
  }
};
// Run the function
export default updateStartupEmbeddings;