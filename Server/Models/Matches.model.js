import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  MatchID: { type: String, required: true, unique: true }, // Unique Match identifier
  InvestorID: { type: String, required: true }, // Foreign key referencing Investor
  StartupID: { type: String, required: false }, // If startup is listed on the platform
  TemporaryStartupID: { type: String, required: false }, // If startup is unlisted
  MatchScore: { type: Number, required: true, min: 0, max: 1 }, // Compatibility Score (0-1)
  InteractionHistory: [
    {
      Action: { type: String, required: true }, // e.g., "Viewed", "Saved", "Contacted"
      Timestamp: { type: Date, default: Date.now }
    }
  ],
  Feedback: { type: String }, // Investor feedback on the match
  Status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },
  CreatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Match", MatchSchema);


