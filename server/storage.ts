import { type User, type InsertUser, type HealthData, type InsertHealthData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createHealthData(data: InsertHealthData): Promise<HealthData>;
  getHealthDataByWallet(walletAddress: string): Promise<HealthData[]>;
  updateHealthDataTransaction(id: string, txHash: string, txStatus: string): Promise<HealthData | undefined>;
  getAllHealthData(): Promise<HealthData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private healthData: Map<string, HealthData>;

  constructor() {
    this.users = new Map();
    this.healthData = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createHealthData(insertData: InsertHealthData): Promise<HealthData> {
    const id = randomUUID();
    const data: HealthData = {
      id,
      ...insertData,
      timestamp: new Date(),
    };
    this.healthData.set(id, data);
    return data;
  }

  async getHealthDataByWallet(walletAddress: string): Promise<HealthData[]> {
    return Array.from(this.healthData.values())
      .filter((data) => data.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateHealthDataTransaction(
    id: string,
    txHash: string,
    txStatus: string
  ): Promise<HealthData | undefined> {
    const data = this.healthData.get(id);
    if (data) {
      data.txHash = txHash;
      data.txStatus = txStatus;
      this.healthData.set(id, data);
      return data;
    }
    return undefined;
  }

  async getAllHealthData(): Promise<HealthData[]> {
    return Array.from(this.healthData.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
