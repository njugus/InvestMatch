import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

//load the enviroment variables 
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
    try{
        //lets get the token
        const token = access_token.token

        //chech whether the token exists or not
        if(!token){
            res.status(401).json({
                success : false,
                message : "Unauthorized User"
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
