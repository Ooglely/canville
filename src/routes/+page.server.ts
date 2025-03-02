import type { PageServerLoad, Actions } from "./$types";
import { CanvasApi } from "$lib/canvas/api";
import { addUser, getUserFromSession, getUserFromToken, getAllUsers } from "$lib/server/db/user";

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get("session");
  const all_users = await getAllUsers();
  if (!session) {
    return {
      user: null,
      all_users,
    };
  }

  const user = await getUserFromSession(session);
  console.log(all_users);
  return {
    user,
    all_users,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const token = data.get("token") as string;
    if (!token) {
      return {
        status: 400,
        error: "No token provided",
      };
    }

    // See if token already exists in the database
    const user = await getUserFromToken(token);
    if (user) {
      cookies.set("session", user.id, { path: "/" });
      return {
        status: 200,
        user,
      };
    }

    // Token doesn't exist, create a new user in the db
    try {
      var api = new CanvasApi(token);
      const user = await addUser(token);
      cookies.set("session", user.id, { path: "/" });
      return {
        status: 200,
        user,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: "Failed to authenticate with Canvas API, invalid token?",
      };
    }
  },
};
