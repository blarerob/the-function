import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalWithMongoose extends NodeJS.WarningListener {
    mongoose: {
        conn: mongoose.Connection | null,
        promise: Promise<mongoose.Connection> | null
    }
}

const cached: { conn: mongoose.Connection | null, promise: Promise<mongoose.Connection> | null } = (global as unknown as GlobalWithMongoose).mongoose || { conn: null, promise: null };
export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    mongoose.connect(MONGODB_URI, {
        dbName: 'jtown-events',
        bufferCommands: false,
    })

    cached.conn = await cached.promise;

    return cached.conn;
}