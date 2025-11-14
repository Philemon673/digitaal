import mongoose from "mongoose";


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function ConnectDB() {
  if (cached.conn) {
    console.log("✅ Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    console.log("🔌 Connecting to database...");
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/Digitaal`, opts)
      .then((mongoose) => {
        console.log("✅ Database connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ Connection failed:", error.message);
        throw error;
      });
  }

  // ⬇️ Always wait for the connection to complete before returning
  cached.conn = await cached.promise;
  return cached.conn;
}

export default ConnectDB;
