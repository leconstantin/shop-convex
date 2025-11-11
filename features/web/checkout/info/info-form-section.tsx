import { api } from "@/convex/_generated/api";
import BreadCrumbCheckout from "../bread-crumb";
import { InfoForm } from "./info-form";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
export default async function CheckoutInfoFormSection() {
  const user = await preloadQuery(
    api.auth.loggedInUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
  return (
    <div className="border-t px-4 py-6 md:border-t-0 md:border-r md:p-9 dark:border-[#333333]">
      <BreadCrumbCheckout />
      <InfoForm preloadedUser={user} />
    </div>
  );
}
