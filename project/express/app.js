import { fileURLToPath } from "node:url";
import express from "express";
import db from "./database/db.js";
import apiRouter from "./routes/index.js";

const app = express();
const PORT = 3000;

//Parse JSON request bodies (React will send JSON, not form data)
app.use(express.json());
app.use("/api/v1", apiRouter);

//Serve the built React app (react/dist) for everything that isn't the API
const reactBuildPath = fileURLToPath(new URL("../react/dist", import.meta.url));
app.use(express.static(reactBuildPath));

//Health check: proves the server and the database both work
app.get("/api/health", (req, res) => {
	const tables = db
		.prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
		.all();
	res.json({ status: "ok", tables });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
