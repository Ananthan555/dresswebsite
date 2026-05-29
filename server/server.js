import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dress_website";
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-key";
const JWT_EXPIRES_IN = "1d";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dressweb.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, sparse: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is required." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello MongoDB");
});

app.post("/api/register", async (req, res) => {
  try {
    const { password } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone number and password are required." });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Please enter a valid 10 digit phone number." });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ error: "Phone number already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ phone, password: hashedPassword });
    await user.save();
    const token = createToken(user);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { id: user._id, phone: user.phone },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to create account." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { password } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone number and password are required." });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Please enter a valid 10 digit phone number." });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: "Invalid phone number or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid phone number or password." });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: { id: user._id, phone: user.phone },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to authenticate user." });
  }
});


app.post("/api/reset-password", async (req, res) => {
  try {
    const { password } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!phone || !password) {
      return res.status(400).json({
        error: "Phone number and new password are required."
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Please enter a valid 10 digit phone number." });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        error: "No account found with this phone number."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.json({
      message: "Password reset successful."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to reset password."
    });
  }
});
 

app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to load profile." });
  }
});


   

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
