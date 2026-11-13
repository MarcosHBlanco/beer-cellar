import express from "express";
import {
	getAllBreweries,
	getBreweryById,
	searchBreweries,
} from "../controllers/breweriesController.js";
import { validateId, validateSearchQuery } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/search", validateSearchQuery, searchBreweries);
router.get("/:id", validateId, getBreweryById);

export default router;
