const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    company: {
      type: String,
      trim: true,
      default: ""
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "LinkedIn",
        "Email",
        "Cold Call",
        "Other"
      ],
      default: "Other"
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal",
        "Won",
        "Lost"
      ],
      default: "New"
    },

    value: {
      type: Number,
      default: 0,
      min: 0
    },

    notes: {
      type: String,
      trim: true,
      default: ""
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({
  workspaceId: 1,
  createdAt: -1
});

module.exports = mongoose.model("Lead", leadSchema);


