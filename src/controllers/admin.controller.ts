import { Router } from "express";
import { AdminService } from "../services/admin.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateJWT } from "../middlewares/auth.middleware";

dotenv.config();

const router = Router();
const adminService = new AdminService();

// Admin Registration
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const savedAdmin = await adminService.createAdmin(
      username,
      email,
      password
    );
    res.status(201).json({ message: "Admin created", adminId: savedAdmin.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

// getAllAdmins
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const admins = await adminService.findAllAdmins();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminService.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT with adminId and isAdmin
    const token = jwt.sign(
      { adminId: admin.id, isAdmin: admin.isAdmin }, // Include isAdmin in the token
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
});

export default router;
