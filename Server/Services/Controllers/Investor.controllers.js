import Investor from '../../Models/Investor.model.js'
import authMiddleware from '../../Auth/authmiddleware.js'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'
import { connectDB } from '../../Utils/Connection.js'


const prisma = new PrismaClient()

//create an investor's profile
export const investorProfile = async (req, res) => {
    try {
        // Destructure details from req.body
        const { Mission, Vision, Preferences } = req.body;

        // Get access to the token to generate UserID
        const UserID = req.user?.UserID;

        // Validate required fields
        if (!Mission || !Vision || !Preferences?.Industries || !Preferences?.FundingStages) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Set up the database connection
        const db = await connectDB();
        const investorsCollection = db.collection("Investor");

        // Check if the investor profile already exists
        const existingInvestor = await investorsCollection.findOne({ UserID });
        if (existingInvestor) {
            return res.status(400).json({
                success: false,
                message: "Investor profile already exists for this user.",
            });
        }

        // Create a new investor profile
        const newInvestor = {
            InvestorID: uuidv4(),
            UserID,
            Mission,
            Vision,
            Preferences,
            InvestmentHistory: [],
            createdAt: new Date(),
        };

        // Save the investor to the database
        const result = await investorsCollection.insertOne(newInvestor);

        if (!result.acknowledged) {
            return res.status(500).json({
                success: false,
                message: "Failed to create investor profile.",
            });
        }

        // Send response to the client
        res.status(201).json({
            success: true,
            investor: newInvestor,
        });

    } catch (error) {
        console.error("Error creating investor profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
// Get all investors
export const getAllInvestors = async (req, res) => {
    try {
        // Ensure the user exists and has admin privileges
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized User. Admin Access Required!",
            });
        }

        // Connect to the database (assuming a global connection is available)
        const db = await connectDB();
        const investorDetails = db.collection("Investor");

        // Fetch investors while omitting sensitive fields (e.g., password)
        const investors = await investorDetails.find({})
            .project({ password: 0 }) // Exclude sensitive fields
            .toArray(); // Convert cursor to an array

        // Response
        res.status(200).json({
            success: true,
            registeredInvestors: investors,
        });

    } catch (error) {
        console.error("Error fetching investors:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

// Get investor details by ID
export const getInvestorByID = async (req, res) => {
    try {
        // Destructure and validate ID
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Investor ID is required" });
        }

        // Connect to MongoDB
        const db = await connectDB();
        const collection = db.collection("Investor");

        // Fetch investor from PostgreSQL first
        const investor = await prisma.user.findUnique({
            where: { UserID: id }, // Fetch from PostgreSQL
            select: {
                first_name: true,
                last_name: true,
                Email: true,
                Role: true,
            },
        });

        // If investor is not found in PostgreSQL, no need to query MongoDB
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: "Investor not found in PostgreSQL",
            });
        }

        // Fetch investor profile from MongoDB in parallel
        const investorProfile = await collection.findOne({ UserID: id });

        if (!investorProfile) {
            return res.status(404).json({
                success: false,
                message: "Investor profile details not found in MongoDB",
            });
        }

        // Merge details
        const fullInvestorProfile = { ...investor, ...investorProfile };

        // Return response
        res.status(200).json({
            success: true,
            result: fullInvestorProfile,
        });
    } catch (error) {
        console.error("Error fetching investor details:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

//get the profile data only of a specific investor
export const getProfileData = async(req, res) => {
    try{
        //destructure the Id
        const { id } = req.params;

        //query the details
        // const profileData = await Investor.findOne({ InvestorID : id});
        // Connect to MongoDB
        const db = await connectDB();
        const collection = db.collection("Investor");
        const profileData = await collection.findOne({ InvestorID : id})

        if(!profileData){
            return res.status(404).json({
                success : false,
                message : "Investor Profile details not found"
            })
        }

        res.status(200).json({
            success : true,
            result : profileData
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}



// Get the investment history of a specific investor
export const getUserInvestment = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Investor ID is required.",
            });
        }

        // Connect to MongoDB
        const db = await connectDB();
        const collection = db.collection("Investor");

        // Fetch only the InvestmentHistory field for the given InvestorID
        const investor = await collection.findOne(
            { InvestorID: id },
            { projection: { InvestmentHistory: 1, _id: 0 } } // Return only InvestmentHistory field
        );

        // Check if the investor exists and has an investment history
        if (!investor || !investor.InvestmentHistory?.length) {
            return res.status(404).json({
                success: false,
                message: "No investments found for this investor.",
            });
        }

        // Return investment history
        res.status(200).json({
            success: true,
            investments: investor.InvestmentHistory,
        });

    } catch (error) {
        console.error("Error fetching user investments:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};


//update the investors list
export const updateUsersInvestments = async(req, res) => {
    try{
        const UserID = req.user.UserID; 
        const { id } = req.params;  
        const { InvestmentHistory } = req.body;

        //check whether the Investments array is an array
        if (!InvestmentHistory || !Array.isArray(InvestmentHistory)) {
            return res.status(400).json({ success: false, message: "Investment history must be a valid array" });
        }

        // Connect to database
        const db = await connectDB();
        const collection = db.collection("Investor");

        // Find the investor by ID
        const investor = await collection.findOne({ InvestorID: id });

        //if investor does not exist
        if (!investor) {
            return res.status(404).json({ success: false, message: "Investor not found" });
        }

        //verify whether the person who wants to update the investment history has a token and is the owner of the profile     
        if (investor.UserID !== UserID) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not own this investor account" });
        }

        const updatedInvestmentHistory = await collection.findOneAndUpdate(
            { InvestorID: id },
            { $set: { InvestmentHistory } },
            { returnDocument: "after" } // Returns updated document
        );

        // Send success response
        res.status(200).json({ success: true, message: "InvestmentHistory updated successfully", result: updatedInvestmentHistory });

    }catch(error){
        console.error("Error Updating investor's investment history: ", error.message)
        res.status(500).json({
            success : false,
            message : "Server Error..Please try again later"
        })
    }
}

// Get all investors and update embeddings in batch
export const updateInvestorEmbeddings = async (req, res) => {
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
        const investorDetails = db.collection("Investor");

        // Fetch all investors
        const investors = await investorDetails.find({}).toArray();

        // Prepare bulk update operations
        const bulkOps = investors.map((investor) => {
            if (investor.Embedding && investor.Embedding.data) {
                // Convert object to array
                const embeddingArray = Object.values(investor.Embedding.data);

                return {
                    updateOne: {
                        filter: { _id: investor._id },
                        update: { $set: { "Embedding.data": embeddingArray } }
                    }
                };
            }
        }).filter(Boolean); // Remove any undefined values

        // Perform batch update if there are valid operations
        if (bulkOps.length > 0) {
            await investorDetails.bulkWrite(bulkOps);
            console.log("Successfully updated investors embeddings")
        }

        // Response
        res.status(200).json({
            success: true,
            message: "Investor embeddings updated successfully in batch!",
        });

    } catch (error) {
        console.error("Error updating investor embeddings:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

