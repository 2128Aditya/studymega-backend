
import Pdf from "../models/pdf.js";
import User from "../models/Users.js";

export const getAdminStats = async (req, res) => {
  try {
    // Total PDFs
    const totalPdfs = await Pdf.countDocuments();

    // Latest 5 uploads
    const latestPdfs = await Pdf.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category subject className createdAt");

    // Category wise count (aggregate)
    const categoryStats = await Pdf.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Users stats
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalStudents = await User.countDocuments({ role: "student" });

    // Category wise (simple counts)
    const notes = await Pdf.countDocuments({ category: "notes" });
    const pyq = await Pdf.countDocuments({ category: "pyq" });
    const sample = await Pdf.countDocuments({ category: "sample-papers" });
    const important = await Pdf.countDocuments({ category: "important" });
    const syllabus = await Pdf.countDocuments({ category: "syllabus" });
    const college = await Pdf.countDocuments({ category: "college" });

    return res.json({
      totalPdfs,
      latestPdfs,
      categoryStats,

      categories: {
        notes,
        pyq,
        sample,
        important,
        syllabus,
        college,
      },

      users: {
        totalUsers,
        totalAdmins,
        totalStudents,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};