
import express from "express";

import {
  saveAttendance,
  exportAttendanceCSV,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Save attendance
router.post("/", saveAttendance);

// Export attendance CSV
router.get("/export", exportAttendanceCSV);

export default router;
