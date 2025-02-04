import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema({
  RecommendationID: { type: String, required: true, unique: true }, // Unique ID
  InvestorID: { type: String, required: true }, // Foreign key to Investor
  StartupID: { type: String, required: false }, // If startup is in the system
  TemporaryStartupID: { type: String, required: false }, // If startup is unlisted
  MatchScore: { type: Number, required: true, min: 0, max: 1 }, // AI-generated match score
  Status: {
    type: String,
    enum: ["Suggested", "Viewed", "Saved", "Ignored"],
    default: "Suggested"
  }, // Investor actions
  CreatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Recommendation", RecommendationSchema);
