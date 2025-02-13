
import StartupModel from "../../Models/Startup.model";
import { v4 as uuidv4 } from "uuid";

// Create a new startup
export const CreateNewStartup = async (req, res) => {
    try {
        // Get the UserID from the authenticated user
        const UserID = req.user.UserID;

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
        const newStartup = new StartupModel({
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
        });

        // Save to database
        await newStartup.save();

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

//get all startups
export const AllStartups = async(req, res) => {
    try{
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}
