import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireDoctor(req, res, next) {
  if (req.user.userType !== "doctor") {
    return res.status(403).json({ message: "Doctor only" });
  }
  next();
}

export function requirePatient(req, res, next) {
  if (req.user.userType !== "patient") {
    return res.status(403).json({ message: "Patient only" });
  }
  next();
}
