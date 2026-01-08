import fs from "fs";
import path from "path";

const dataPath = path.resolve("records.json");

export const getPatientRecords = (req, res) => {
  const { aadhaar } = req.params;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const patient = data.patients.find(p => p.aadhaar === aadhaar);
  if (!patient) {
    return res.status(404).json({ message: "No records found" });
  }

  res.json(patient.records);
};
