import type { Product } from "@/shopify/types";
import Prose from "./prose";
import { VariantSelector } from "./variant-selector";
import Price from "@/components/custom/price";
import { AddToCart } from "@/components/cart/add-to-cart";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 font-medium text-3xl lg:text-5xl">
          {product.title}
        </h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/60"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
