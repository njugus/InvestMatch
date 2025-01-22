import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

//Sign Up
export const signUp = async(req, res) => {
    const{ first_name, last_name, Email, PasswordHash} = req.body
    const hashedPassword = await bcrypt.hash(PasswordHash, 10)
    try{
        const result = await prisma.user.create({
            data : {
                first_name : first_name,
                last_name : last_name,
                Email : Email,
                PasswordHash : hashedPassword,
            }
    })

    res.status(201).json({success : true, message : "Record Created Successfully", record : result})
    }catch(error){
        res.status(500).json({ success : false, message : error.message})
    }
}

//Select Role 


