"use server";

import type { Stripe } from "stripe";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function createYearlyCheckoutSession(
  data: FormData
): Promise<void> {
  const userId = data.get("userId") as string;
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      mode: "subscription",
      metadata: {
        userId,
      },
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_YEARLY_PRODUCT_ID,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      success_url: `${headers().get(
        "origin"
      )}/successful-purchase?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get("origin")}/tools/history`,
    });

  redirect(checkoutSession.url as string);
}
export async function createLifetimeCheckoutSession(
  data: FormData
): Promise<void> {
  const userId = data.get("userId") as string;
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      mode: "payment",
      metadata: {
        userId,
      },
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_LIFETIME_PRODUCT_ID,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      success_url: `${headers().get(
        "origin"
      )}/successful-purchase?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get("origin")}/tools/history`,
    });

  redirect(checkoutSession.url as string);
}