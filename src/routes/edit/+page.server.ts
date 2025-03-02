import type { PageServerLoad } from "./$types";
import type { StoredBuilding } from "$lib/server/db/city";
import { getUserFromSession } from "$lib/server/db/user";
import { getBuildingsInCity } from "$lib/server/db/city";
import { getStoreItems } from "$lib/server/db/store";
import { redirect } from "@sveltejs/kit";
import { CanvasApi } from "$lib/canvas/api";
import { getCityMoney, getCityTotalMoney, setCityMoney, setCityTotalMoney } from "$lib/server/db/city";

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get("session");
  let buildings: StoredBuilding[] = [];
  if (!session) {
    redirect(307, "/");
  }

  const user = await getUserFromSession(session);
  if (!user) {
    cookies.delete("session", { path: "/" });
    redirect(307, "/");
  }

  const city_id = user.cities.cityid;
  buildings = await getBuildingsInCity(city_id);
  const store = await getStoreItems(city_id);

  //Adds money from new graded assignments on page open
  //This works but the creating a new CanvasApi takes a few seconds to load, 
  //if possible may want to adjust to avoid creating a new instance to speed up loading

  // const api = new CanvasApi(user.token);
  // const gradecash = (await api.getGradedAssignments()) ?? 0;
  // const currentTotal = (await getCityTotalMoney(city_id)) ?? 0;
  // const currentCash = (await getCityMoney(city_id)) ?? 0;
  
  // const newCash = gradecash - currentTotal + currentCash;
  // await setCityMoney(city_id, newCash);
  // await setCityTotalMoney(city_id, gradecash);


  return {
    user,
    buildings,
    store,
  };
};
