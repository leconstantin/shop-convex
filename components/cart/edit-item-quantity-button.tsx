"use client";

import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";

import type { CartItem } from "@/shopify/types";
import { TcartItem } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function EditItemQuantityButton({
  type,
  item,
}: {
  item: TcartItem;
  type: "plus" | "minus";
}) {
  // const { decreaseCartQuantity, increaseCartQuantity } = useShoppingCart();
  const updateCartQuantity = useMutation(api.cart.updateCartQuantity);
  const handleUpdateQuantity = async () => {
    try {
    } catch (error: any) {
      toast.error(error.message || "Failed to update cart");
    }
  };

  const handleClick = async () => {
    if (type === "plus") {
      await updateCartQuantity({
        cartItemId: item._id,
        quantity: item.quantity + 1,
      });
      if (item.quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated");
      }
    } else {
      await updateCartQuantity({
        cartItemId: item._id,
        quantity: item.quantity - 1,
      });
      if (item.quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated");
      }
    }
  };

  return (
    <div>
      <button
        aria-label={
          type === "plus" ? "Increase item quantity" : "Reduce item quantity"
        }
        className={clsx(
          "ease flex h-full cursor-pointer min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
          {
            "ml-auto": type === "minus",
          },
        )}
        onClick={handleClick}
        type="button"
      >
        {type === "plus" ? (
          <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
        ) : (
          <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
        )}
      </button>
      <p className="sr-only">{item.quantity}</p>
    </div>
  );
}
