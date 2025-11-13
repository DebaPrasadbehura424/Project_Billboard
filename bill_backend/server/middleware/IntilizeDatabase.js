import { initializeAuthorityDatabase } from "../model/AuthorityModel.js";
import { initializeCitizenDatabase } from "../model/citizenModel.js";
import { initializeReportDatabase } from "../model/reportModel.js";
export async function intilizeDatabase() {
  await initializeCitizenDatabase();
  await initializeReportDatabase();
  await initializeAuthorityDatabase();
  console.log("✅ Database is ready");
}
