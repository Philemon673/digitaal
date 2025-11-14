import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const authSeller = async (userId) => {
  try {
    if (!userId) return false;

    // Fetch the user directly from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check role in Clerk's public metadata
    return user?.publicMetadata?.role === "seller";
  } catch (error) {
    console.error("authSeller error:", error.message);
    return false;
  }
};

export default authSeller;
