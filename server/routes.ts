import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exerciseSession } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Store exercise session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const newSession = await storage.createExerciseSession(sessionData);
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get past exercise sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getExerciseSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
