import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import { initializeDataSource } from "./data-source";

const app: Application = express();
const port = process.env.PORT || 3000;

initializeDataSource();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
