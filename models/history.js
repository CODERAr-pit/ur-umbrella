import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  productId: { type: Schema.Types.ObjectId, ref: "Product" }, 
  quantity: Number,
  amount: Number,
  purchaseDate: Date,
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  deliveryDate:{
    type:String,
  }
});

export default mongoose.models.Product ||
mongoose.model("Product", productSchema);
