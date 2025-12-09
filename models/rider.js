import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    // Rider documents
    documents: {
      aadhar: { type: String, required: true }, // URL or number
      drivingLicense: { type: String, required: true },
      bikeRC: { type: String, required: true },
      photo: { type: String,required:false }, // profile image
    },

    // Location for live tracking
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      lastUpdated: { type: Date, default: Date.now },
    },

    // Rider status: online, offline, busy
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },

    // Currently assigned order
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // Completed order history
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // Whether rider is verified by admin
    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["rider"],
      default: "rider",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Rider ||
  mongoose.model("Rider", riderSchema);
