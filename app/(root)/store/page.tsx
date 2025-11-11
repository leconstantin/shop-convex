import { StoreDashboard } from "@/components/custom/store-dashboard";
import { getProducts } from "@/shopify";

export default async function StorePage() {
  const products = await getProducts({ query: "" });
  return (
    <div className="max-w-7xl mx-auto">
      <StoreDashboard products={products} />
    </div>
  );
}
