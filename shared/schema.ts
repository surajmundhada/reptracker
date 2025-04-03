import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema for exercise sessions
export const exerciseSession = pgTable("exercise_sessions", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  totalReps: integer("total_reps").notNull(),
  maxAcceleration: text("max_acceleration").notNull(),
  averageRepTime: text("average_rep_time").notNull(),
  sessionDuration: text("session_duration").notNull(),
  accelerationData: jsonb("acceleration_data").notNull()
});

// Insert schema
export const insertExerciseSessionSchema = createInsertSchema(exerciseSession).omit({
  id: true
});

// Types
export type InsertExerciseSession = z.infer<typeof insertExerciseSessionSchema>;
export type ExerciseSession = typeof exerciseSession.$inferSelect;

// Users schema (keeping existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Acceleration Data Point
export const accelerationDataSchema = z.object({
  timestamp: z.number(),
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export type AccelerationDataPoint = z.infer<typeof accelerationDataSchema>;
