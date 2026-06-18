import mongoose from "mongoose"
import dns from "dns"

dns.setServers(["8.8.8.8", "1.1.1.1"])

const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
    throw new Error("db url not found!")
}

let cached = global.mongooseConn
if (!cached) {
    cached = global.mongooseConn = { conn: null, promise: null }
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUrl).then(c => c.connection)
    }

    try {
        const conn = await cached.promise
        console.log("🔴🔴🔴🔴mongobd connected succesfully");

        return conn
    } catch (error) {
        console.error("MongoDB Connection Error:");
        console.error(error);
        throw error;
    }
}

export default connectDb