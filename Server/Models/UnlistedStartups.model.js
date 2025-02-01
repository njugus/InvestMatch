// unlisted startups
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UnlistedStartupSchema = new mongoose.Schema({
  TemporaryStartupID: {
    type: String,
    required: true,
    unique: true,
    default: () => `EXT-${uuidv4()}`
  },
  Name: { type: String, required: true },
  Industry: { type: String },
  Founder: { type: String },
  Description: { type: String },
  Country: { type: String },
  CreatedByInvestorID: { type: String, required: true }
});

export default mongoose.model("UnlistedStartup", UnlistedStartupSchema);
