import { pgTable, text, char, json, serial, integer, varchar } from "drizzle-orm/pg-core";
import type { UserData } from "$lib/canvas/api";
import { relations } from "drizzle-orm";

export const userTable = pgTable("user", {
  id: char("id", { length: 36 }).primaryKey(),
  token: text("token").notNull(),
  data: json().$type<UserData>().notNull(),
});

export const userRelations = relations(userTable, ({ one }) => ({
  cities: one(cityTable, {
    fields: [userTable.id],
    references: [cityTable.ownerId],
  }),
}));

export const cityTable = pgTable("city", {
  ownerId: char("ownerId", { length: 36 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
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
