import { CanvasApi } from "$lib/canvas/api";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const canvasApi = new CanvasApi("16765~yzzz8MY8rLHeA2Mwrf2VLV8NTy3xcVMvhzZWAutGPAWtFVcuVnTANZM8hwTfcUT2");
  const user_data = await canvasApi.getUserData();
  return new Response(JSON.stringify(user_data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
