
import { supabase } from "../config/supabase.js";

// ==========================================
// SAVE ATTENDANCE
// ==========================================

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

    console.log("Received period:", period);
    console.log("Converted period:", periodNumber);

    // Validate period
    if (
      period === undefined ||
      period === null ||
      period === "" ||
      !Number.isInteger(periodNumber) ||
      periodNumber < 1 ||
      periodNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Please select a period from 1 to 8.",
        receivedPeriod: period,
      });
    }

    // Validate required fields
    if (
      !teacher_id ||
      !teacher_name ||
      !class_name ||
      !section ||
      present_students === undefined ||
      present_students === null ||
      present_students === "" ||
      !Number.isFinite(Number(present_students)) ||
      Number(present_students) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All attendance fields are required.",
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

    // Final attendance data
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
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Attendance Saved Successfully",
      attendance: data,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// EXPORT ATTENDANCE AS CSV
// ==========================================

export const exportAttendanceCSV = async (req, res) => {
  try {
    // Fetch all attendance records
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .order("attendance_date", { ascending: false })
      .order("attendance_time", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found.",
      });
    }

    // CSV column names
    const columns = [
      "id",
      "teacher_id",
      "teacher_name",
      "class_name",
      "section",
      "period",
      "present_students",
      "attendance_date",
      "attendance_time",
    ];

    // Escape CSV values
    const escapeCSV = (value) => {
      if (value === null || value === undefined) {
        return '""';
      }

      let safeValue = String(value);

      // Protect spreadsheet users from formula injection
      if (/^[\s]*[=+\-@]/.test(safeValue)) {
        safeValue = "'" + safeValue;
      }

      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    // Create CSV rows
    const csvRows = [
      columns.join(","),
      ...data.map((record) =>
        columns
          .map((column) => escapeCSV(record[column]))
          .join(",")
      ),
    ];

    // UTF-8 BOM for Excel compatibility
    const csvContent = "\uFEFF" + csvRows.join("\r\n");

    // File name
    const fileName = `Student_Attendance_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    // Download response
    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    return res.status(200).send(csvContent);

  } catch (error) {
    console.error("CSV EXPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export attendance data.",
      error: error.message,
    });
  }
};
