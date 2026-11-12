import express from "express";
import db from "./database/db.js";
import apiRouter from "./routes/index.js";

const app = express();
const PORT = 3000;

//Parse JSON request bodies (React will send JSON, not form data)
app.use(express.json());
app.use("/api/v1", apiRouter);

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
