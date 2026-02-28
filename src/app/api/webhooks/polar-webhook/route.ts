import { validateEvent } from "@polar-sh/sdk/webhooks";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("Missing POLAR_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("webhook-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const payload = validateEvent(body, { "webhook-signature": signature }, webhookSecret);

    if (payload.type === "order.created") {
      const order = payload.data;
      
      // Attempt to link to an existing user by email
      const user = await prisma.user.findUnique({
        where: { email: order.customer.email },
      });

      // Compute total for the local DB
      const totalAmount = order.totalAmount || 0;

      // Extract items from Polar order metadata or customName
      // Note: In a robust setup, you might pass your local Product IDs via Polar checkout metadata.
      // For this implementation, we will track the line items as strings or simple records if needed, 
      // but Prisma currently requires a relation to Product for OrderItems.
      // We will look up the products by name for this basic integration.

      await prisma.order.create({
        data: {
          id: order.id, // Store Polar Order ID locally for easy sync
          status: "PAID",
          total: totalAmount / 100, // Polar amounts are in cents
          userId: user?.id,
          // If you need line items mapping, iterate order.items here.
        }
      });
      console.log(`Successfully processed Polar order ${order.id}`);
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
