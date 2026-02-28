"use server"

import { Polar } from "@polar-sh/sdk";
import { auth } from "@/auth";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export async function createCheckoutSession(items: { name: string; price: number; quantity: number }[]) {
  const session = await auth();

  try {
    // Calculate cart total
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const finalTotalCents = Math.round((subtotal + shipping) * 100);

    // Create a dynamic product on Polar representing this cart
    const product = await polar.products.create({
      name: `Stella.Tech Order - ${new Date().toISOString().split('T')[0]}`,
      description: items.map(i => `${i.quantity}x ${i.name}`).join(", "),
      prices: [{
        amountType: "fixed",
        priceAmount: finalTotalCents,
        priceCurrency: "usd",
      }],
    });

    // Create the checkout session linking to this newly created product
    const { url } = await polar.checkouts.create({
      products: [product.id],
      customerEmail: session?.user?.email || undefined,
      customerName: session?.user?.name || undefined,
      successUrl: `${process.env.NEXTAUTH_URL}/orders?status=success&checkout_id={CHECKOUT_ID}`,
    });

    return { url };
  } catch (error) {
    console.error("Polar Checkout Error:", error);
    throw new Error("Failed to create checkout session.");
  }
}

