const { Polar } = require("@polar-sh/sdk");

const polar = new Polar({
  accessToken: "polar_oat_GSPYUlPSVs11kskUl5srdoSNSenjTWAdZWB7J3PpMsc",
});
const orgId = "d1f46524-30f5-4c01-a9e7-f683e91a4067";

async function run() {
  try {
    const res = await polar.products.list({ organizationId: orgId });
    console.log("Products found:", res.result.items.length);
    if(res.result.items.length > 0) {
      console.log("First Product ID:", res.result.items[0].id);
    }
  } catch (err) {
    if(err.response) {
      console.error(err.response.statusText);
      console.error(await err.response.text());
    } else {
      console.error(err);
    }
  }
}

run();
