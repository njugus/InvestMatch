
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
export const GetAllStartups = async(req, res)=> {
    try{
        //extract the query parameters  from the request
        const { industry, fundingStage, location, sortBy, order, page, limit } = req.query;

        //create a filter object
        const filters = {}
        if(industry) filters.Industry = industry
        if(fundingStage) filters.FundingStage = fundingStage
        if(location) filters.Location = location

        //sortby
        const sortingOptions = {}
        if(sortBy){
            sortingOptions[sortBy] = order === "asc" ? 1 : -1;
        }

        //setup pagination
        const pageNum = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNum - 1) * pageSize;

        //fetch the data using the filtering, sortBy and with pagination
        const startups = await StartupModel.find(filters).sort(sortingOptions).skip(skip).limit(pageSize).lean()
        const totalCount = await StartupModel.countDocuments(filters)

        //return the total number of filtered results to the frontend for pagination purposes
        res.status(200).json({
            success : true,
            pageNum,
            pageSize,
            totalStartups : totalCount,
            startups
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


//get a specific startup using the ID 
export const GetSpecificStartup = async(req, res) => {
    try{
        const{ id } = req.params;
        const startup = await StartupModel.findOne({ StartupID: id }).lean();

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

// update the founders array
export const UpdateStartupFounders = async (req, res) => {
    try {
        const { id } = req.params;  // StartupID
        const { Founders } = req.body; // Array of founders

        if (!Founders || !Array.isArray(Founders)) {
            return res.status(400).json({ success: false, message: "Founders should be an array" });
        }

        const updatedStartup = await StartupModel.findOneAndUpdate(
            { StartupID: id },
            { $set: { Founders } },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedStartup) {
            return res.status(404).json({ success: false, message: "Startup not found" });
        }

        res.status(200).json({ success: true, startup: updatedStartup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//update the financial metrics object
export const UpdateFinancialMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const { FinancialMetrics } = req.body;

        if (!FinancialMetrics || typeof FinancialMetrics !== "object") {
            return res.status(400).json({ success: false, message: "Invalid financial metrics format" });
        }

        const updatedStartup = await StartupModel.findOneAndUpdate(
            { StartupID: id },
            { $set: { FinancialMetrics } },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedStartup) {
            return res.status(404).json({ success: false, message: "Startup not found" });
        }

        res.status(200).json({ success: true, startup: updatedStartup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




