import { Schema, model, models } from 'mongoose';

export interface IGuest {
    userId: string; // Unique identifier for the user
    clerkId: string; // Unique identifier from Clerk
    firstName: string;
    email: string;
    username: string;
    lastName: string;
    photo: string; // URL to the user's photo
    rsvps?: string[]; // Array of RSVP IDs or event IDs
}

const GuestSchema = new Schema<IGuest>({
    userId: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    photo: { type: String, required: true},
    rsvps: [{ type: String, ref: 'RSVP' }],
})

const Guest = models.Guests || model('Guest', GuestSchema);

export default Guest;