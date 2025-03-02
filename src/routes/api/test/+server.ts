import { addBuilding, getAllCities, getCityMoney, getupgradelevel, setCityMoney, upgrade} from "$lib/server/db/city.ts";
import type { RequestHandler } from "./$types";
import {db} from "$lib/server/db/index.ts";
import { store, upgrade_levels, cityTable } from "$lib/server/db/schema";

export const GET: RequestHandler = async ({ url }) => {
  //city/building creation test
  const citiess = await getAllCities();
  const city = citiess[0];


  await upgrade(city.cityid, "chungushouse");
  await upgrade(city.cityid, "chungushouse");
  await upgrade(city.cityid, "chungushouse");
  await upgrade(city.cityid, "chungus");

  await getupgradelevel(city.cityid, "chungushouse");
  await getupgradelevel(city.cityid, "chungus");

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
