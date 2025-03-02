import { db } from "./index";
import { userTable } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import { CanvasApi } from "$lib/canvas/api";
import { addCity } from "./city";

export type StoredUser = typeof userTable.$inferSelect;

export const getUserFromToken = async (token: string) => {
  const result = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.token, token),
    with: {
      cities: true,
    },
  });
  return result;
};

export const getUserFromSession = async (id: string) => {
  const result = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: {
      cities: true,
    },
  });
  return result;
};

export const addUser = async (token: string) => {
  // Should check if the user already exists before calling this!
  const id = createId();
  const api = new CanvasApi(token);
  const user_data = await api.getUserData();
  //const [user] = await db.insert(userTable).values({ id, token, data: user_data }).returning();
  await db.insert(userTable).values({ id, token, data: user_data });
  // TODO: calculate money

  await addCity(id, 8000);
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: {
      cities: true,
    },
  });
};

export const getAllUsers = async () => {
  const users = await db.query.userTable.findMany({
    with: {
      cities: true,
    },
  });
  return users;
};
