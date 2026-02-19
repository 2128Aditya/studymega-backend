import Pdf from "../models/pdf.js";

// ✅ Add PDF (Admin Only)
export const addPdf = async (req, res) => {
  try {
    const { title, category, subject, className, pdfUrl, thumbnail } = req.body;

    if (!title || !category || !pdfUrl) {
      return res
        .status(400)
        .json({ message: "Title, category, pdfUrl required" });
    }

    const pdf = await Pdf.create({
      title,
      category,
      subject,
      className,
      pdfUrl,
      thumbnail,
      uploadedBy: req.user?._id,
    });

    res.status(201).json({ message: "PDF added", pdf });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All PDFs (Public) + Filters + Search + Latest
export const getAllPdfs = async (req, res) => {
  try {
    const { category, q, latest, limit } = req.query;

    let filter = {};

    // category filter
    if (category) filter.category = category;

    // 🔥 Search filter (title/subject/className)
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { className: { $regex: q, $options: "i" } },
      ];
    }

    let query = Pdf.find(filter).sort({ createdAt: -1 });

    // latest
    if (latest === "true") {
      query = query.limit(Number(limit) || 6);
    }

    const pdfs = await query;
    return res.json(pdfs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single PDF (Public)
export const getPdfById = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.json(pdf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete PDF (Admin Only)
export const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    await pdf.deleteOne();

    res.json({ message: "PDF deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
