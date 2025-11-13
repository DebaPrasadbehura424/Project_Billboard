import { analyzeBillboard } from "../controller/aiModelController.js";

export default async function getAiData(imageBase64, description, coords) {
  return await analyzeBillboard(
    imageBase64,
    description,
    coords.lat,
    coords.lng
  );
}
