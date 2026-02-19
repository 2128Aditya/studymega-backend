import axios from "axios";

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

/* ===============================
   STUDY PLAN (TEXT MODE - STABLE)
================================== */

export const generateStudyPlan = async (req, res) => {
  try {
    const { className, subjects, examDate, dailyHours, level, goals } =
      req.body;

    if (!className || !subjects || !examDate || !dailyHours) {
      return res.status(400).json({
        message:
          "className, subjects, examDate, dailyHours are required",
      });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        message: "HF_TOKEN missing in backend .env",
      });
    }

    const prompt = `
Create a clear and structured day-wise study plan.

Student Details:
Class: ${className}
Subjects: ${subjects}
Exam Date: ${examDate}
Daily Study Hours: ${dailyHours}
Level: ${level || "Average"}
Goals: ${goals || "Score high marks"}

Format like:

Day 1:
- Subject:
- Topics:
- Time Allocation:

Day 2:
...

Add revision tips at the end.
Write clearly in simple language.
`;

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: HF_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    // ✅ Return simple text (NO JSON parsing)
    return res.json({ plan: text });
  } catch (err) {
    console.log("🔥 StudyPlan Error:", err?.response?.data || err.message);

    return res.status(500).json({
      message:
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message,
    });
  }
};

/* ===============================
   SIMPLE ASK AI
================================== */

export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt)
      return res.status(400).json({
        message: "Prompt is required",
      });

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        message: "HF_TOKEN missing in backend .env",
      });
    }

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: HF_MODEL,
        messages: [
          {
            role: "user",
            content: `Answer in simple Hinglish:\n\n${prompt}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.choices?.[0]?.message?.content;

    return res.json({
      reply: text || "No response",
    });
  } catch (err) {
    console.log("🔥 AskAI Error:", err?.response?.data || err.message);

    return res.status(500).json({
      message:
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message,
    });
  }
};