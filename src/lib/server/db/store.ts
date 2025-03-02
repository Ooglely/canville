import { store } from "./schema";
import { db } from "./index";

export type StoreItem = typeof store.$inferInsert;

export async function getStoreItems(ownerId: number) {
  const items = await db.query.store.findMany();
  return items;
}
