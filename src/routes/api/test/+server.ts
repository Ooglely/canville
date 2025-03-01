import { addBuilding, addCity, getAllCities, getBuildingsInCity, getCityMoney, setCityMoney } from "../../../lib/server/db/index.ts";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {

//city/building creation test
const city = await addCity(5000);

const buildingtest = await addBuilding(city.cityid, "chungushouse.png", "large", 0, 0);
const buildingtest2 = await addBuilding(city.cityid, "chungus.png", "chungus", 2, 2);
const buildingtest3 = await addBuilding(city.cityid, "bigchungus.png", "bigchungus", 4, 4);
const buildingtest4 = await addBuilding(city.cityid, "bigchungus.png", "bigchungus", 4, 4);

//get cities/buildings test (all cities, all buildings for specified city)
const cities = await getAllCities();
const buildingsInCity = await getBuildingsInCity(city.cityid);

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
