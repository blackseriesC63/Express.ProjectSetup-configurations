import { Router } from "express";
import { UserService } from "../services/user.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateJWT } from "../middlewares/auth.middleware";

dotenv.config();

const router = Router();
const userService = new UserService();

// User Registration
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const savedUser = await userService.createUser(username, email, password);
    res.status(201).json({ message: "User created", userId: savedUser.id });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        return res.status(400).json({ message: "Email already in use" });
      }
      return res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
    res.status(500).json({ message: "Error creating user" });
  }
});

// Get user byid
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.findUserById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await userService.comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
});

// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Update User
router.put("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, password } = req.body;

  try {
    const updatedUser = await userService.updateUser(
      userId,
      username,
      email,
      password
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Delete User
router.delete("/:id", authenticateJWT, async (req, res) => {
  const userId = parseInt(req.params.id);
  const requestingAdminId = (req as any).user.adminId;

  try {
    await userService.deleteUser(userId, requestingAdminId);
    res.json({ message: "User deleted" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error deleting user";
    res.status(500).json({ message: errorMessage });
  }
});

export default router;
