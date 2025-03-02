import type { PageServerLoad, Actions } from "./$types";
import { CanvasApi } from "$lib/canvas/api";
import { fail } from "@sveltejs/kit";
import { addUser, getUserFromSession, getUserFromToken, getAllUsers } from "$lib/server/db/user";
import { getAllCities } from "$lib/server/db/city";

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get("session");
  const all_cities = await getAllCities();
  if (!session) {
    return {
      user: null,
      all_cities,
    };
  }
  console.log(await getAllCities());
  const user = await getUserFromSession(session);
  return {
    user,
    all_cities,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const token = data.get("token") as string;
    if (!token) {
      return fail(400, { failure: true, error: "No token provided" });
    }

    // See if token already exists in the database
    const user = await getUserFromToken(token);
    if (user) {
      cookies.set("session", user.id, { path: "/", secure: false });
      return {
        status: 200,
        user,
      };
    }

    // Token doesn't exist, create a new user in the db
    var api = new CanvasApi(token);
    if (!(await api.isValid())) {
      return fail(400, { failure: true, error: "Failed to authenticate with Canvas API, invalid token?" });
    }
    console.log("valid");
    const cash = await api.getGradedAssignments();
    const new_user = await addUser(token, cash);
    cookies.set("session", new_user.id, { path: "/", secure: false, httpOnly: false });
    return {
      status: 200,
      user,
    };
  },
};
