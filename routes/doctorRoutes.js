import express from "express";
import { searchPatient } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/patient/:aadhaar", searchPatient);

export default router;
