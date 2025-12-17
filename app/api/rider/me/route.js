import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Rider from "@/models/rider"; 
import { dbConnect } from "@/lib/DbConnect";

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Get the token from the cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, msg: "No token found" }, { status: 401 });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get fresh data from DB
    const rider = await Rider.findById(decoded._id || decoded.userId).select("-password");

    if (!rider) {
      return NextResponse.json({ success: false, msg: "Rider not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: rider 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, msg: "Invalid Token" }, { status: 401 });
  }
}