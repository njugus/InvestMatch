import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = "your_secret_key";

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
            { UserID : newUser.UserID},
            JWT_SECRET,
            { expiresIn : "1h"}
        )

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
        const decoded = jwt.verify(userToken, JWT_SECRET)
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
        req.status(500).json({
            success : false,
            message : error.message
        })
    }
}

