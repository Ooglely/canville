import { pgTable, text, char, json, serial, integer, varchar, primaryKey } from "drizzle-orm/pg-core";
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

export const cityRelations = relations(cityTable, ({ one, many }) => ({
  buildings: many(buildingTable),
  owner: one(userTable, {
    fields: [cityTable.ownerId],
    references: [userTable.id],
  }),
}));

export const buildingTable = pgTable("building", {
  buildingid: serial("buildingid").primaryKey(),
  cityid: integer("cityid")
    .notNull()
    .references(() => cityTable.cityid, { onDelete: "cascade" }),
  sprite: varchar({ length: 255 }).notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const buildingRelations = relations(buildingTable, ({ one }) => ({
  city: one(cityTable, {
    fields: [buildingTable.cityid],
    references: [cityTable.cityid],
  }),
}));

export const upgrade_levels = pgTable("upgradelevel", {
  cityid: integer("cityid")
    .notNull()
    .references(() => cityTable.cityid, { onDelete: "cascade" }),
  upgrade_name: varchar({ length: 255 }).notNull(),
  level: integer("level").notNull(),
});

export const store = pgTable("store", {
  itemname: varchar({ length: 255 }).primaryKey().notNull(),
  sprite: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  cost: integer("cost").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
});
