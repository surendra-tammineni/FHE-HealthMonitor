import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/health-data", async (req, res) => {
    try {
      const validatedData = insertHealthDataSchema.parse(req.body);
      const healthData = await storage.createHealthData(validatedData);
      res.json(healthData);
    } catch (error: any) {
      console.error("Error creating health data:", error);
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.get("/api/health-data/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const healthData = await storage.getHealthDataByWallet(walletAddress);
      res.json(healthData);
    } catch (error: any) {
      console.error("Error fetching health data:", error);
      res.status(500).json({ error: "Failed to fetch health data" });
    }
  });

  app.patch("/api/health-data/:id/transaction", async (req, res) => {
    try {
      const { id } = req.params;
      const { txHash, txStatus } = req.body;

      if (!txHash || !txStatus) {
        return res.status(400).json({ error: "txHash and txStatus are required" });
      }

      const updatedData = await storage.updateHealthDataTransaction(id, txHash, txStatus);

      if (!updatedData) {
        return res.status(404).json({ error: "Health data not found" });
      }

      res.json(updatedData);
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.get("/api/health-data", async (req, res) => {
    try {
      const healthData = await storage.getAllHealthData();
      res.json(healthData);
    } catch (error: any) {
      console.error("Error fetching all health data:", error);
      res.status(500).json({ error: "Failed to fetch health data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
