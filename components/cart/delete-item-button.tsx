"use client";

import { XIcon } from "lucide-react";

import type { CartItem } from "@/shopify/types";
import { TcartItem } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function DeleteItemButton({ item }: { item: TcartItem }) {
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart({ cartItemId: cartItemId as any });
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };
  return (
    <div>
      <button
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-neutral-500 hover:bg-neutral-600 dark:bg-neutral-400 dark:hover:bg-neutral-300"
        onClick={() => handleRemoveItem(item._id)}
        type="button"
      >
        <XIcon className="mx-px h-4 w-4 text-white dark:text-black" />
      </button>
      <p className="sr-only">{item.quantity}</p>
    </div>
  );
}
