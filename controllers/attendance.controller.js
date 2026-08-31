import { supabase } from "../config/supabase.js";

export const saveAttendance = async (req, res) => {
  try {
    const {
      teacher_id,
      class_name,
      section,
      period,
      present_students,
    } = req.body;

    console.log("========== Attendance Request ==========");
    console.log("Request Body:", req.body);

    // Validation
    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });
    }

    if (!class_name || !section || !period) {
      return res.status(400).json({
        success: false,
        message: "Class, section and period are required",
      });
    }

    if (present_students === undefined || present_students === null) {
      return res.status(400).json({
        success: false,
        message: "Present students is required",
      });
    }

    // Get teacher name
    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("id, name")
      .eq("id", Number(teacher_id))
      .single();

    console.log("Teacher Data:", teacher);
    console.log("Teacher Error:", teacherError);

    if (teacherError || !teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Indian date and time
    const now = new Date();

    const attendance_date = now.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const attendance_time = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    // Insert attendance
    const attendanceData = {
      teacher_id: Number(teacher_id),
      teacher_name: teacher.name,
      class_name: class_name,
      section: section,
      period: Number(period),
      present_students: Number(present_students),
      attendance_date: attendance_date,
      attendance_time: attendance_time,
    };

    console.log("Data being inserted:", attendanceData);

    const { data, error } = await supabase
      .from("attendance")
      .insert([attendanceData])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Attendance Saved:", data);

    res.status(201).json({
      success: true,
      message: "Student Attendance Saved Successfully",
      attendance: data,
    });

  } catch (error) {
    console.error("Attendance Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to save attendance",
    });
  }
};