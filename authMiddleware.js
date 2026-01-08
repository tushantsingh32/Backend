export function requireDoctor(req, res, next) {
  const { role } = req.headers;
  if (role !== "doctor") {
    return res.status(403).json({ message: "Doctor access only" });
  }
  next();
}

export function requirePatient(req, res, next) {
  const { role } = req.headers;
  if (role !== "patient") {
    return res.status(403).json({ message: "Patient access only" });
  }
  next();
}
