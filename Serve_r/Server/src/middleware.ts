//middleware
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Import the JWT_SECRET from where it's defined
const JWT_SECRET = "adilraj123456789";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Extract the token from "Bearer <token>"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || typeof decoded !== 'object') {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Add userId to the request object
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Authentication failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
}
