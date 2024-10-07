import dotenv from "dotenv";
import express, { Application } from "express";
import { initializeDataSource } from "./data-source";
import authRoutes from "./controllers/auth.controller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

initializeDataSource();

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
