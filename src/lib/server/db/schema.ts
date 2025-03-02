import { pgTable, text, char, json, serial, integer, varchar } from "drizzle-orm/pg-core";
import type { UserData } from "$lib/canvas/api";

export const userTable = pgTable("user", {
  id: char("id", { length: 36 }).primaryKey(),
  token: text("token").notNull(),
  data: json().$type<UserData>().notNull(),
});

export const cityTable = pgTable("city", {
  cityid: serial("cityid").primaryKey(),
  citymoney: integer("citymoney").notNull(),
});

export const buildingTable = pgTable("building", {
  buildingid: serial("buildingid").primaryKey(),
  cityid: integer("cityid")
    .notNull()
    .references(() => cityTable.cityid, { onDelete: "cascade" }),
  sprite: varchar({ length: 255 }).notNull(),
  size: varchar({ length: 255 }).notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});
