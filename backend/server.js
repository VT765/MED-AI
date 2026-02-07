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
import crypto from "crypto";
import OpenAI from "openai";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import CSSMatrix from "@thednp/dommatrix";
import { sendVerificationEmail } from "./utils/email.js";

if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = CSSMatrix;
}

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder, then project root, so either location works
dotenv.config({ path: path.resolve(__dirname, "./.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error(
    "MONGO_URI is not set. Please create a .env file in the project root or backend folder with MONGO_URI set to your MongoDB connection string."
  );
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-in-production-" + Math.random().toString(36).slice(2);
  console.warn(
    "JWT_SECRET is not set in .env. Using a dev-only secret. Add JWT_SECRET to your .env for production."
  );
}

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY is not set. The /api/chat endpoint will not work until you add OPENAI_API_KEY to your .env."
  );
}

connectDB();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);

const generateOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, "0");
const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");
const isOtpExpired = (expiresAt) => !expiresAt || new Date(expiresAt).getTime() < Date.now();

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
  const { username, email, password, phone } = req.body;
  const displayUsername = String(username || "").trim();

  if (!displayUsername || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      message: "Server misconfigured. Add JWT_SECRET to your .env file.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      if (userExists.emailVerified) {
        return res.status(400).json({ message: "User already exists" });
      }

      const otp = generateOtp();
      userExists.emailVerificationOtpHash = hashOtp(otp);
      userExists.emailVerificationOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
      userExists.emailVerificationOtpSentAt = new Date();
      await userExists.save();

      const emailSent = await sendVerificationEmail({
        to: userExists.email,
        otp,
        expiresMinutes: OTP_TTL_MINUTES,
      });

      return res.status(200).json({
        message: "Verification code sent",
        verificationRequired: true,
        email: userExists.email,
        ...(emailSent || process.env.NODE_ENV === "production" ? {} : { debugOtp: otp }),
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user in DB...");
    const user = await User.create({
      username: displayUsername,
      email: normalizedEmail,
      phone: phone || null,
      password: hashedPassword,
      emailVerified: false,
    });
    console.log("User successfully created in DB:", user._id);

    const otp = generateOtp();
    user.emailVerificationOtpHash = hashOtp(otp);
    user.emailVerificationOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    user.emailVerificationOtpSentAt = new Date();
    await user.save();

    const emailSent = await sendVerificationEmail({
      to: user.email,
      otp,
      expiresMinutes: OTP_TTL_MINUTES,
    });

    res.status(201).json({
      message: "Verification code sent",
      verificationRequired: true,
      email: user.email,
      ...(emailSent || process.env.NODE_ENV === "production" ? {} : { debugOtp: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ VERIFY EMAIL OTP
app.post("/api/auth/verify-email", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.emailVerified) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Email already verified",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone || undefined,
        },
      });
    }

    if (isOtpExpired(user.emailVerificationOtpExpiresAt)) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    const incomingHash = hashOtp(String(otp));
    if (incomingHash !== user.emailVerificationOtpHash) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpiresAt = null;
    user.emailVerificationOtpSentAt = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone || undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔁 RESEND EMAIL OTP
app.post("/api/auth/resend-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({ message: "If the account exists, a verification code has been sent." });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    const lastSent = user.emailVerificationOtpSentAt?.getTime() || 0;
    const secondsSinceLast = (Date.now() - lastSent) / 1000;
    if (secondsSinceLast < OTP_RESEND_COOLDOWN_SECONDS) {
      return res.status(429).json({
        message: "Please wait before requesting another code",
        retryAfterSeconds: Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast),
      });
    }

    const otp = generateOtp();
    user.emailVerificationOtpHash = hashOtp(otp);
    user.emailVerificationOtpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    user.emailVerificationOtpSentAt = new Date();
    await user.save();

    const emailSent = await sendVerificationEmail({
      to: user.email,
      otp,
      expiresMinutes: OTP_TTL_MINUTES,
    });

    res.status(200).json({
      message: "Verification code sent",
      ...(emailSent || process.env.NODE_ENV === "production" ? {} : { debugOtp: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔑 LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      message: "Server misconfigured. Add JWT_SECRET to your .env file.",
    });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Email not verified",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
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
        username: user.username,
        email: user.email,
        phone: user.phone || undefined,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
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

    if (!openai) {
      return res.status(503).json({
        message: "AI chat is not available. Add OPENAI_API_KEY to your .env to enable it.",
      });
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
