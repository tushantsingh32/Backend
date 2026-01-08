import express from "express";
import { getPatientRecords } from "../controllers/patientController.js";

const router = express.Router();

router.get("/records/:aadhaar", getPatientRecords);

export default router;
