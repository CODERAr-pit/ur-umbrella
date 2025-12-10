// models/History.js
import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  
  items: [
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
    }
  ],
  
  amount: Number,
  
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }, 
    phone: { type: String, required: true }    
  },

  purchaseDate: { type: Date, default: Date.now },
  
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  
  deliveryDate: { type: String }
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);