import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;


