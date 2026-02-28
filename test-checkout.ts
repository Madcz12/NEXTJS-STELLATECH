import { Polar } from "@polar-sh/sdk";
import * as dotenv from "dotenv";

dotenv.config();

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID;

async function testCheckout() {
  try {
    const { url } = await polar.checkouts.custom.create({
      organizationId: ORGANIZATION_ID as string,
      items: [{
        customPrice: 1000,
        customName: "Test Item",
        quantity: 1,
      }],
      successUrl: "http://localhost:3000/orders",
    });
    console.log("Success:", url);
  } catch (error) {
    console.error("Error:", error);
  }
}

testCheckout();
