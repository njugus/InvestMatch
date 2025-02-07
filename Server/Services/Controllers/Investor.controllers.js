import Investor from '../../Models/Investor.model.js'
import authMiddleware from '../../Auth/authmiddleware.js'
import { v4 as uuidv4 } from 'uuid'

//create an investor's profile
export const investorProfile = async(req, res) => {
    try{
        //destructure the details from the req.body
        const { Name, Mission, Vision, Preferences } = req.body

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


//get a specific investor based on ID





