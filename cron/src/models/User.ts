import { Schema, Document, Model, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TaskStatus } from "../utils/TaskStatus";

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

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      required: true,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Pending,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

taskSchema.set("versionKey", "version");
taskSchema.plugin(updateIfCurrentPlugin);

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

const Task = model<TaskDoc, TaskModel>("Task", taskSchema);
const User = model<UserDoc, UserModel>("User", userSchema);

export { User, Task };
