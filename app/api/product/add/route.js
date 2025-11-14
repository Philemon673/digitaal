import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import ConnectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller";

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // ✅ Clerk authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Seller validation
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not Authorized" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    // ✅ Upload each image to Cloudinary (using Buffer directly)
    const uploadResults = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products", resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(buffer);
      });

      uploadResults.push(result);
    }

    // ✅ Extract URLs
    const images = uploadResults.map((r) => r.secure_url);
    console.log("✅ Uploaded images:", images);

    // ✅ Save to database
    await ConnectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: images, // ✅ this field should exist in your Product model
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      newProduct,
    });
  } catch (error) {
    console.error("❌ Error uploading product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
