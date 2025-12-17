import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  
  items: [
    {
        // Changed to allow flexible object storage if needed, or keep strictly as Product ID
        productId: { type: String }, // specific ID or Object
        quantity: Number,
        name: String, 
        price: Number
    }
  ],
  
  amount: Number,
  
  address: {
    // 1. Existing fields (Made optional so GPS checkout doesn't crash)
    street: { type: String, default: "GPS Location" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" }, 
    phone: { type: String, default: "" },
    
    // 2. NEW FIELDS FOR TRACKING
    lat: { type: Number }, 
    lng: { type: Number }
  },

  purchaseDate: { type: Date, default: Date.now },
  
  // Updated status enum to include Tracking stages
  status: {
    type: String,
    enum: ["Order Placed", "Processing", "Out for Delivery", "pending", "completed", "cancelled"],
    default: "Order Placed",
  },
  
  deliveryDate: { type: String }
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);