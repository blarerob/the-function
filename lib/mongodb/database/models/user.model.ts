import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    cerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    photoURL: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
})

const User = models.User || model('User', UserSchema);

export default User;