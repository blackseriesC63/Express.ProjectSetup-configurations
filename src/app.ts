import dotenv from "dotenv";
import express, { Application } from "express";
import { AppDataSource, initializeDataSource } from "./data-source";
import authRoutes from "./controllers/user.controller";
import blogRoutes from "./controllers/blog.controller";
import adminRoutes from "./controllers/admin.controller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

initializeDataSource();

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on ${port}`);
      });
    })
    .catch((error) => console.log(error));
}

export default app;
