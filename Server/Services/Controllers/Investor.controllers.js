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

//get all investors
export const getAllInvestors = async(req, res) => {
    try{

        //check whether the req.user exists
        if(!req.user || req.user.Role !== "Admin"){
            return res.status(403).json({
                success : false,
                message : "Unauthorized User.Requires Admin Access!!"
            })
        }
        //if the person is an admin then proceed
        //lean() for performance optimization
        const investors = await Investor.find().lean()

        //response
        res.status(200).json({
            success : true,
            registeredInvestors : investors
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


//get all details of specific investor based on ID
export const getInvestorByID = async(req, res) => {
    try{
        //destructure the id from req.params
        const { id } = req.params

        //query the MongoDB server and the PostGRE database at the same time
        const[investor, investorProfile] = await Promise.all([
            prisma.user.findUnique({
                where : { UserID : id }, //get the user from Postgre Database
                select : { first_name, last_name, Email, Role },
            }),
            Investor.findOne({UserID : id}).lean() //get the user from the MongoDB database
        ])

        if(!investor){
            return res.status(404).json({
                success : false,
                message : "Investor Not Found"
            })
        }

        if(!investorProfile){
            return res.status(404).json({
                success : false,
                message : "Investor Profile Details not found"
            })
        }

        //merge the details gathered
        const fullInvestorProfile = { ...investor, ...investorProfile }

        //return the response to the client
        res.status(200).json({
            success : true,
            result : fullInvestorProfile
        })

    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


//get the profile data only of a specific investor
export const getProfileData = async(req, res) => {
    try{
        //destructure the Id
        const { id } = req.params;

        //query the details
        const profileData = await Investor.findOne({ InvestorID : id});

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

//get the investment history
export const getUserInvestment = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch investor with only the InvestmentHistory field
        const investor = await Investor.findOne({ InvestorID: id }, "InvestmentHistory").lean();

        // Check if the investor exists
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: "Investor not found"
            });
        }

        // Check if investments exist
        if (!investor.InvestmentHistory?.length) {
            return res.status(404).json({
                success: false,
                message: "No investments found"
            });
        }

        res.status(200).json({
            success: true,
            investments: investor.InvestmentHistory
        });

    } catch (error) {
        console.error("Error fetching user investments:", error); // Useful for debugging
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};



