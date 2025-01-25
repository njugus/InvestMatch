import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET;

//login controller
export const Login = async (req, res) => {
    const { Email, PasswordHash } = req.body;

    try {
        // Ensure Email and PasswordHash are provided in the request body
        if (!Email || !PasswordHash) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { Email },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials.",
            });
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(PasswordHash, user.PasswordHash);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials.",
            });
        }

        // Create the payload for the JWT, which includes essential user data
        const payload = {
            UserID: user.UserID,
            Username: user.Username || "", // Optional, if user has a Username
            first_name: user.first_name,
            last_name: user.last_name,
            Role: user.Role,
        };

        // Generate the JWT token with expiration (e.g., 1 hour)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        // Set the JWT token in an HttpOnly cookie to secure it from JS access
        res.cookie("access_token", token, {
            httpOnly: true, // Protect cookie from being accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // Enable cookie security only in production
            sameSite: "Strict", // Prevent cross-site request forgery
            maxAge: 3600000, // Optional: Define a max age (1 hour in ms) for the cookie
        });

        // Respond with success and user data (optionally include the token for frontend use)
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                UserID: user.UserID,
                Username: user.Username,
                first_name: user.first_name,
                last_name: user.last_name,
                Role: user.Role,
            },
            token, // You can return the token here or store it in the HttpOnly cookie for client use
        });
        
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
};