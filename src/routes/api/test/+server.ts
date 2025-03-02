import { addBuilding, addCity, getAllCities, getBuildingsInCity, getCityMoney, setCityMoney} from "$lib/server/db/city.ts";
import type { RequestHandler } from "./$types";
import type { UserData } from "$lib/canvas/api";
import {getUserFromToken} from "$lib/server/db/user.ts";
import {db} from "$lib/server/db/index.ts";
import { store, upgrade_levels, cityTable } from "$lib/server/db/schema";

export const GET: RequestHandler = async ({ url }) => {
  //city/building creation test
  const citiess = await getAllCities();
  const city = citiess[0];

  const test = "chungus"
  const newstoreitem = await db.insert(store).values({ itemname: "chungus", description: "chungus", sprite: "chungus", cost: 2000 }).returning();

  const buildingtest = await addBuilding(city.cityid, "chungushouse.png", "large", 0, 0);
  const buildingtest2 = await addBuilding(city.cityid, "chungus.png", "chungus", 2, 2);
  const buildingtest3 = await addBuilding(city.cityid, "bigchungus.png", "bigchungus", 4, 4);
  const buildingtest4 = await addBuilding(city.cityid, "bigchungus.png", "bigchungus", 4, 4);

  //money tests
  const moneyBefore = await getCityMoney(city.cityid);
  console.log(`Money before update: ${moneyBefore}`);
  await setCityMoney(city.cityid, 8000);
  const moneyAfter = await getCityMoney(city.cityid);
  console.log(`Money after update: ${moneyAfter}`);

  return new Response(JSON.stringify("good"), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
