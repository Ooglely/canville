import { eq } from "drizzle-orm";
import { cityTable, buildingTable } from "./schema";
import { db } from "./index";

export async function addCity(cityMoney: number) {
  const newCity = await db.insert(cityTable).values({ citymoney: cityMoney }).returning();
  console.log(`New city created with ID: ${newCity[0].cityid} and money: ${cityMoney}`);
  return newCity[0];
}

export async function addBuilding(cityId: number, sprite: string, size: string, x: number, y: number) {
  const cityExists = await db.select().from(cityTable).where(eq(cityTable.cityid, cityId));
  if (cityExists.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }

  const newBuilding = await db
    .insert(buildingTable)
    .values({
      cityid: cityId,
      sprite,
      size,
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
