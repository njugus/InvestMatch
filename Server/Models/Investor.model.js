import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

//create a schema 
const InvestorSchema =  new mongoose.Schema({
    InvestorID: { type: String, required: true, unique: true },
    UserID: { type: String, required: true }, // Foreign key referencing PostgreSQL Users
    Name: { type: String, required: true },
    Mission: { type: String },
    Vision: { type: String },
    Preferences: {
      Industries: { type: [String], required: true },
      FundingStages: { type: [String], required: true },
      GeographicPreferences: { type: [String] },
    },
    InvestmentHistory: [
      {
        StartupID: { type: String }, // If startup exists on the platform
        TemporaryStartupID: { type: String }, // Auto-generated for unlisted startups
        StartupName: { type: String }, // If startup is unlisted
        Sector: { type: String }, // Startup’s sector
        Amount: { type: Number, required: true },
        Date: { type: Date, required: true, default: Date.now },
      },
    ],
})

export default mongoose.model("Investor", InvestorSchema)


