import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
import { eq } from 'drizzle-orm';
import { city, building } from './schema.ts';

export async function addCity(cityMoney: number) {
  const newCity = await db.insert(city).values({ citymoney: cityMoney }).returning();
  console.log(`New city created with ID: ${newCity[0].cityid} and money: ${cityMoney}`);
  return newCity[0];
}

export async function addBuilding(cityId: number, sprite: string, size: string, x: number, y: number) {
  const cityExists = await db.select().from(city).where(eq(city.cityid, cityId));
  if (cityExists.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }

  const newBuilding = await db.insert(building).values({
    cityid: cityId,
    sprite,
    size,
    x,
    y,
  }).returning();

  console.log(`New building created in city ${cityId} with ID: ${newBuilding[0].buildingid}`);
  return newBuilding[0];
}

export async function getAllCities() {
  const cities = await db.select().from(city);
  console.log('Retrieved all cities:', cities);
  return cities;
}

export async function getBuildingsInCity(cityId: number) {
  const buildings = await db.select().from(building).where(eq(building.cityid, cityId));
  console.log(`Retrieved buildings for city ID ${cityId}:`, buildings);
  return buildings;
}

export async function getCityMoney(cityId: number) {
  const result = await db.select({ citymoney: city.citymoney }).from(city).where(eq(city.cityid, cityId));
  if (result.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Money for city ID ${cityId}: ${result[0].citymoney}`);
  return result[0].citymoney;
}

export async function setCityMoney(cityId: number, newMoney: number) {
  const updated = await db.update(city).set({ citymoney: newMoney }).where(eq(city.cityid, cityId)).returning();
  if (updated.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Updated money for city ID ${cityId} to ${newMoney}`);
  return updated[0];
}