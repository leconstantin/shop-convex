"use client";
import { useRouter } from "next/navigation";
// import { useShoppingCart } from "../../cart/cart-context";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { BanknoteXIcon } from "lucide-react";
import BreadCrumbCheckout from "../bread-crumb";
import ContactShipSummary from "../contact-ship-summary";
import { PaymentForm } from "./payment-form";

export default function CheckoutPaymentSection(props: {
  preloadedSesion: Preloaded<typeof api.checkout.getSession>;
}) {
  const router = useRouter();
  const session = usePreloadedQuery(props.preloadedSesion);
  if (session === undefined) {
    return;
  }
  const shipping = session?.shipping_address;
  return (
    <div className="border-t px-4 py-6 md:border-t-0 md:border-r md:p-9 dark:border-[#333333]">
      <BreadCrumbCheckout />
      <ContactShipSummary
        address={{
          city: shipping?.city ?? "",
          state: shipping?.city ?? "",
          road: shipping?.road_number ?? "",
          country: shipping?.country ?? "",
        }}
        email="icon69184@gmail.com"
        onChangeContact={() => router.push("/checkout/information")}
        onChangeMehod={() => router.push("/checkout/shipping")}
        onChangeShipping={() => router.push("/checkout/information")}
        shipping={{
          type: session?.shipping_method ?? "",
          amount: session?.shipping_price ?? 0,
        }}
      />
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground text-xl tracking-tight">
            Payment
          </h3>
          <p className="text-muted-foreground">
            All transactions are secure and encrypted.
          </p>
        </div>
        {false && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-5 rounded-lg bg-muted p-6">
            <BanknoteXIcon className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm tracking-tight">
              This store can&apos;t accept payments right now.
            </p>
          </div>
        )}
        <PaymentForm />
      </section>
    </div>
  );
}
