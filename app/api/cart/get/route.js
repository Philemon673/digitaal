import ConnectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ success: true, cart: {} });
    }

    return NextResponse.json({ success: true, cart: user.cartItem || {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
