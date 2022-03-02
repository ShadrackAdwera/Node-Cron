import { Schema, Document, Model, model } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserDoc extends Document {
    email: string;
    password: string;
    tasks: string[];
    version: number;
}

interface UserModel extends Model<UserDoc> {
    email: string;
    password: string;
    tasks: string[];
}

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [ { type: Schema.Types.ObjectId, ref: 'task' } ]
}, { timestamps: true, toJSON: { getters: true } });

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

const User = model<UserDoc, UserModel>('user', userSchema);

export { User };