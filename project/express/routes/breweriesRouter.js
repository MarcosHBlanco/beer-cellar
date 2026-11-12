import express from "express";
import { getAllBreweries } from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);

export default router;
