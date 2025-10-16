// app/api/syncUser/route.js (Next.js 13+ App Router)
import { auth } from "@clerk/nextjs/server";
import ConnectDB from "@/config/db";
import User from "@/models/user"

export async function POST() {
  try {
    const { userId, sessionId, getToken } = auth(); // Clerk user info
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await ConnectDB();

    // Check if user exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Fetch Clerk profile if you want email, etc.
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      }).then((res) => res.json());

      user = await User.create({
        clerkId: userId,
        email: clerkUser.email_addresses[0].email_address,
        role: "buyer", // default role
      });
    }

    return new Response(JSON.stringify({ success: true, user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
