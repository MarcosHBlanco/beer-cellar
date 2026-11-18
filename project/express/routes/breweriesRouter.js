import express from "express";
import {
	createBrewery,
	getAllBreweries,
	getBeersForBrewery,
	getBreweryById,
	searchBreweries,
	updateBreweryById,
} from "../controllers/breweriesController.js";
import {
	validateBreweryBody,
	validateBreweryReviewBody,
	validateId,
	validateSearchQuery,
} from "../middleware/validators.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/search", validateSearchQuery, searchBreweries);
router.get("/:id", validateId, getBreweryById);
router.get("/:id/beers", validateId, getBeersForBrewery);

router.post("/", validateBreweryBody, createBrewery);

router.put("/:id", validateId, validateBreweryReviewBody, updateBreweryById);
export default router;
