import mongoose, { Mongoose } from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true

        },
        title: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        technologies: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["planned", "ongoing", "completed"],
            default: "planned"
        },


    },
    { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;