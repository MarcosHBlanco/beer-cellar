import express from "express";
import breweriesRouter from "./breweriesRouter.js";

const router = express.Router();

router.use("/breweries", breweriesRouter);

export default router;
