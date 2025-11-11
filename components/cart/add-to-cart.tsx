"use client";

import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import type { Product, ProductVariant } from "@/shopify/types";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  onClick,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick: () => void;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button
        className={clsx(buttonClasses, disabledClasses)}
        disabled
        type="button"
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        className={clsx(buttonClasses, disabledClasses)}
        disabled
        type="button"
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
      onClick={onClick}
      type="button"
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const { variants, availableForSale } = product;
  const addToCart = useMutation(api.cart.addToCart);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const dbProduct = useQuery(api.products.getProductByShopifyId, {
    shopifyId: product.id,
  });

  // Get selected option values as an array (e.g. ["Black", "XS"])
  const selectedOptions = product.options
    .map((option) => searchParams.get(option.name.toLowerCase()))
    .filter((v): v is string => v !== null);

  // Build state object from searchParams for option lookup
  const state = product.options.reduce<{ [key: string]: string }>(
    (acc, option) => {
      const value = searchParams.get(option.name.toLowerCase());
      if (value) acc[option.name.toLowerCase()] = value;
      return acc;
    },
    {},
  );

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()],
    ),
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  if (!dbProduct) return null;

  const handleAddToCart = async () => {
    const quantity = 1;
    if (!loggedInUser) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    try {
      await addToCart({
        productId: dbProduct._id,
        quantity,
        selectedVariant: finalVariant?.title,
      });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  return (
    <div>
      <SubmitButton
        availableForSale={availableForSale}
        onClick={handleAddToCart}
        selectedVariantId={selectedVariantId}
      />
      {/* {selectedOptions && selectedOptions}
      {finalVariant?.title}
      {product.variants.map((p, i) => (
        <p key={i}>{p.title}</p>
      ))} */}
    </div>
  );
}
