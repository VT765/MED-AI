import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Document from "./models/Document.js";
import { protect } from "./middleware/auth.js";
import upload from "./middleware/upload.js";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading environment variables from project root first, then backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error(
    "MONGO_URI is not set. Please create a .env file in the project root or backend folder with MONGO_URI set to your MongoDB connection string."
  );
}

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is not set. Please add JWT_SECRET to your .env so authentication tokens can be generated."
  );
}

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY is not set. The /api/chat endpoint will not work until you add OPENAI_API_KEY to your .env."
  );
}

connectDB();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static('uploads'));

// 🔐 SIGN UP
app.post("/api/auth/signup", async (req, res) => {
  console.log("Signup Request Body:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user in DB...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("User successfully created in DB:", user._id);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔑 LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📄 UPLOAD DOCUMENT
app.post("/api/documents/upload", protect, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);

    // Create document in DB
    const document = await Document.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: req.file.path,
      extractedText: data.text,
    });

    res.status(201).json({
      message: "File uploaded and processed successfully",
      document: {
        id: document._id,
        filename: document.filename,
        textPreview: document.extractedText.substring(0, 200) + "..."
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File processing failed", error: error.message });
  }
});

// 🤖 AI CHAT
app.post("/api/chat", protect, async (req, res) => {
  const { question, documentId } = req.body;

  if (!question || !documentId) {
    return res.status(400).json({ message: "Question and Document ID required" });
  }

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to access this document" });
    }

    // Context window limit handling (rudimentary)
    const contextText = document.extractedText.substring(0, 10000);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful medical assistant. Answer the user's question based on the provided document text. Disclaimer: This is not medical advice. Consult a licensed professional." },
        { role: "user", content: `Document Text: ${contextText}\n\nQuestion: ${question}` }
      ],
      model: "gpt-3.5-turbo",
    });

    const answer = completion.choices[0].message.content;

    res.json({
      answer: answer + "\n\n**Disclaimer: This is not medical advice. Consult a licensed professional.**"
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "AI Chat failed", error: error.message });
  }
});

// server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
