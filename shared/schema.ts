import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const healthData = pgTable("health_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  dataType: text("data_type").notNull(),
  value: integer("value").notNull(),
  unit: text("unit").notNull(),
  txHash: text("tx_hash"),
  txStatus: text("tx_status").notNull().default("pending"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHealthDataSchema = createInsertSchema(healthData).omit({
  id: true,
  timestamp: true,
}).extend({
  value: z.number().int().positive(),
  dataType: z.enum(["heartRate", "bloodPressure", "glucose", "steps", "weight", "sleep"]),
  unit: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HealthData = typeof healthData.$inferSelect;
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;
