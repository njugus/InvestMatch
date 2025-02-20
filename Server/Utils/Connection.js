import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        console.log(`MongoDB Connected: ${client.s.options.srvHost}`);

        return client.db(); // Return the connected database instance
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process if connection fails
    }
};

export default connectDB;
