import type { RequestHandler } from "./$types";
import { CanvasApi } from "$lib/canvas/api";
import { getCityMoney, getCityTotalMoney, setCityMoney, setCityTotalMoney } from "$lib/server/db/city";
import { getUserFromSession } from "$lib/server/db/user";
import { json } from "@sveltejs/kit";

interface UpdateProps {
  city_id: number;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  // Adds money from new graded assignments on page open
  // This works but the creating a new CanvasApi takes a few seconds to load
  const session = cookies.get("session");
  if (!session) {
    return json({ cash: 0 });
  }
  const user = await getUserFromSession(session);
  if (!user) {
    return json({ cash: 0 });
  }

  const { city_id }: UpdateProps = await request.json();
  const api = new CanvasApi(user.token);
  const gradecash = (await api.getGradedAssignments()) ?? 0;
  const currentTotal = (await getCityTotalMoney(city_id)) ?? 0;
  const currentCash = (await getCityMoney(city_id)) ?? 0;

  console.log(gradecash, currentTotal, currentCash);
  const newCash = gradecash - currentTotal + currentCash;

  await setCityMoney(city_id, newCash);
  await setCityTotalMoney(city_id, gradecash);

  console.log(newCash);
  return json({ cash: newCash });
};
