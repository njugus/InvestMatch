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



// import { MongoClient } from "mongodb";
// import dotenv from 'dotenv'

// dotenv.config()

// const uri = process.env.MONGO_URI;

// if (!uri) {
//     throw new Error("MongoDB URI is undefined. Check your .env file.");
//   }
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// let dbInstance; // Store the database instance globally

// const connectDB = async () => {
//     if (!dbInstance) { // Ensure we connect only once
//         try {
//             await client.connect();
//             console.log(` MongoDB Connected: ${client.s.options.srvHost}`);
//             dbInstance = client.db("InvestMatch"); // Store the database instance
//         } catch (error) {
//             console.error(`Database Connection Error: ${error.message}`);
//             process.exit(1);
//         }
//     }
//     return dbInstance; // Return the stored database instance
// };

// export { connectDB, client };





// import dotenv from "dotenv";
// dotenv.config();
// import { MongoClient } from "mongodb";

// let dbInstance = null; // Cache the database connection

// export const connectDB = async () => {
//   if (dbInstance) return dbInstance; // Return cached connection

//   const uri = process.env.MONGO_URI;
//   if (!uri) {
//     throw new Error("MongoDB URI is undefined. Check your .env file.");
//   }

//   const client = new MongoClient(uri);
//   await client.connect();

//   console.log("Database connected successfully.");
//   dbInstance = client.db()// Save the database connection
//   console.log(dbInstance)
//   return dbInstance;
// };
