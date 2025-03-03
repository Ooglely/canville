import { eq, and } from "drizzle-orm";
import { cityTable, buildingTable, upgrade_levels, store } from "./schema";
import { db } from "./index";

export type StoredCity = typeof cityTable.$inferSelect;
export type StoredBuilding = typeof buildingTable.$inferSelect;

export async function addCity(ownerId: string, cityMoney: number) {
  const newCity = await db.insert(cityTable).values({ ownerId: ownerId, citymoney: cityMoney, citytotalmoney: cityMoney }).returning();
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
  const cities = await db.query.cityTable.findMany({
    with: {
      buildings: true,
      owner: true,
    },
  });
  const clean_cities = cities.map((city) => {
    const { owner, ...rest } = city;
    return {
      ...rest,
      owner: {
        id: owner.id,
        data: {
          name: owner.data.name,
        },
      },
    };
  });
  return clean_cities;
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

export async function checkPrice(cityId: number, item: string): Promise<boolean> {
  const playermoney = await getCityMoney(cityId);
  const cost = await getCost(item);
  if (playermoney < cost) {
    return false;
  }
  return true;
}

export async function getCost(item: string) {
  const result = await db.select().from(store).where(eq(store.itemname, item));
  if (result.length === 0) {
    throw new Error(`Item ${item} does not exist in the store.`);
  }
  console.log(`Cost for item ${item}: ${result[0].cost}`);
  return result[0].cost;
}

export async function getupgradelevel(cityId: number, upgradeName: string) {
  const result = await db
    .select()
    .from(upgrade_levels)
    .where(and(eq(upgrade_levels.cityid, cityId), eq(upgrade_levels.upgrade_name, upgradeName)));
  if (result.length === 0) {
    throw new Error(`Upgrade ${upgradeName} does not exist in city ${cityId}`);
  }
  console.log(`Level of upgrade ${upgradeName} in city ${cityId}: ${result[0].level}`);
  return result[0].level;
}

export async function upgrade(cityId: number, upgradeName: string) {
  const city = await db.select().from(cityTable).where(eq(cityTable.cityid, cityId));
  if (city.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }

  const upgrades = await db.select().from(upgrade_levels).where(eq(upgrade_levels.cityid, cityId));
  let upgrade = upgrades.find((upg) => upg.upgrade_name === upgradeName);

  if (!upgrade) {
    const upgrade = await db.insert(upgrade_levels).values({ cityid: cityId, upgrade_name: upgradeName, level: 1 }).returning();
    console.log(`Added new upgrade ${upgradeName} for city ${cityId} with level 1`);
  } else {
    upgrade.level += 1;
    await db
      .update(upgrade_levels)
      .set({ level: upgrade.level })
      .where(and(eq(upgrade_levels.cityid, cityId), eq(upgrade_levels.upgrade_name, upgradeName)));
    console.log(`Upgraded ${upgradeName} in city ${cityId} to level ${upgrade.level}`);
  }

  return upgrade;
}

export async function setCityTotalMoney(cityId: number, newTotalMoney: number) {
  const updated = await db.update(cityTable).set({ citytotalmoney: newTotalMoney }).where(eq(cityTable.cityid, cityId)).returning();
  if (updated.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Updated total money for city ID ${cityId} to ${newTotalMoney}`);

  return updated[0];
}

export async function getCityTotalMoney(cityId: number) {
  const result = await db.select({ citytotalmoney: cityTable.citytotalmoney }).from(cityTable).where(eq(cityTable.cityid, cityId));
  if (result.length === 0) {
    throw new Error(`City with ID ${cityId} does not exist.`);
  }
  console.log(`Total money for city ID ${cityId}: ${result[0].citytotalmoney}`);
  return result[0].citytotalmoney;
}
