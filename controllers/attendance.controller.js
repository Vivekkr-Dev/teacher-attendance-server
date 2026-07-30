import { supabase } from "../config/supabase.js";

export const saveAttendance = async (req, res) => {
  try {
    const {
      teacher_id,
      teacher_name,
      class_name,
      section,
      present_students,
    } = req.body;

    // Current Indian Date & Time
    const now = new Date();

    const attendance_date = now.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const attendance_time = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          teacher_id,
          teacher_name,
          class_name,
          section,
          present_students,
          attendance_date,
          attendance_time,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Attendance Saved Successfully",
      attendance: data,
    });

  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};