import express from "express";
import {
	createBeer,
	getAllBeers,
	getBeerById,
} from "../controllers/beersController.js";
import {
	validateId,
	validateBeerQuery,
	validateBeerBody,
} from "../middleware/validators.js";

const router = express.Router();

router.get("/", validateBeerQuery, getAllBeers);
router.get("/:id", validateId, getBeerById);

router.post("/", validateBeerBody, createBeer);
export default router;
