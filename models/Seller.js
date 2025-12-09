import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    shopDescription: {
      type: String,
      default: "",
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    gstNumber: {
      type: String,
      required: false, // optional for now
    },

    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// Avoid model overwrite error
const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
