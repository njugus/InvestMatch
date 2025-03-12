
import StartupModel from "../../Models/Startup.model.js";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from '../../Utils/Connection.js'
import authMiddleware from '../../Auth/authmiddleware.js'
import filterStartups from "../../Utils/filters.js";

// Create a new startup
export const CreateNewStartup = async (req, res) => {
    try {
        // Get the UserID from the authenticated user
        const UserID = req.user.UserID;
        console.log(UserID)
        // Destructure request body
        const { 
            Name, Industry, FundingStage, GeographicLocation, 
            PitchDeck, Website, ContactEmail
        } = req.body;

        // Validate required fields
        if (!Name || !Industry || !FundingStage || !GeographicLocation || !PitchDeck || !Website || !ContactEmail) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled."
            });
        }

        // Create new startup entry
        const db = await connectDB()
        const collection = db.collection("Startup")
        const newStartup = {
            StartupID: uuidv4(),
            UserID,
            Name,
            Industry,
            FundingStage,
            GeographicLocation,
            Founders: [],  // Default empty array
            FinancialMetrics: {
                Revenue: 0, 
                GrowthRate: 0, 
                UserBase: 0
            },
            TractionMetrics: {
                Customers: 0, 
                FundingReceived: 0, 
                MonthlyBurnRate: 0
            },
            PitchDeck,
            Website,
            ContactEmail,
            CreatedAt: new Date(),  // Automatically set timestamps
            UpdatedAt: new Date()
        };

        // insert the document inside the startup collection
        const result = await collection.insertOne(newStartup)

        if(!result.acknowledged){
            return res.status(500).json({
                success : false,
                message : "could not create the startup"
            })
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: "Startup created successfully!",
            startup: newStartup
        });

    } catch (error) {
        // Error handling
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        });
    }
};


// Get all startups with filtering, sorting, and pagination
// export const GetAllStartups = async (req, res) => {
//     try {
//         // Extract query parameters from the request
//         const { industry, fundingStage, location, sortBy, order, page, limit } = req.query;

//         // Create a filter object for MongoDB query
//         const filters = {};
//         if (industry) filters.Industry = industry;
//         if (fundingStage) filters.FundingStage = fundingStage;
//         if (location) filters.GeographicLocation = location; // Fixed field name

//         // Sorting options
//         const sortingOptions = {};
//         if (sortBy) {
//             sortingOptions[sortBy] = order === "asc" ? 1 : -1;
//         } else {
//             sortingOptions["CreatedAt"] = -1; // Default sorting (newest first)
//         }

//         // Pagination setup
//         const pageNum = parseInt(page) || 1;
//         const pageSize = parseInt(limit) || 10;
//         const skip = (pageNum - 1) * pageSize;

//         // Connect to the database
//         const db = await connectDB();
//         const collection = db.collection("Startup");

//         // Fetch startups with filters, sorting, and pagination
//         const startups = await collection
//             .find(filters)
//             .sort(sortingOptions)
//             .skip(skip)
//             .limit(pageSize)
//             .toArray(); // Fix: Convert cursor to an array

//         // Count total results for pagination
//         const totalCount = await collection.countDocuments(filters);

//         // Return the total number of filtered results for pagination purposes
//         res.status(200).json({
//             success: true,
//             pageNum,
//             pageSize,
//             totalStartups: totalCount,
//             startups
//         });

//     } catch (error) {
//         console.error("Error fetching startups:", error); // Log error for debugging
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error. Please try again later.",
//         });
//     }
// };

export const GetAllStartups = async (req, res) => {
    try {
        const { startups, totalCount, pageNum, pageSize } = await filterStartups(req.query);

        res.status(200).json({
            success: true,
            pageNum,
            pageSize,
            totalStartups: totalCount,
            startups
        });

    } catch (error) {
        console.error("Error fetching startups:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};


//get a specific startup using the ID 
export const GetSpecificStartup = async(req, res) => {
    try{
        const{ id } = req.params;
        const db = await connectDB()
        const collection = db.collection("Startup")
        const startup = await collection.findOne({ StartupID: id }).toArray();

        if(!startup){
            return res.status(404).json({
                success : false,
                message : "Startup not found"
            })
        }

        res.status(200).json({
            success : true,
            startup
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// Update the Founders array in a startup 
export const UpdateStartupFounders = async (req, res) => {
    try {
        const UserID = req.user.UserID; // Extract UserID from token
        const { id } = req.params;  // Extract StartupID from request
        const { Founders } = req.body; // Founders array

        // Validate Founders input
        if (!Founders || !Array.isArray(Founders)) {
            return res.status(400).json({ success: false, message: "Founders must be a valid array" });
        }

        // Connect to database
        const db = await connectDB();
        const collection = db.collection("Startup");

        // Find the startup by ID
        const startup = await collection.findOne({ StartupID: id });

        // Check if startup exists
        if (!startup) {
            return res.status(404).json({ success: false, message: "Startup not found" });
        }

        // Check if the logged-in user is the owner of the startup
        if (startup.UserID !== UserID) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this startup" });
        }

        // Update the Founders array
        const updatedStartup = await collection.findOneAndUpdate(
            { StartupID: id },
            { $set: { Founders } },
            { returnDocument: "after" } // Returns updated document
        );

        // Send success response
        res.status(200).json({ success: true, message: "Founders updated successfully", startup: updatedStartup });

    } catch (error) {
        console.error("Error updating founders:", error); // Log error for debugging
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};


//update the financial metrics object
export const UpdateFinancialMetrics = async (req, res) => {
    try {
        const UserID = req.user.UserID; // Extract UserID from token
        const { id } = req.params;  // Extract StartupID from request
        const { FinancialMetrics } = req.body; // FinancialMetrics object

        // Validate input format
        if (!FinancialMetrics || typeof FinancialMetrics !== "object") {
            return res.status(400).json({ success: false, message: "Invalid financial metrics format" });
        }

        // Connect to database
        const db = await connectDB();
        const collection = db.collection("Startup");

        // Find the startup by ID
        const startup = await collection.findOne({ StartupID: id });

        // Check if startup exists
        if (!startup) {
            return res.status(404).json({ success: false, message: "Startup not found" });
        }

        // Check if the logged-in user is the owner of the startup
        if (startup.UserID !== UserID) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this startup" });
        }

        // Validate Financial Metrics fields (Optional but recommended)
        const validMetrics = ["Revenue", "GrowthRate", "UserBase"];
        for (let key in FinancialMetrics) {
            if (!validMetrics.includes(key)) {
                return res.status(400).json({ success: false, message: `Invalid financial metric: ${key}` });
            }
        }

        // Update the Financial Metrics
        const updatedStartup = await collection.findOneAndUpdate(
            { StartupID: id },
            { $set: { FinancialMetrics } },
            { returnDocument: "after" } 
        );
        res.status(200).json({ success: true, message: "Financial metrics updated successfully", startup: updatedStartup });

    } catch (error) {
        console.error("Error updating financial metrics:", error); 
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};

// update the traction metrics
export const UpdateTractionMetrics = async (req, res) => {
    try {
        const UserID = req.user.UserID; 
        const { id } = req.params;  
        const { TractionMetrics } = req.body; 

        // Validate input format
        if (!TractionMetrics || typeof TractionMetrics !== "object") {
            return res.status(400).json({ success: false, message: "Invalid traction metrics format" });
        }

        // Connect to database
        const db = await connectDB();
        const collection = db.collection("Startup");

        // Find the startup by ID
        const startup = await collection.findOne({ StartupID: id });

        // Check if startup exists
        if (!startup) {
            return res.status(404).json({ success: false, message: "Startup not found" });
        }

        // Check if the logged-in user is the owner of the startup
        if (startup.UserID !== UserID) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this startup" });
        }

        // Validate allowed Traction Metrics fields
        const validMetrics = ["Customers", "FundingReceived", "MonthlyBurnRate"];
        for (let key in TractionMetrics) {
            if (!validMetrics.includes(key)) {
                return res.status(400).json({ success: false, message: `Invalid traction metric: ${key}` });
            }
        }

        // Update the Traction Metrics
        const updatedStartup = await collection.findOneAndUpdate(
            { StartupID: id },
            { $set: { TractionMetrics } },
            { returnDocument: "after" } // Returns updated document
        );

        // Send success response
        res.status(200).json({ success: true, message: "Traction metrics updated successfully", startup: updatedStartup });

    } catch (error) {
        console.error("Error updating traction metrics:", error); // Log error for debugging
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};

// Get all startups and update embeddings in batch
export const updateStartupEmbeddings = async (req, res) => {
    try {
        // Ensure the user has admin privileges
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized User. Admin Access Required!",
            });
        }

        // Connect to the database
        const db = await connectDB();
        const startupDetails = db.collection("Startup");

        // Fetch all startups
        const startups = await startupDetails.find({}).toArray();

        // Prepare bulk update operations
        const bulkOps = startups.map((startup) => {
            if (startup.Embedding && startup.Embedding.data) {
                // Convert object to array
                const embeddingArray = Object.values(startup.Embedding.data);

                return {
                    updateOne: {
                        filter: { _id: startup._id },
                        update: { $set: { "Embedding.data": embeddingArray } }
                    }
                };
            }
        }).filter(Boolean); // Remove any undefined values

        // Perform batch update if there are valid operations
        if (bulkOps.length > 0) {
            await startupDetails.bulkWrite(bulkOps);
            console.log("Successfully updated the startup embeddings into array objects")
        }

        // Response
        res.status(200).json({
            success: true,
            message: "Startup embeddings updated successfully in batch!",
        });

    } catch (error) {
        console.error("Error updating startup embeddings:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

