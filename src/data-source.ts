import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/user.entity";
import { Blog } from "./entities/blog.entity";
import { Admin } from "./entities/admin.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Blog, Admin],
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection has been established successfully!");

    const result = await AppDataSource.query("SELECT NOW()");
    console.log("Current timestamp from the database:", result);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};
