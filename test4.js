const { Polar } = require("@polar-sh/sdk");

const polar = new Polar({
  accessToken: "polar_oat_GSPYUlPSVs11kskUl5srdoSNSenjTWAdZWB7J3PpMsc",
});
const orgId = "d1f46524-30f5-4c01-a9e7-f683e91a4067";

async function run() {
  try {
    const checkout = await polar.checkouts.create({
      amount: 1000,
      products: [],
      successUrl: "http://localhost:3000/orders",
    });
    console.log("Created Checkout:", checkout.url);
  } catch (err) {
    console.error("Failed to create checkout with amount:", err.response ? err.response.statusText : err.message);
    if(err.response) {
       console.error(await err.response.text());
    }
  }
}

run();
