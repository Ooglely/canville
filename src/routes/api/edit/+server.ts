import type { RequestHandler } from "./$types";
import type { StoreItem } from "$lib/server/db/store";
import type { StoredCity } from "$lib/server/db/city";
import { json } from "@sveltejs/kit";
import { addBuilding } from "$lib/server/db/city";

interface EditProps {
  city: StoredCity;
  item: StoreItem;
  x: number;
  y: number;
}

export const POST: RequestHandler = async ({ request }) => {
  const { city, item, x, y }: EditProps = await request.json();
  console.log(city, item, x, y);
  const new_building = await addBuilding(city.cityid, item.sprite, item.width, item.height, x, y);
  return json(new_building);
};
