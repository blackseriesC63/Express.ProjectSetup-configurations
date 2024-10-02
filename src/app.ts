import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
