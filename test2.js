const { Polar } = require("@polar-sh/sdk");

const polar = new Polar({
  accessToken: "polar_oat_GSPYUlPSVs11kskUl5srdoSNSenjTWAdZWB7J3PpMsc",
});

async function run() {
  try {
    const res = await polar.checkouts.custom.create({
      organizationId: "d1f46524-30f5-4c01-a9e7-f683e91a4067",
      items: [{
        customPrice: 1000,
        customName: "Test Item",
        quantity: 1
      }],
      successUrl: "http://localhost:3000/orders",
    });
    console.log("Success", res);
  } catch (err) {
    if (err.response) {
      console.error("HTTP Error:", err.response.status, err.response.statusText);
      const text = await err.response.text();
      console.error("Body:", text);
    } else {
      console.error("Error:", err);
    }
  }
}

run();
