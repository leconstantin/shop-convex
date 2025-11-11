"use client";
import { ProductCatalog } from "@/components/custom/product-list";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Shopa
        </h1>
        <p className="text-xl text-gray-600">
          Browse our products and place your orders
        </p>
      </div>
      <ProductCatalog />
    </div>
  );
}
