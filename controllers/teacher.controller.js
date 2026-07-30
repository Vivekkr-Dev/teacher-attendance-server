import { supabase } from "../config/supabase.js";

export const getTeachers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("id");

    if (error) throw error;

    res.json({
      success: true,
      teachers: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};