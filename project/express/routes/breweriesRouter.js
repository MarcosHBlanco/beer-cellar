import express from "express";
import {
	getAllBreweries,
	getBreweryById,
} from "../controllers/breweriesController.js";
import { validateId } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/:id", validateId, getBreweryById);

export default router;
