import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["notes", "pyq", "sample-papers", "important", "syllabus", "college"],
    },
    subject: { type: String, default: "" },
    className: { type: String, default: "" },

    pdfUrl: { type: String, required: true },
    thumbnail: { type: String, default: "" },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Pdf = mongoose.model("Pdf", pdfSchema);
export default Pdf;