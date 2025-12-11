import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; // Import your config file

export async function POST(request) {
  try {
    // 1. Get the form data from the request
    const data = await request.formData();
    const file = data.get("image"); // "image" is the key we will send from frontend

    if (!file) {
      return NextResponse.json({ msg: "No image found" }, { status: 400 });
    }

    // 2. Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudinary
    // Cloudinary expects a file path or a base64 string.
    // We will convert the buffer to a base64 data URI.
    
    /* Note: If you are uploading large videos, you might need streams.
       For images, this approach is simple and works well.
    */
    
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "Ecommerce_uploads", // Optional: Organize in a folder
      resource_type: "auto",
    });

    // 4. Return the Secure URL to the frontend
    return NextResponse.json({ 
        msg: "Image Uploaded Successfully", 
        imgUrl: uploadResponse.secure_url 
    }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ msg: "Upload Failed", error: error.message }, { status: 500 });
  }
}