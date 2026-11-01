import { Router } from "express";
import authRouter from "./auth.js"
import projectRouter from "./projectRoute.js";
const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/api/projects", projectRouter)

export default indexRouter;