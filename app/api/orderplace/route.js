import { dbConnect } from "@/lib/DbConnect"; 
import Seller from "@/models/Seller";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Product from "@/models/product"; 
import History from "@/models/history"; 
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request){
    const session = await getServerSession(authOptions);
    
    if(!session || !session.user){
        return NextResponse.json({msg:"Please Login First"},{status:401});
    }

    const userID = session.user._id;

    try { 
        await dbConnect();
        const body = await request.json();
        
        // REMOVED 'shopID' from here. We will find it automatically.
        const { items=[], amount, address } = body; 
        
        // Variable to store the seller we find
        let detectedSellerId = null;

        // --- 1. Validation & Seller Extraction Loop ---
        for(let item of items){
            const product = await Product.findById(item._id);
            
            if(!product){
                return NextResponse.json({msg:"Product Not Found ",item:item._id},{status:203});
            }
            if(product.stock < item.quantity){
                return NextResponse.json({msg:`Please Enter Valid Quantity for ${product.name}`},{status:202});
            }

            // EXTRACT SELLER ID HERE
            // If we haven't found a seller yet, grab it from this product
            if (!detectedSellerId && product.sellerId) {
                detectedSellerId = product.sellerId;
            }
        }

        // --- 2. Update Stock & Prepare Items ---
        const user = await User.findOne({ "_id": userID });
        const productPurchased = [];

        for(let item of items){
            const newproduct = await Product.findById(item._id);
            newproduct.stock = newproduct.stock - item.quantity;
            await newproduct.save();

            productPurchased.push({
                productId: item._id, 
                quantity: item.quantity
            });
        }

        // --- 3. Create History with Real Seller ID ---
        const newHistory = await History.create({
            userId: userID,
            
            // ✅ USE THE EXTRACTED ID
            // If no sellerId found on product, it stays null (prevents crash)
            sellerId: detectedSellerId, 
            
            items: productPurchased, 
            amount: amount,
            address: {
                lat: address?.lat || 0,
                lng: address?.lng || 0,
                street: address?.lat ? "GPS Location" : (user.address?.street || ""),
                city: user.address?.city || "Detected Location",
                state: user.address?.state || "",
                pincode: user.address?.pincode || "",
                phone: user.phone || ""
            },
            status: "Order Placed",
            purchaseDate: new Date(),
            deliveryDate: '' 
        });

        user.history.push(newHistory._id);
        await user.save();
        
        return NextResponse.json({
            msg: "Order Placed Successfully", 
            order_id: newHistory._id,
            success: true 
        }, {status:200});

    } catch(err) {
        console.error("Order Place Error:", err);
        return NextResponse.json({ msg: err.message, success: false }, { status: 500 });
    }
}