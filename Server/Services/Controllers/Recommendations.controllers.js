import { connectDB } from '../../Utils/Connection.js'
import cosineSimilarity from '../../Services/MatchingService/cosineSimilarity.js'
import filterStartups from '../../Utils/filters.js';

// Controller to find an investor’s top 5 startup matches
export const findTopStartupsForInvestors = async (req, res) => {
    try {
        //extract UserID from decoded token
        const UserID = req.user.UserID
        console.log(UserID)
        // Connect to the database
        const db = await connectDB();
        const investorCollection = db.collection("Investor");
        const startupCollection = db.collection("Startup");

        // Fetch investor details
        const investorDetails = await investorCollection.findOne({ UserID });
        if (!investorDetails || !investorDetails.Embedding?.data) {
            return res.status(404).json({
                success: false,
                message: "Investor details not found or missing embeddings",
            });
        }

        // Extract the investor's embedding
        const investorEmbedding = investorDetails.Embedding.data;
        const investorID = investorDetails.InvestorID

        // Fetch all startup embeddings alongside their names and IDs
        const startups = await startupCollection.find(
            { "Embedding.data": { $exists: true } }, // Ensure embeddings exist
            { projection: { Name: 1, StartupID: 1, "Embedding.data": 1 } }
        ).toArray();

        if (startups.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No startups found",
            });
        }

        // Compute cosine similarity
        const rankedStartups = startups.map(startup => {
        const similarity = cosineSimilarity(investorEmbedding, startup.Embedding.data);
        let matchCategory;

        if (similarity >= 0.8) {
            matchCategory = "Strong match (Highly relevant startup)";
        } else if (similarity >= 0.5) {
            matchCategory = "Moderate match (Some relevance, but less ideal)";
        } else if (similarity >= 0.2) {
            matchCategory = "Weak match (Might not be useful)";
        } else {
            matchCategory = "Not a good match";
        }

        return {
            name: startup.Name,
            id: startup.StartupID,
            similarity: similarity,
            similarityPercentage: (similarity * 100).toFixed(2) + "%", // Convert to percentage
            matchCategory: matchCategory, // Add matchmaking category
        };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

        res.status(200).json({
            success: true,
            result: rankedStartups,
        });

    } catch (err) {
        console.error("Error in findTopStartupsForInvestors:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


//Matchmaking Based on Filtering Criteria
export const matchFilteredStartups = async (req, res) => {
    try {
       
        const UserID = req.user.UserID;
        const db = await connectDB();
        const investorCollection = db.collection("Investor");

        const investorDetails = await investorCollection.findOne({ UserID });
        if (!investorDetails || !investorDetails.Embedding?.data) {
            return res.status(404).json({ success: false, message: "Investor details not found or missing embeddings" });
        }

        // Extract the investor's embedding
        const investorEmbedding = investorDetails.Embedding.data;

        // Get filtered startups
        const { startups } = await filterStartups(req.query);

        if (startups.length === 0) {
            return res.status(404).json({ success: false, message: "No startups found for the applied filters" });
        }

        // Compute similarity scores
        const rankedStartups = startups
            .filter(startup => startup.Embedding?.data) // Ensure embeddings exist
            .map(startup => {
                const similarity = cosineSimilarity(investorEmbedding, startup.Embedding.data);
                let matchCategory = similarity >= 0.8 ? "Strong match" :
                                    similarity >= 0.5 ? "Moderate match" :
                                    similarity >= 0.2 ? "Weak match" :
                                    "Not a good match";

                return {
                    name: startup.Name,
                    id: startup.StartupID,
                    similarity: similarity,
                    similarityPercentage: (similarity * 100).toFixed(2) + "%",
                    matchCategory
                };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        res.status(200).json({
            success: true,
            result: rankedStartups
        });

    } catch (error) {
        console.error("Error in matchFilteredStartups:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};


