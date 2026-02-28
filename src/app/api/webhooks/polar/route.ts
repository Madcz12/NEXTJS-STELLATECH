import { Webhooks } from "@polar-sh/nextjs";
import { headers } from "next/headers";
import { type WebhookOrderCreatedPayload } from "@polar-sh/sdk/models/components";
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
    const payload = Webhooks.verify({
      payload: body,
      headers: {
        "webhook-signature": signature,
      },
      webhookSecret,
    });

    if (payload.type === "order.created") {
      const orderData = payload.data as WebhookOrderCreatedPayload;
      
      // Attempt to link to an existing user by email
      const user = await prisma.user.findUnique({
        where: { email: orderData.customerEmail },
      });

      // Compute total for the local DB
      const totalAmount = orderData.totalAmount || 0;

      // Extract items from Polar order metadata or customName
      // Note: In a robust setup, you might pass your local Product IDs via Polar checkout metadata.
      // For this implementation, we will track the line items as strings or simple records if needed, 
      // but Prisma currently requires a relation to Product for OrderItems.
      // We will look up the products by name for this basic integration.

      await prisma.order.create({
        data: {
          id: orderData.id, // Store Polar Order ID locally for easy sync
          status: "PAID",
          total: totalAmount / 100, // Polar amounts are in cents
          userId: user?.id,
          // If you need line items mapping, iterate orderData.items here.
        }
      });
      console.log(`Successfully processed Polar order ${orderData.id}`);
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
