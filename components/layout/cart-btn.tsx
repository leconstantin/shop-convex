"use client";
import { api } from "@/convex/_generated/api";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
export default function CartBtn() {
  const cart = useQuery(api.cart.getMyCart);
  const isAdmin = useQuery(api.orders.checkIsAdmin);
  const cartItemCount =
    cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <div>
      <Authenticated>
        <Link href="/cart" className="relative hover:underline">
          Cart
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>
      </Authenticated>
    </div>
  );
}
