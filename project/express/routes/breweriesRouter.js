import express from "express";
import {
	createBrewery,
	getAllBreweries,
	getBeersForBrewery,
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
router.get("/:id/beers", validateId, getBeersForBrewery);

router.post("/", validateBreweryBody, createBrewery);

export default router;
