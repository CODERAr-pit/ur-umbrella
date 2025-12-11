import { dbConnect } from "@/lib/DbConnect";
import User from "@/models/User";
import Seller from "@/models/Seller"; // Import the Seller model
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { user, email, password, phone, address, role } = body;

    if (!address) {
      return NextResponse.json({ msg: "Address is missing" }, { status: 400 });
    }
    const { street, city, state, pincode } = address;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "seller") {
      const checkSeller = await Seller.findOne({ email });
      if (checkSeller) {
        return NextResponse.json({ msg: "Seller already exists" }, { status: 400 });
      }

      await Seller.create({
        name: user,          
        shopName: body.shopName,
        email,
        password: hashedPassword,
        phone,
        address: { street, city, state, pincode },
        role: "seller"
      });
      
    // -----------------------------------------------------
    // 👤 CASE 2: CUSTOMER / RIDER SIGNUP
    // -----------------------------------------------------
    } else {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return NextResponse.json({ msg: "User already exists" }, { status: 400 });
      }

      await User.create({
        user, // User schema uses 'user', so this is fine
        email,
        password: hashedPassword,
        phone,
        address: { street, city, state, pincode },
        role: role || "customer"
      });
    }

    return NextResponse.json({ msg: "Saved Successfully" }, { status: 200 });

  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json({ 
      msg: "Signup Failed", 
      error: err.message 
    }, { status: 500 });
  }
}