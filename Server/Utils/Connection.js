import mongoose from 'mongoose'
import dotenv from 'dotenv'

//load the enviroment variables from the dotenv file
dotenv.config()

//access the URI
const URI = process.env.MONGO_URI;

//establish a connection
(
    async() => {
        try{
            await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connection Successfull")
        }catch(err){
            console.log("Connection Failed: ", err.message);  
        }
    }
)();