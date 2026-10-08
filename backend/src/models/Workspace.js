const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    plan: {
      type: String,
      enum: ["FREE", "BUSINESS", "PRO"],
      default: "FREE"
    }
  },
  {
    timestamps: true
  }
);

workspaceSchema.index({ ownerId: 1 });

module.exports = mongoose.model("Workspace", workspaceSchema);
