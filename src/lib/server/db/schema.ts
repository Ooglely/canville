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

export const buildingTable = pgTable("building", {
  buildingid: serial("buildingid").primaryKey(),
  cityid: integer("cityid")
    .notNull()
    .references(() => cityTable.cityid, { onDelete: "cascade" }),
  sprite: varchar({ length: 255 }).notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const upgrade_levels = pgTable('upgradelevel', {
    cityid: integer('cityid').notNull().references(() => cityTable.cityid, { onDelete: 'cascade' }),
    chungus_level: integer('level').notNull(),
    big_chungus_level: integer('level').notNull(),
    bigbig_chungus_level: integer('level').notNull()
});

export const store = pgTable('store', {
    itemname: varchar({ length: 255 }).notNull(),
    sprite: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    cost: integer('cost').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull()
});