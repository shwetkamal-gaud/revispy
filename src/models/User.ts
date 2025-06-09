import { Schema, model, Document, models } from 'mongoose';

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    interests: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    interests: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        default: [],
      }
}, { timestamps: true });

export const User = models?.User || model<IUser>("User", userSchema);