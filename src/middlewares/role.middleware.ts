// middlewares/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import { authenticateJWT } from "./auth.middleware";

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    authenticateJWT(req, res, () => {
      const user = (req as any).user;
      if (role === "admin" && !user.isAdmin) {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
      next();
    });
  };
};
