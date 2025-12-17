// app/api/product/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DbConnect";
import Product from "@/models/product";

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});
        return NextResponse.json({ products: products, success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}