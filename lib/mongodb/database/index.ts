import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const cached: { conn: mongoose.Connection | null, promise: Promise<mongoose.Connection> | null } = { conn: null, promise: null };
export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

cached.promise = mongoose.connect(MONGODB_URI, {
    dbName: 'jtown-events',
    bufferCommands: false,
}).then((mongooseInstance) => mongooseInstance.connection);

    cached.conn = await cached.promise;

    return cached.conn;
}