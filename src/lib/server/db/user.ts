import { db } from "./index";
import { userTable } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import { CanvasApi } from "$lib/canvas/api";

export const getUserFromToken = async (token: string) => {
  const result = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.token, token),
  });
  return result;
};

export const getUserFromSession = async (id: string) => {
  const result = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
  return result;
};

export const addUser = async (token: string) => {
  // Should check if the user already exists before calling this!
  const id = createId();
  const api = new CanvasApi(token);
  const user_data = await api.getUserData();
  const [user] = await db.insert(userTable).values({ id, token, data: user_data }).returning();
  return user;
};
