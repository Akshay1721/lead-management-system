import mongoose from "mongoose";

const SOURCES = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
const STATUSES = ["new", "contacted", "qualified", "lost", "won"];

// Export ENUMS for use in seedLeads.js
export const ENUMS = {
  SOURCES,
  STATUSES
};

const leadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  first_name: { type: String, trim: true },
  last_name: { type: String, trim: true },
  email: { type: String, trim: true, required: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  source: { type: String, enum: SOURCES, required: true },
  status: { type: String, enum: STATUSES, required: true, default: "new" },
  score: { type: Number, min: 0, max: 100, default: 0 },
  lead_value: { type: Number, default: 0 },
  last_activity_at: { type: Date, default: null },
  is_qualified: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// unique per user
leadSchema.index({ user: 1, email: 1 }, { unique: true });

export default mongoose.model("Lead", leadSchema);