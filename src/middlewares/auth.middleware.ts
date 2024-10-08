import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      adminId: number;
      isAdmin: boolean;
    }; // Adjusted type

    // Store decoded user info in the request
    (req as any).user = decoded;

    // Optional: Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
