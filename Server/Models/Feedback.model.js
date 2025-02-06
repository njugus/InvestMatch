import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  FeedbackID: { type: String, required: true, unique: true }, // Unique Feedback ID
  InvestorID: { type: String, required: true }, // Reference to Investor providing feedback
  StartupID: { type: String, required: false }, // Reference to matched Startup (if relevant)
  RecommendationID: { type: String, required: false }, // Reference to AI suggestion (if relevant)
  MatchID: { type: String, required: false }, // Reference to a finalized match (if relevant)
  Rating: { type: Number, min: 1, max: 5, required: false }, // 1-5 Star Rating
  Comments: { type: String, required: false }, // Optional additional feedback
  CreatedAt: { type: Date, default: Date.now } // Timestamp for feedback entry
});

export default mongoose.model("Feedback", FeedbackSchema);
