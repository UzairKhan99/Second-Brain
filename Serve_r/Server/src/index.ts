import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { z } from "zod";
import { UserModel, ContentModel, LinkModel } from "./db";
import bcrypt from "bcrypt";
import { authMiddleware } from "./middleware";
import { generateShareLink } from "./utils";
import cors from "cors";

// Configuration constants

const PORT: number = 3000;

const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Add error logging middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Test endpoint to verify server is running
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ✅ Zod schema for validating incoming user data (username & password)
const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

//@ts-ignore
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    console.log("📝 Signup request received:", { ...req.body, password: "[HIDDEN]" });
    
    // Validate request body using Zod
    const { username, password } = userSchema.parse(req.body);

    // Check if the user already exists
    //@ts-ignore
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      console.log("❌ User already exists:", username);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    //@ts-ignore
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    console.log("✅ User created successfully:", username);
    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(400).json({ message: "Invalid input or internal error" });
  }
});

//@ts-ignore
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const { username, password } = userSchema.parse(req.body);
    
    // Find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Verify password
    //@ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    
    // Generate JWT token with 1 hour expiry
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Signin error:", error);
    res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Zod schema for content validation
const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  links: z.array(z.object({
    url: z.string().url("Invalid URL"),
    type: z.string()
  })).min(1, "At least one link is required")
});

//@ts-ignore
app.post("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log("📝 Received content creation request:", req.body);
    
    // Validate request body
    const validatedData = contentSchema.parse(req.body);
    const userId = (req as any).userId;

    if (!userId) {
      console.error("❌ No userId found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create the content with exact schema match
    const contentToCreate = {
      title: validatedData.title,
      links: validatedData.links.map(link => ({
        url: link.url,
        type: link.type
      })),
      userId: userId,
      tags: [] as mongoose.Types.ObjectId[]
    };

    console.log("📦 Attempting to create content:", contentToCreate);
    const content = await ContentModel.create(contentToCreate);
    console.log("✅ Content created successfully:", content);
    
    res.status(201).json({ content });
  } catch (error) {
    console.error("❌ Error creating content:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    // Handle mongoose errors
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ 
        message: "Database error", 
        error: error.message 
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

//@ts-ignore
app.get("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
  const userID = (req as any).userId;
  const content = await ContentModel.find({ userId: userID }).populate("userId", "username");
  res.status(200).json({ content });
});

//@ts-ignore
app.delete("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    const userId = (req as any).userId;

    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    // Find the content and verify ownership
    const content = await ContentModel.findOne({ _id: contentId, userId });
    
    if (!content) {
      return res.status(404).json({ message: "Content not found or unauthorized" });
    }

    // Delete the content
    await ContentModel.deleteOne({ _id: contentId, userId });
    
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting content:", error);
    res.status(500).json({ 
      message: "Failed to delete content", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});
//@ts-ignore
app.post("/api/v1/brain/share", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    const userId = (req as any).userId;

    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    // Verify content exists and user has access
    const content = await ContentModel.findOne({ _id: contentId, userId });
    if (!content) {
      return res.status(404).json({ message: "Content not found or unauthorized" });
    }

    // Generate a unique share link
    const shareLink = `${contentId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create or update share link
    const link = await LinkModel.findOneAndUpdate(
      { contentId, userId },
      {
        url: shareLink,
        title: content.title,
        userId,
        contentId
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      message: "Content shared successfully", 
      shareLink: `http://localhost:5173/shared/${shareLink}`,
      link 
    });
  } catch (error) {
    console.error("Error sharing content:", error);
    res.status(500).json({ message: "Failed to share content" });
  }
});
//@ts-ignore
app.get("/api/v1/brain/:shareLink", authMiddleware, async (req: Request, res: Response) => {
  const shareLink = req.params.shareLink;
  const link = await LinkModel.findOne({ url: shareLink });
  
  if (!link) {
    return res.status(404).json({ message: "Link not found" });
  }
  
  const content = await ContentModel.find({ _id: link.contentId }).populate("userId", "username");
  res.status(200).json({ content });
});

// ========================== START SERVER ==========================
// Connect to MongoDB first, then start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 API Documentation:`);
      console.log(`   Health check: GET http://localhost:${PORT}/api/health`);
      console.log(`   Signup: POST http://localhost:${PORT}/api/v1/signup`);
      console.log(`   Signin: POST http://localhost:${PORT}/api/v1/signin`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
