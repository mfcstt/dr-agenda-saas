import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  console.log("Webhook recebido:", event.type);
  console.log("Dados do evento:", JSON.stringify(event.data.object, null, 2));

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error("Invoice ID not found");
      }
      const { customer, parent, lines } = event.data.object as unknown as {
        customer: string;
        parent: {
          subscription_details: {
            subscription: string;
          };
        };
        lines: {
          data: Array<{
            metadata: {
              userId: string;
            };
          }>;
        };
      };
      if (!parent?.subscription_details?.subscription) {
        throw new Error("Subscription not found");
      }
      const userId = lines.data[0]?.metadata?.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }

      console.log("Dados para atualização:", {
        userId,
        subscription: parent.subscription_details.subscription,
        customer,
      });

      try {
        const result = await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: parent.subscription_details.subscription,
            stripeCustomerId: customer,
            plan: "essential",
          })
          .where(eq(usersTable.id, userId))
          .returning();

        console.log("Resultado da atualização:", result);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw error;
      }
      break;
    }
    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      );
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const userId = subscription.metadata.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }
      try {
        const result = await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId))
          .returning();

        console.log("Resultado da atualização (deleção):", result);
      } catch (error) {
        console.error("Erro ao atualizar usuário (deleção):", error);
        throw error;
      }
    }
  }
  return NextResponse.json({
    received: true,
  });
};
