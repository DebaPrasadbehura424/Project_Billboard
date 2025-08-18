import { initializeCitizenDatabase } from "../model/citizenModel.js";
import { initializeReportDatabase } from "../model/reportModel.js";
export async function intilizeDatabase() {
  await initializeCitizenDatabase();
  await initializeReportDatabase();
  console.log("✅ Database is ready");
}
