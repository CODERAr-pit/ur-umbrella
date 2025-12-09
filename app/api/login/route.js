import { dbConnect } from "@/lib/DbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    const user = await User.findOne({ email });

    if (user) {
      const passcheck = await bcrypt.compare(password, user.password);

      if (passcheck) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );

        const response = NextResponse.json({ msg: "Login Ho Gya" }, { status: 200 });

        //  HTTP-only cookie
        response.cookies.set({
          name: "token",
          value: token,
          httpOnly: true,
          maxAge: 2 * 24 * 60 * 60, // 2 days in seconds
          path: "/", 
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        return response;
      } else {
        return NextResponse.json({ msg: "Password galat h bhai" }, { status: 202 });
      }
    } else {
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({ msg: "Error Aa Gyi bhai" }, { status: 404 });
  }
}
