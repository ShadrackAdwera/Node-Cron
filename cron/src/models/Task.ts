import { model, Model, Document, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TaskStatus } from '../utils/TaskStatus';

interface TaskDoc extends Document {
    title: string;
    version: number;
    status: string;
    assignedTo: string | undefined;
}

interface TaskModel extends Model<TaskDoc> {
    title: string;
    status: string;
    assignedTo: string | undefined;
}

const taskSchema = new Schema({
    title: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId },
    status: { type: String, required: true, enum: Object.keys(TaskStatus), default: TaskStatus.Pending }
}, { timestamps: true, toJSON: { getters: true } });

taskSchema.set('versionKey', 'version');
taskSchema.plugin(updateIfCurrentPlugin);

const Task = model<TaskDoc, TaskModel>('task', taskSchema);

export { Task };