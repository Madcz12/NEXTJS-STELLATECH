const { Polar } = require("@polar-sh/sdk");

const polar = new Polar({
  accessToken: "polar_oat_GSPYUlPSVs11kskUl5srdoSNSenjTWAdZWB7J3PpMsc",
});
const orgId = "d1f46524-30f5-4c01-a9e7-f683e91a4067";

async function run() {
  try {
    const product = await polar.products.create({
      organizationId: orgId,
      name: "Stella.Tech Shopping Cart",
      prices: [{ amountType: "fixed", priceAmount: 1000, priceCurrency: "usd" }],
    });
    console.log("Created Product:", product.id);

    const checkout = await polar.checkouts.create({
      products: [product.id],
      amount: 1000,
      successUrl: "http://localhost:3000/orders",
    });
    console.log("Created Checkout:", checkout.url);
  } catch (err) {
    console.error(err);
  }
}

run();
