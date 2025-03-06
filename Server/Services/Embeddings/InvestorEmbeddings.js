import { connectDB } from "../../Utils/Connection.js";
import generateEmbedding from "../Generator/EmbeddingsGenerator.js";

const updateInvestorEmbeddings = async () => {
  try {
    // Set up the database connection
    const db = await connectDB();
    const investorsCollection = db.collection("Investor");

    // Find investors who don't have embeddings
    const investors = await investorsCollection.find({ Embedding: { $exists: false } }).toArray();
    if (investors.length === 0) {
      console.log("No investors need embedding updates.");
      return;
    }

    const bulkOperations = [];

    for (let investor of investors) {
      try {
        // Convert investor profile to text format safely
        const profileText = [
          (investor.Preferences?.Industries || []).join(", ") + " investor",
          "interested in " + (investor.Preferences?.FundingStages || []).join(", "),
          "startups in " + (investor.Preferences?.GeographicPreferences || []).join(", "),
        ].join(" ");

        // Generate embedding
        const embedding = await generateEmbedding(profileText);
        if (!embedding) {
          console.error(`Failed to generate embedding for Investor: ${investor.InvestorID}`);
          continue;
        }

        // Add to bulk update operations(add the object to the bulkOperations array)
        bulkOperations.push({
          updateOne: {
            filter: { InvestorID: investor.InvestorID },
            update: { $set: { Embedding: embedding } },
          },
        });

        console.log(`Updated embedding for Investor: ${investor.InvestorID}`);
      } catch (error) {
        console.error(`Error processing Investor ${investor.InvestorID}:`, error.message);
      }
    }

    // Execute bulk update
    if (bulkOperations.length > 0) {
      await investorsCollection.bulkWrite(bulkOperations);
      console.log(`Successfully updated ${bulkOperations.length} investor embeddings.`);
    }
  } catch (err) {
    console.error("Error updating investor embeddings:", err.message);
  }
};

// Run the function
updateInvestorEmbeddings();

