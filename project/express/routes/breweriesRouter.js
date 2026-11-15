import express from "express";
import {
	createBrewery,
	getAllBreweries,
	getBreweryById,
	searchBreweries,
} from "../controllers/breweriesController.js";
import {
	validateBreweryBody,
	validateId,
	validateSearchQuery,
} from "../middleware/validators.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/search", validateSearchQuery, searchBreweries);
router.get("/:id", validateId, getBreweryById);

router.post("/", validateBreweryBody, createBrewery);

export default router;
