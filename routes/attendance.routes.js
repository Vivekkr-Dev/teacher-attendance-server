import express from "express";
import { saveAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/", saveAttendance);

export default router;