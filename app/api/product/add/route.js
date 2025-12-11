import { dbConnect } from "@/lib/DbConnect";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Product from "@/models/product"; // Ensure your model file is named 'product.js' or 'Product.js'

export async function POST(req){
    try {
        await dbConnect();
        const data = await req.json();
        
        const {
            name,
            price,
            description,
            category,
            stock,
            images = []
        } = data;

        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ msg: "Please Log In" }, { status: 401 });
        }
        
        if (session.user.role === "customer") {
            return NextResponse.json({ msg: "Invalid Request: Must be a Seller" }, { status: 403 });
        }

        const sellerId = session.user._id;

        const newProduct = await Product.create({
             name,
             description,
             price,
             category,
             stock,
             images,
             seller: sellerId
        });

        return NextResponse.json({ 
            msg: "New Product Added Successfully", 
            productId: newProduct._id 
        }, { status: 200 });

    } catch (error) {
        console.error("Product Add Error:", error); // <--- CHECK YOUR TERMINAL FOR THIS
        return NextResponse.json({ 
            msg: "Product Upload Failed", 
            error: error.message 
        }, { status: 500 }); // <--- Returns Error to Frontend
    }
}