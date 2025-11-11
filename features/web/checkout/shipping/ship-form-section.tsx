"use client";
import { useRouter } from "next/navigation";
import BreadCrumbCheckout from "../bread-crumb";
import ContactShipSummary from "../contact-ship-summary";
import ShipPrice from "./ship-price";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CheckoutShippingFormSection(props: {
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
        email={session?.contactEmail ?? ""}
        onChangeContact={() => router.push("/checkout/information")}
        onChangeShipping={() => router.push("/checkout/information")}
      />
      <ShipPrice />
    </div>
  );
}
