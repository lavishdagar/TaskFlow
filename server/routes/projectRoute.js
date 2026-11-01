import { Router } from "express";
import Project from '../models/Project.js'
import Task from '../models/Task.js'
const projectRoute = Router();
import passport from "../passport.js";
import mongoose from "mongoose";
projectRoute.use(passport.authenticate("jwt", { session: false }));

const pick = (obj, keys) =>
    Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));


const loadProject = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
        return res.status(404).json({ message: "Invalid project Id" })
    }
    const project = await Project.find({ _id: req.params.projectId })
    if (!project) {
        return res.status(404).json({ message: "Project not Found" })
    }
    req.project = project;
    next();
}


// GET    /api/projects                          list my projects
projectRoute.get("/", async (req, res) => {
    const projects = (await Project.find({ owner: req.user.id })).sort({ createdAt: -1 });
    res.json({ projects: projects })
})

// POST   /api/projects                          create a project
projectRoute.post("/", async (req, res, next) => {
    const { title, description, technologies } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
    const project = await Project.create({ title, description, technologies, status: "planned", owner: req.user._id });
    res.status(201).json({ project: project })
})

// GET    /api/projects/:projectId               one project
projectRoute.get("/:projectId", loadProject, async (req, res) => {
    const tasks = await Task.findOne({ project: req.project._id })
    res.status(201).json({ project: req.project, tasks: tasks })
})

// PATCH  /api/projects/:projectId               update it
projectRoute.patch("/:projectId", loadProject, async (req, res) => {
    Object.assign(req.project, pick(req.body, ["name", "description"]));
    await req.project.save();
    res.json({ project: req.project });
})

// DELETE /api/projects/:projectId               delete it (and its tasks)
projectRoute.delete("/:projectId", loadProject, async (req, res) => {
    const tasks = await Task.deleteMany({ project: req.project._id })
    const project = await Project.deleteOne({ _id: req.project._id })
    res.status(204).end();
})

// GET    /api/projects/:projectId/tasks         tasks in that project
projectRoute.get("/:projectId/tasks", loadProject, async (req, res) => {
    const tasks = await Task.find({ project: req.projectId._id });
    res.json({ tasks: tasks })
})

// POST   /api/projects/:projectId/tasks         add a task
projectRoute.post("/:projectId/tasks", loadProject, async (req, res) => {
    if (!req.body.title?.trim()) return res.status(401).json({ message: "Title is required" });

    const task = await Task.create({
        ...pick(req.body, ["title", "description", "status"]),
        project: req.project._id
    })
    res.status(201).json({ task })
})

// PATCH  /api/projects/:projectId/tasks/:taskId
projectRoute.patch("/:projectId/tasks/:taskId", loadProject, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.taskId)) {
        return res.status(400).json({ message: "Invalid Task Id" })
    };
    const task = await Task.findOneAndUpdate({
        project: req.project._id, _id: req.params.taskId
    },
        pick(req.body, ["title", "description", "status"]),
        { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
})


// DELETE /api/projects/:projectId/tasks/:taskId
projectRoute.delete("/:projectId/tasks/:taskId", loadProject, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.taskId)) {
        return res.status(400).json({ message: "Invalid Task Id" })
    };
    const task = await Task.findOneAndDelete({ project: req.project._id, _id: req.params.taskId })
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
})

export default projectRoute;