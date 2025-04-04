import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const cached: { conn: mongoose.Connection | null, promise: Promise<typeof mongoose> | null } = (global as never) || { conn: null, promise: null };
export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'events',
        bufferCommands: false,
    })

cached.conn = (await cached.promise).connection;
    return cached.conn;
}