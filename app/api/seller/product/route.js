import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import product from "@/models/product"; 
import { dbConnect } from "@/lib/DbConnect";

export async function GET(){
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        
        if(!session){
            return NextResponse.json({ msg:"Please Log In" }, { status: 202 });
        }
        
        if(session.user.role === "customer"){
            return NextResponse.json({ msg:"Invalid Request" }, { status: 203 });
        }

        const myID = session.user._id;
        const products = await product.find({ seller: myID })
                                      .sort({ createdAt: -1 }); 

        return NextResponse.json({
            msg: "Products Fetched Successfully",
            data: products
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
    }
}