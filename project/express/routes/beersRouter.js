import express from "express";
import { getAllBeers } from "../controllers/beersController.js";

const router = express.Router();

router.get("/", getAllBeers);

export default router;
