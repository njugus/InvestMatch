import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

//load the enviroment variables 
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
    try{
        //lets get the token
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]

        //chech whether the token exists or not
        if(!token){
            res.status(401).json({
                success : false,
                message : "Unauthorized User : No access token provided"
            })
        }
        //decode the token
        const decoded = jwt.verify(token, JWT_SECRET)

        //access the user details
        req.user = decoded
        //call the next ()
        next();

    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

export default authMiddleware;
