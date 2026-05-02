import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDb } from "./db.js";
import { createPropertyRouter } from "./routes/properties.js";

const app = express();
const port = process.env.PORT || 5001;
const useDatabase = await connectDb();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: useDatabase ? "mongodb" : "sample-data" });
});

app.use("/api/properties", createPropertyRouter({ useDatabase }));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong." });
});

app.listen(port, () => {
  console.log(`EstateFlow API running on http://localhost:${port}`);
});
