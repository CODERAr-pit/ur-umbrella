import { dbConnect } from "@/lib/DbConnect";
import Seller from "@/models/Seller";
import { NextResponse } from "next/server";
import User from "@/models/User";
import product from "@/models/product";
import history from "@/models/history";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
/* 203:-product notfound(id),202:quantity not much(id),200:ok(order_id),401: for unauthenticated*/ 


export async function POST(request){
   const session = await getServerSession(authOptions);
   if(!session||!session.user){
    return NextResponse.json({msg:"Please Login First"},{status:401});
   }
   const userID = session.user._id;
   try{ await dbConnect();
    const body=await request.json();
    const {shopID,items=[],amount}= body;
    
    for(let item of items){
        const product = await product.findById(item._id);
        if(!product){
            return NextResponse.json({msg:"Product Not Found ",item:item._id},{status:203});
        }
  
        if(product.stock<item.quantity){
            return NextResponse.json({msg:`Please Enter Valid Quantity for ${item._id}`},{status:202});
        }

    }
    const user=await User.findOne({"_id":userID});
    const productpurchased=[];
    for(let item of items){
       const newproduct = await product.findById(item._id);
        newproduct.stock=newproduct.stock-item.quantity;
        await newproduct.save();
        productpurchased.push({
            objId:item._id,
            quantity:item.quantity
        })
    }
        const hisid=await history.create({
            "userId":userID,
            "sellerId":shopID,
            "product":productpurchased,
            "amount":amount,
            "address": {
            street: user.address.street,
            city: user.address.city,
            state: user.address.state,
            pincode: user.address.pincode,
            phone: user.phone
    },
            "purchaseDate":new Date(),
            "deliveryDate":' '
        })
        user.history.push(hisid);
        await user.save();
        return NextResponse.json({msg:"Order Placed Succesfully",order_id:hisid},{status:200});
    }
   catch(err){
        return NextResponse.json({msg:err});
   }
}
/*userId: { type: Schema.Types.ObjectId, ref: "User" },
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
  }*/