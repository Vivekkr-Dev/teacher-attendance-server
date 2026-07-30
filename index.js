import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import teacherRoutes from "./routes/teacher.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Teacher Attendance API Running 🚀",
  });
});

// API Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});