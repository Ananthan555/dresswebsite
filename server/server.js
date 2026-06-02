import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dress_website";
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-key";
const JWT_EXPIRES_IN = "1d";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    })
  : null;

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

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String },
  selectedSize: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["created", "paid"], default: "created" },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  receipt: { type: String, required: true },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");
const isValidPhone = (phone) => /^\d{10}$/.test(phone);
const getPriceValue = (price) => Number(String(price || "").replace(/[^\d]/g, "")) || 0;

const normalizeOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items
    .map((item) => {
      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 10));
      const unitPrice = getPriceValue(item.unitPrice || item.price);

      return {
        productId: String(item.productId || item.id || "").slice(0, 80),
        name: String(item.name || "").trim().slice(0, 120),
        category: String(item.category || "").trim().slice(0, 80),
        selectedSize: item.selectedSize ? String(item.selectedSize).slice(0, 20) : undefined,
        quantity,
        unitPrice,
      };
    })
    .filter((item) => item.productId && item.name && item.unitPrice > 0);
};

const serializeOrder = (order) => ({
  id: order._id,
  items: order.items,
  amount: order.amount,
  currency: order.currency,
  status: order.status,
  receipt: order.receipt,
  razorpayOrderId: order.razorpayOrderId,
  razorpayPaymentId: order.razorpayPaymentId,
  createdAt: order.createdAt,
  paidAt: order.updatedAt,
});

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

app.post("/api/payments/create-order", authenticateToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: "Razorpay keys are not configured on the server." });
    }

    const items = normalizeOrderItems(req.body.items);
    const amount = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

    if (!items.length || amount <= 0) {
      return res.status(400).json({ error: "Valid cart items are required." });
    }

    const receipt = `rcpt_${Date.now()}_${String(req.user.id).slice(-6)}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt,
      notes: {
        userId: req.user.id,
      },
    });

    const order = await Order.create({
      user: req.user.id,
      items,
      amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      receipt,
    });

    return res.status(201).json({
      key: RAZORPAY_KEY_ID,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({ error: "Unable to create payment order." });
  }
});

app.post("/api/payments/verify", authenticateToken, async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Payment verification details are required." });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment signature verification failed." });
    }

    order.status = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    return res.json({
      message: "Payment verified and order confirmed.",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Unable to verify payment." });
  }
});

app.post("/api/payments/sync", authenticateToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: "Razorpay keys are not configured on the server." });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (order.status === "paid") {
      return res.json({ paid: true, order: serializeOrder(order) });
    }

    const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId);
    const paidPayment = payments.items.find((payment) => (
      payment.status === "captured" || payment.status === "authorized"
    ));

    if (!paidPayment) {
      return res.json({ paid: false, order: serializeOrder(order) });
    }

    order.status = "paid";
    order.razorpayPaymentId = paidPayment.id;
    await order.save();

    return res.json({ paid: true, order: serializeOrder(order) });
  } catch (error) {
    console.error("Payment sync error:", error);
    return res.status(500).json({ error: "Unable to sync payment status." });
  }
});

app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const recentOrders = await Order.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(50);
    const createdOrders = recentOrders.filter((order) => order.status !== "paid");

    if (razorpay && createdOrders.length > 0) {
      await Promise.all(createdOrders.map(async (order) => {
        try {
          const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId);
          const paidPayment = payments.items.find((payment) => (
            payment.status === "captured" || payment.status === "authorized"
          ));

          if (paidPayment) {
            order.status = "paid";
            order.razorpayPaymentId = paidPayment.id;
            await order.save();
          }
        } catch (error) {
          console.error("Order refresh sync error:", error);
        }
      }));
    }

    const orders = await Order.find({ user: req.user.id, status: "paid" })
      .sort({ updatedAt: -1 })
      .limit(50);

    return res.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    console.error("Order history error:", error);
    return res.status(500).json({ error: "Unable to load orders." });
  }
});


   

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
