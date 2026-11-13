import express from "express";
import { getAllBeers, getBeerById } from "../controllers/beersController.js";
import { validateId, validateBeerQuery } from "../middleware/validators.js";

const router = express.Router();

router.get("/", validateBeerQuery, getAllBeers);
router.get("/:id", validateId, getBeerById);

export default router;
