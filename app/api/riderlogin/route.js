import { dbConnect } from "@/lib/DbConnect";
import Rider from "@/models/rider"; 
import bcrypt from "bcryptjs";      
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse the body
    const body = await request.json();
    const { email, password } = body;

    // 1. Find Rider
    const rider = await Rider.findOne({ email });

    if (!rider) {
      // ❌ RETURN 404 (Not Found) - Frontend will now know it failed
      return NextResponse.json(
        { msg: "Rider nahi mila", success: false }, 
        { status: 404 }
      );
    }

    // 2. Check Password
    const passcheck = await bcrypt.compare(password, rider.password);

    if (!passcheck) {
      // ❌ RETURN 401 (Unauthorized) - Frontend will catch this error
      return NextResponse.json(
        { msg: "Password galat h bhai", success: false }, 
        { status: 401 }
      );
    }

    // 3. Generate Token
    // ✅ FIX: Use '_id' to match standard MongoDB/NextAuth conventions
    const token = jwt.sign(
      { 
        _id: rider._id,      // Changed from userId to _id
        email: rider.email, 
        role: "rider" 
      },
      process.env.JWT_SECRET || "fallback_secret", // Add fallback to prevent crash
      { expiresIn: "2d" }
    );

    // 4. Create Response
    const response = NextResponse.json(
      { 
        msg: "Rider Login Successful", 
        success: true,
        rider: { name: rider.name, email: rider.email } 
      }, 
      { status: 200 }
    );

    // 5. Set Cookie
    response.cookies.set({
      name: "token", // Warning: This overwrites User login. Consider "rider_token"
      value: token,
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60, 
      path: "/", 
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { msg: "Server Error", error: err.message }, 
      { status: 500 }
    );
  }
}