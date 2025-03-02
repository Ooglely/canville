import type { PageServerLoad } from "./$types";
import type { StoredBuilding } from "$lib/server/db/city";
import { getUserFromSession } from "$lib/server/db/user";
import { getBuildingsInCity } from "$lib/server/db/city";
import { getStoreItems } from "$lib/server/db/store";

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get("session");
  let buildings: StoredBuilding[] = [];
  if (!session) {
    return {
      user: null,
      buildings: buildings,
      store: [],
    };
  }

  const user = await getUserFromSession(session);
  if (!user) {
    return {
      user: null,
      buildings: buildings,
      store: [],
    };
  }

  const city_id = user.cities.cityid;
  buildings = await getBuildingsInCity(city_id);
  const store = await getStoreItems(city_id);

  return {
    user,
    buildings,
    store,
  };
};
