import express from "express";
import {
	getAllBreweries,
	getBreweryById,
} from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/:id", getBreweryById);

export default router;
