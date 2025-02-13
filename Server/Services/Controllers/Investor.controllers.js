import Investor from '../../Models/Investor.model.js'
import authMiddleware from '../../Auth/authmiddleware.js'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//create an investor's profile
export const investorProfile = async(req, res) => {
    try{
        //destructure the details from the req.body
        const { Mission, Vision, Preferences } = req.body

        //get access to the token to generate UserID
        const UserID = req.user.UserID;

        //check whehter the fields exist
        if(!Name || !Mission || !Vision || !Preferences?.Industries || !Preferences?.FundingStages){
            return res.status(400).json({
                success :false,
                message : "Missing required fields"
            })
        }

        //create a new investor
        const newInvestor = new Investor({
            InvestorID : uuidv4(),
            UserID,
            Name,
            Mission,
            Vision,
            Preferences,
            InvestmentHistory : [],
        });

        //save the user to the database
        await newInvestor.save();

        //send a res to the client
        res.status(201).json({
            success : true,
            investor : newInvestor
        })

    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

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



