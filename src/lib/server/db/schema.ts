import { pgTable, text, char, json } from "drizzle-orm/pg-core";
import type { UserData } from "$lib/canvas/api";

export const userTable = pgTable("user", {
  id: char("id", { length: 36 }).primaryKey(),
  token: text("token").notNull(),
  data: json().$type<UserData>().notNull(),
});
