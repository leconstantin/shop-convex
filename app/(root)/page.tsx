import { ProductCatalog } from "@/components/custom/product-list";
import { HomeCarousel } from "@/features/web/home-carousel";
import { ThreeItemGrid } from "@/features/web/three-item-grids";

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <HomeCarousel />
      <div className="max-w-7xl mx-auto">
        <ProductCatalog />
      </div>
    </>
  );
}
