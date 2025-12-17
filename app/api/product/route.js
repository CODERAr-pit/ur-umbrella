import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DbConnect";
import Product from "@/models/product";

// This handles GET /api/product
export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}