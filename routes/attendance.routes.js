import express from "express";

import {
  saveAttendance,
  exportAttendanceCSV,
  getAttendanceHistory,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Save attendance
router.post("/", saveAttendance);

// Get attendance history
router.get("/", getAttendanceHistory);

// Export attendance CSV
router.get("/export", exportAttendanceCSV);

export default router;