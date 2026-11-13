import express from "express";
import { getAllBeers, getBeerById } from "../controllers/beersController.js";
import { validateId } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getAllBeers);
router.get("/:id", validateId, getBeerById);

export default router;
