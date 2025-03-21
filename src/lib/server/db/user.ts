import { db } from "./index";
import { userTable } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import { CanvasApi, type UserData } from "$lib/canvas/api";
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

export const addUser = async (token: string, cash: number) => {
  // Should check if the user already exists before calling this!
  const id = createId();
  let user_data: UserData;
  if (token.startsWith("dummy_")) {
    user_data = {
      id: 1234567,
      name: token.split("_")[1],
      courses: [],
    };
  } else {
    const api = new CanvasApi(token);
    user_data = await api.getUserData();
  }

  await db.insert(userTable).values({ id, token, data: user_data });
  await addCity(id, cash);
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
