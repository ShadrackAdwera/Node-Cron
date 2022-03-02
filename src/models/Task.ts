import { model, Model, Document, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TaskDoc extends Document {
    title: string;
    version: number;
    assignedTo: string | undefined;
}

interface TaskModel extends Model<TaskDoc> {
    title: string;
    assignedTo: string | undefined;
}

const taskSchema = new Schema({
    title: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId }
}, { timestamps: true, toJSON: { getters: true } });

taskSchema.set('versionKey', 'version');
taskSchema.plugin(updateIfCurrentPlugin);

const Task = model<TaskDoc, TaskModel>('task', taskSchema);

export { Task };