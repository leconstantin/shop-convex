"use client";
import { useRouter } from "next/navigation";
import BreadCrumbCheckout from "../bread-crumb";
import ContactShipSummary from "../contact-ship-summary";
import ShipPrice from "./ship-price";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CheckoutShippingFormSection(props: {
  preloadedUser: Preloaded<typeof api.auth.loggedInUser>;
}) {
  const router = useRouter();
  const user = usePreloadedQuery(props.preloadedUser);
  return (
    <div className="border-t px-4 py-6 md:border-t-0 md:border-r md:p-9 dark:border-[#333333]">
      <BreadCrumbCheckout />
      <ContactShipSummary
        address={{
          city: user?.city,
          state: user?.apartment,
          zip: user?.road_number,
          country: user?.country,
        }}
        email={user?.email ?? ""}
        onChangeContact={() => router.push("/checkout/information")}
        onChangeShipping={() => router.push("/checkout/information")}
      />
      <ShipPrice />
    </div>
  );
}
