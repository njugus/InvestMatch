
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log(`MongoDB Connected: ${client.s.options.srvHost}`);
        return client.db("InvestMatch"); // Explicitly return the correct database

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export { connectDB, client };
