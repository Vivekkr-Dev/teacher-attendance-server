import { supabase } from "../config/supabase.js";

export const saveAttendance = async (req, res) => {
  try {
    console.log("========== REQUEST BODY ==========");
    console.log(req.body);

    const {
      teacher_id,
      teacher_name,
      class_name,
      section,
      period,
      present_students,
    } = req.body;

    // Convert period to number
    const periodNumber = Number(period);

    console.log("========== PERIOD DEBUG ==========");
    console.log("Received period:", period);
    console.log("Converted period:", periodNumber);
    console.log("Type:", typeof periodNumber);

    // Validate period
    if (!period || !Number.isInteger(periodNumber) || periodNumber < 1 || periodNumber > 8) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Please select a period from 1 to 8.",
        receivedPeriod: period,
      });
    }

    // Validate other fields
    if (!teacher_id || !teacher_name || !class_name || !section || !present_students) {
      return res.status(400).json({
        success: false,
        message: "All attendance fields are required.",
      });
    }

    // Indian date/time
    const now = new Date();

    const attendance_date = now.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const attendance_time = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    // Final data
    const attendanceData = {
      teacher_id: Number(teacher_id),
      teacher_name: String(teacher_name),
      class_name: String(class_name),
      section: String(section),
      period: periodNumber,
      present_students: Number(present_students),
      attendance_date,
      attendance_time,
    };

    console.log("========== DATA SENT TO SUPABASE ==========");
    console.log(attendanceData);

    const { data, error } = await supabase
      .from("attendance")
      .insert([attendanceData])
      .select();

    if (error) {
      console.error("========== SUPABASE ERROR ==========");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("========== SUCCESS ==========");
    console.log(data);

    return res.status(201).json({
      success: true,
      message: "Attendance Saved Successfully",
      attendance: data,
    });

  } catch (error) {
    console.error("========== SERVER ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};