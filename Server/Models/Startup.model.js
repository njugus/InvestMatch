import mongoose from "mongoose";

const StartupSchema = new mongoose.Schema({
  StartupID: { type: String, required: true, unique: true }, // Unique identifier for startups
  UserID: { type: String, required: true },   // Foreign key referencing PostgreSQL Users
  Name: { type: String, required: true },
  Industry: { type: String, required: true },
  FundingStage: { type: String, required: true },   // Seed, Series A, etc.
  GeographicLocation: { type: String, required: false },    // Optional: country or region
  Founders: [
    {
      Name: { type: String, required: true },   // Founder name
      Role: { type: String, required: true },   // CEO, CTO, etc.
      LinkedIn: { type: String, required: false }   // Optional LinkedIn profile
    }
  ],
  FinancialMetrics: {
    Revenue: { type: Number, required: false },   // Revenue in USD or local currency
    GrowthRate: { type: Number, required: false },   // Growth percentage
    UserBase: { type: Number, required: false }    // Number of users/customers
  },
  TractionMetrics: {
    Customers: { type: Number, required: false },
    FundingReceived: { type: Number, required: false },
    MonthlyBurnRate: { type: Number, required: false }
  },
  PitchDeck: { type: String, required: false }, // URL or file path to the pitch deck
  Website: { type: String, required: false }, // Startup website
  ContactEmail: { type: String, required: false }, // Startup contact email
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now }
});

// Middleware to update `UpdatedAt` on document modification
StartupSchema.pre("save", function (next) {
  this.UpdatedAt = Date.now();
  next();
});

export default mongoose.model("Startup", StartupSchema);
