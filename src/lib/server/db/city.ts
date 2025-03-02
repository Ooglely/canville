import { and, eq } from "drizzle-orm";
import { cityTable, buildingTable, upgrade_levels } from "./schema";
import { db } from "./index";

export async function addCity(ownerId: string, cityMoney: number) {
  const newCity = await db.insert(cityTable).values({ ownerId: ownerId, citymoney: cityMoney }).returning();
  await db.insert(upgrade_levels).values({cityid: newCity[0].cityid, chungus_level:0, big_chungus_level:0, bigbig_chungus_level:0})
  console.log(`New city created with ID: ${newCity[0].cityid} and money: ${cityMoney}`);

  return newCity[0];
}

export async function addBuilding(cityId: number, sprite: string, width: number, height: number, x: number, y: number) {
  const cityExists = await db.select().from(cityTable).where(eq(cityTable.cityid, cityId));
  if (cityExists.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }

  const newBuilding = await db
    .insert(buildingTable)
    .values({
      cityid: cityId,
      sprite,
      width,
      height,
      x,
      y,
    })
    .returning();

  console.log(`New building created in city ${cityId} with ID: ${newBuilding[0].buildingid}`);
  return newBuilding[0];
}

export async function getAllCities() {
  const cities = await db.select().from(cityTable);
  console.log("Retrieved all cities:", cities);
  return cities;
}

export async function getBuildingsInCity(cityId: number) {
  const buildings = await db.select().from(buildingTable).where(eq(buildingTable.cityid, cityId));
  console.log(`Retrieved buildings for city ID ${cityId}:`, buildings);
  return buildings;
}

export async function getCityMoney(cityId: number) {
  const result = await db.select({ citymoney: cityTable.citymoney }).from(cityTable).where(eq(cityTable.cityid, cityId));
  if (result.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Money for city ID ${cityId}: ${result[0].citymoney}`);
  return result[0].citymoney;
}

export async function setCityMoney(cityId: number, newMoney: number) {
  const updated = await db.update(cityTable).set({ citymoney: newMoney }).where(eq(cityTable.cityid, cityId)).returning();
  if (updated.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Updated money for city ID ${cityId} to ${newMoney}`);
  
  return updated[0];
}

//function to check if player has enough money NOT TESTED
export async function checkPrice(cityId: number, cost: number): Promise<boolean> {
  const playermoney = await getCityMoney(cityId);
  if (playermoney < cost) {
    return false;
  }
  return true;
}

//upgrade function NOT TESTED
export async function upgrade(cityId: number, building: string) {
  const city = await db.select().from(cityTable).where(eq(cityTable.cityid, cityId));
  if (city.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  const upgrades = await db.select().from(upgrade_levels).where(eq(upgrade_levels.cityid, cityId));
  if (upgrades.length === 0) {
    throw new Error(`Upgrades for city with ID ${cityId} do not exist.`);
  }
  const upgrade = upgrades[0];
  console.log(`Upgrading city with ID ${cityId} and building ${building}`);

  
  if (building === "chungus") {
    upgrade.chungus_level += 1;
    await db.update(upgrade_levels).set({ chungus_level: upgrade.chungus_level }).where(eq(upgrade_levels.cityid, cityId));
  }
  if (building === "big_chungus") {
    upgrade.big_chungus_level += 1;
    await db.update(upgrade_levels).set({ big_chungus_level: upgrade.big_chungus_level }).where(eq(upgrade_levels.cityid, cityId));
  }
}