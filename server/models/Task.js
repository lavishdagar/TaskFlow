import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Project",
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 150
        },
        description: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo"
        },
    },
    { timestamps: true }
);
taskSchema.index({ owner: 1, project: 1, status: 1 });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;