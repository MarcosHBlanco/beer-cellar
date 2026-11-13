import express from "express";
import { getAllBeers, getBeerById } from "../controllers/beersController.js";

const router = express.Router();

router.get("/", getAllBeers);
router.get("/:id", getBeerById);

export default router;
