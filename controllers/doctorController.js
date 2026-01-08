import fs from "fs";
import path from "path";

const dataPath = path.resolve("records.json");

export const searchPatient = (req, res) => {
  const { aadhaar } = req.params;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const patient = data.patients.find(p => p.aadhaar === aadhaar);
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  res.json(patient);
};
