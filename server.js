import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

dotenv.config();

/* ===============================
   ES MODULE dirname FIX
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   APP SETUP (ONLY ONCE)
================================ */
const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   ROOT ROUTE (IMPORTANT)
================================ */
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

/* ===============================
   UPLOAD SETUP
================================ */
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOAD_DIR));

/* ===============================
   MULTER
================================ */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) cb(null, true);
    else cb(null, false);
  }
});

/* ===============================
   FILE PATHS
================================ */
const USERS_FILE = path.join(__dirname, "users.json");
const RECORDS_FILE = path.join(__dirname, "records.json");

/* ===============================
   HELPERS
================================ */
const loadJson = file => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
};

const saveJson = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

/* ===============================
   JWT MIDDLEWARE
================================ */
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(
      auth.split(" ")[1],
      process.env.JWT_SECRET || "secret123"
    );
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireDoctor = (req, res, next) =>
  req.user.userType === "doctor"
    ? next()
    : res.status(403).json({ message: "Doctor only" });

const requirePatient = (req, res, next) =>
  req.user.userType === "patient"
    ? next()
    : res.status(403).json({ message: "Patient only" });

/* ===============================
   AUTH ROUTES
================================ */
app.post("/api/signup", (req, res) => {
  const users = loadJson(USERS_FILE);
  if (users.some(u => u.email === req.body.email))
    return res.status(400).json({ message: "Email exists" });

  users.push({
    id: Date.now(),
    ...req.body,
    passwordHash: bcrypt.hashSync(req.body.password, 10)
  });

  saveJson(USERS_FILE, users);
  res.json({ status: "success" });
});

app.post("/api/login", (req, res) => {
  const users = loadJson(USERS_FILE);
  const user = users.find(u => u.email === req.body.email);

  if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, userType: user.userType },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1h" }
  );

  res.json({ token, user });
});

/* ===============================
   START SERVER (ONLY ONCE)
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);




