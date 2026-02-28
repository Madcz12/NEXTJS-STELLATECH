import { Polar } from "@polar-sh/sdk";
import * as dotenv from "dotenv";

dotenv.config();

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

async function getOrg() {
  try {
    const orgs = await polar.organizations.list();
    if (orgs.items && orgs.items.length > 0) {
      console.log("ORGANIZATION_ID=" + orgs.items[0].id);
    } else {
      console.log("No organizations found for this token.");
    }
  } catch (error) {
    console.error("Error fetching orgs:", error);
  }
}

getOrg();
