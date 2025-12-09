import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import rider from "@/models/rider";
import { dbConnect } from "@/lib/DbConnect";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      user,
      email,
      password,
      phone,
      documents: { aadhar, drivingL, bikerc, photo },
      location: { lat, lng, lstup },
      status,
      currentorder,
      orderhistory
    } = body;

    // Check if rider already exists
    const check = await rider.findOne({ email });
    if (check) {
      return NextResponse.json(
        { msg: "Rider already exists, please login" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedpass = await bcrypt.hash(password, 10);

    // Create rider document
    await rider.create({
      user,
      email,
      password: hashedpass,
      phone,
      documents: {
        aadhar,
        drivingL,
        bikerc,
        photo
      },
      location: {
        lat,
        lng,
        lstup
      },
      status: status || "offline",
      currentorder: currentorder || null,
      orderhistory: orderhistory || []
    });

    return NextResponse.json(
      { msg: "Rider registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        msg: "Signup failed",
        error: err.message
      },
      { status: 500 }
    );
  }
}
