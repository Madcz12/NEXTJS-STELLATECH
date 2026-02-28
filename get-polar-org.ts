import { Polar } from "@polar-sh/sdk";
import * as dotenv from "dotenv";

dotenv.config();

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

async function getOrg() {
  try {
    const res = await polar.organizations.list({});
    if (res.result.items && res.result.items.length > 0) {
      console.log("ORGANIZATION_ID=" + res.result.items[0].id);
    } else {
      console.log("No organizations found for this token.");
    }
  } catch (error) {
    console.error("Error fetching orgs:", error);
  }
}

getOrg();
