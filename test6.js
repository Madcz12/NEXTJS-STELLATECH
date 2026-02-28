const { Polar } = require("@polar-sh/sdk");

const polar = new Polar({
  accessToken: "polar_oat_SUFuiUD0XjTru1d9arYNkbWlFjHBVNwHIE2hS1V5e7W",
});
const orgId = "d1f46524-30f5-4c01-a9e7-f683e91a4067";

async function run() {
  try {
    const product = await polar.products.create({
      organizationId: orgId,
      name: `Test Order - ${new Date().toISOString().split('T')[0]}`,
      description: "Test checkout",
      prices: [{
        amountType: "fixed",
        priceAmount: 1000,
        priceCurrency: "usd",
      }],
    });
    console.log("Created Product:", product.id);

    const checkout = await polar.checkouts.create({
      products: [product.id],
      successUrl: "http://localhost:3000/orders?status=success",
    });
    console.log("Created Checkout:", checkout.url);
  } catch (err) {
    console.error("Failed:", err.response ? err.response.statusText : err.message);
    if(err.response) {
       console.error(await err.response.text());
    } else {
        console.error(err);
    }
  }
}

run();
