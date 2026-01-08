export const login = (req, res) => {
  const { role, aadhaar, doctorId, doctorName } = req.body;

  if (role === "patient") {
    return res.json({ role: "patient", aadhaar });
  }

  if (role === "doctor") {
    return res.json({ role: "doctor", doctorId, doctorName });
  }

  res.status(400).json({ message: "Invalid role" });
};
