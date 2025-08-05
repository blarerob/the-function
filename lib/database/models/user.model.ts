import { Schema, model, models } from 'mongoose';

export interface IUser {
    _id: string; // Unique identifier for the user
    userId: string; // Unique identifier for the user in your system
    clerkId: string; // Unique identifier from Clerk
    firstName: string;
    email: string;
    username: string;
    lastName: string;
    photo: string; // URL to the user's photo
    rsvps?: string[]; // Array of RSVP IDs or event IDs
}

const UserSchema = new Schema<IUser>({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    photo: { type: String, required: true},
    rsvps: [{ type: String, ref: 'RSVP' }],
})

const User = models.User || model('User', UserSchema);

export default User;