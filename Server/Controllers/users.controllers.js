import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT = process.env.JWT_SECRET

const prisma = new PrismaClient()
// const JWT_SECRET = "jdjdjjksksjsjsjs";

//signUp
export const signUp = async(req, res) =>  {
    const { first_name, last_name, Email, PasswordHash } = req.body;
    
    try{
        //make sure that all fields have been provided
        if(!first_name || !last_name | !Email || !PasswordHash){
            return res.status(400).json({
                success : false,
                message : "All required fields must be provided"
            })
        }

        //make sure email is unique so look for a user with the same email 
        const existingUser = await prisma.user.findUnique({
            where: { Email },
        })
        
        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "Email arleady exists"
            })
        }
        //hash the password
        const hashedPassword = await bcrypt.hash(PasswordHash, 10)

        //now register the user
        const newUser = await prisma.user.create({
            data : {
                first_name,
                last_name,
                Email,
                PasswordHash: hashedPassword,
            },
        })
        
        //create the token
        const token = jwt.sign(
            { 
                UserID: newUser.UserID, 
                first_name: newUser.first_name 
            },
            JWT, 
            { expiresIn: "1h" } 
        );
        
        //send the token inside the response to the client
        res.status(201).json({
            success : true,
            message : "User Registration Successfull", token,
            record : newUser
        })

    }catch(error){
        res.status(500).json({ success : false, message : error.message})
    }
}

//user roles
export const userRole = async(req, res) => {
    const { Role } = req.body;
    const authHeader = req.headers.authorization; //extract the token from the req.header
    try{
        //ensure the token is present
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success : false,
                message : "Unauthorized: No Token Provided"
            })
        }

        //extract and verify the token(the token will also be decoded)
        
        const userToken = authHeader.split(" ")[1]
        console.log(userToken + " " + JWT)
        const decoded = jwt.verify(userToken, JWT)
        const UserID = decoded.UserID
       
        //verify that the roles entered by the user are correct
        const validRoles = ["Investor", "Startup", "Admin"]
        if(!validRoles.includes(Role)){
            return res.status(400).json({
                success : false,
                message: `Invalid role. Valid roles are: ${validRoles.join(", ")}.`
            })
        }

        //update the role
        const newUserRole  = await prisma.user.update({
            where : { UserID},
            data : { Role},
        })

        res.status(200).json({
            success : true,
            message : "Role updated successfully",
            record : newUserRole
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

export const FindAllRegisteredUsers = async (req, res) => {
    try {
        const allRegisteredUsers = await prisma.user.findMany({
            select: {
                UserID: true,
                Username: true,
                Email: true,
                Role: true,
                createdAt: true,
            },
            take: 100, // Limits results to 100 users
        });

        if (allRegisteredUsers.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No registered users found.",
                users: [],
            });
        }

        res.status(200).json({
            success: true,
            users: allRegisteredUsers,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
