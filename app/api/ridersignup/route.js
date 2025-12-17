import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Rider from "@/models/rider"; // Capitalized model import is standard convention
import { dbConnect } from "@/lib/DbConnect";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // 1. Destructure exactly what the frontend sends
    const {
      name,
      email,
      password,
      phone,
      city,
      aadhar,
      drivingLicense,
      bikeRC,
      photo
    } = body;

    // Check if rider already exists
    const check = await Rider.findOne({ email });
    if (check) {
      return NextResponse.json(
        { msg: "Rider already exists, please login", success: false },
        { status: 400 }
      );
    }

    // Hash password
    const hashedpass = await bcrypt.hash(password, 10);

    // 2. Create rider document (Mapping flat frontend data to nested Schema)
    await Rider.create({
      name, // Matches Schema 'name'
      email,
      password: hashedpass,
      phone,
      city,
      documents: {
        aadhar,
        drivingLicense, // Matches Schema
        bikeRC,         // Matches Schema
        photo
      },
      // location, status, etc., will use Default values from Schema
    });

    return NextResponse.json(
      { msg: "Rider registered successfully", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Signup failed",
        error: err.message,
        success: false
      },
      { status: 500 }
    );
  }
}