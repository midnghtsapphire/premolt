import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * AI Agents submitted for verification
 */
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 255 }).notNull().unique(),
  userId: int("userId").references(() => users.id),
  publicKey: text("publicKey"),
  soulConfig: json("soulConfig").$type<Record<string, any>>(),
  status: mysqlEnum("status", ["pending", "verified", "rejected", "scanning"]).default("pending").notNull(),
  safetyScore: int("safetyScore").default(0),
  safetyHash: varchar("safetyHash", { length: 255 }),
  verificationUrl: varchar("verificationUrl", { length: 500 }),
  affiliateLink: text("affiliateLink"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

/**
 * Verification history and scan results
 */
export const verifications = mysqlTable("verifications", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull().references(() => agents.id),
  scanType: varchar("scanType", { length: 100 }).notNull(),
  result: mysqlEnum("result", ["pass", "fail", "warning"]).notNull(),
  details: json("details").$type<Record<string, any>>(),
  scanLogs: json("scanLogs").$type<Array<{ timestamp: string; message: string; level: string }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;

/**
 * Skills that can be installed by agents
 */
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  skillName: varchar("skillName", { length: 255 }).notNull().unique(),
  description: text("description"),
  version: varchar("version", { length: 50 }),
  repository: varchar("repository", { length: 500 }),
  skillHash: varchar("skillHash", { length: 255 }).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  isMalicious: boolean("isMalicious").default(false).notNull(),
  safetyRating: int("safetyRating").default(50),
  downloadCount: int("downloadCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Agent skills relationship
 */
export const agentSkills = mysqlTable("agentSkills", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull().references(() => agents.id),
  skillId: int("skillId").notNull().references(() => skills.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentSkill = typeof agentSkills.$inferSelect;
export type InsertAgentSkill = typeof agentSkills.$inferInsert;

/**
 * Known malware database
 */
export const malwareDatabase = mysqlTable("malwareDatabase", {
  id: int("id").autoincrement().primaryKey(),
  malwareHash: varchar("malwareHash", { length: 255 }).notNull().unique(),
  malwareName: varchar("malwareName", { length: 255 }),
  description: text("description"),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  source: varchar("source", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MalwareEntry = typeof malwareDatabase.$inferSelect;
export type InsertMalwareEntry = typeof malwareDatabase.$inferInsert;
