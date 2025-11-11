import type { Metadata } from "next";
import CheckoutCartItems from "@/features/web/checkout/cart-items";
import CheckoutCartItemsMobile from "@/features/web/checkout/cart-items-mobile";
import CheckoutShippingFormSection from "@/features/web/checkout/shipping/ship-form-section";
import { preloadQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Shipping - Checkout",
  description: "Choose how you want the products to be delivered to you.",
};

export default async function CheckOutShippingPage() {
  const checkoutSession = await preloadQuery(
    api.checkout.getSession,
    {},
    { token: await convexAuthNextjsToken() },
  );
  return (
    <div className="relative mx-auto w-full max-w-[1536px] px-0 py-4 md:px-4">
      <div className="relative mx-auto grid max-w-2xl grid-cols-1 rounded-lg border border-neutral-200 bg-white lg:max-w-7xl lg:grid-cols-2 dark:border-neutral-800 dark:bg-black">
        <CheckoutCartItemsMobile />
        <CheckoutShippingFormSection preloadedSesion={checkoutSession} />
        <CheckoutCartItems />
      </div>
    </div>
  );
}
