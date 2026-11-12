import express from "express";
import db from "./database/db.js";

const app = express();
const PORT = 3000;

//Parse JSON request bodies (React will send JSON, not form data)
app.use(express.json());

//Health check: proves the server and the database both work
app.get("/api/health", (req, res) => {
	const tables = db
		.prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
		.all();
	res.json({ status: "ok", tables });
});

app.listen(PORT, () => {
	console.log(`Server running at https://localhost:${PORT}`);
});
