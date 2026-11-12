import express from "express";
import breweriesRouter from "./breweriesRouter.js";
import beersRouter from "./beersRouter.js";
const router = express.Router();

router.use("/breweries", breweriesRouter);
router.use("/beers", beersRouter);

export default router;
