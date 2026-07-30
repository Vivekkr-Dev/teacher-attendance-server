import express from "express";
import { getTeachers } from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/", getTeachers);

export default router;