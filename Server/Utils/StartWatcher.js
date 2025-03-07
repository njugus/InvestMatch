import { connectDB } from '../Utils/Connection.js'
import updateInvestorEmbeddings from '../Services/Embeddings/InvestorEmbeddings.js'
import updateStartupEmbeddings from "../Services/Embeddings/StartupEmbeddings.js";

const watchCollections = async (db) => {
  try {
    console.log("Watching for changes in Investor and Startup collections...");

    const investorCollection = db.collection("Investor");
    const startupCollection = db.collection("Startup");

    const changePipeline = [
      {
        $match: {
          operationType: { $in: ["insert", "update"] }, // Watch for inserts & updates
        },
      },
    ];

    // Watch for Investor changes
    investorCollection.watch(changePipeline).on("change", async (change) => {
      console.log("Change detected in Investor collection:", change.operationType);
      await updateInvestorEmbeddings();
    });

    // Watch for Startup changes
    startupCollection.watch(changePipeline).on("change", async (change) => {
      console.log("Change detected in Startup collection:", change.operationType);
      await updateStartupEmbeddings();
    });

  } catch (err) {
    console.error("Error watching MongoDB collections:", err.message);
  }
};

// Connect to DB and start watching for changes
const startWatcher = async () => {
  try {
    const db = await connectDB(); // Connect once and reuse connection
    await watchCollections(db);
  } catch (err) {
    console.error("Failed to start watcher:", err.message);
  }
};

startWatcher();


export default watchCollections;
