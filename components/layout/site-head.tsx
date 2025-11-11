"use client";
import React from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton } from "./sign-out";
import Link from "next/link";
export default function SiteHead() {
  const cart = useQuery(api.cart.getMyCart);
  const isAdmin = useQuery(api.orders.checkIsAdmin);
  const cartItemCount =
    cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <header className="sticky top-0 z-10  backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xl font-semibold text-primary hover:underline"
        >
          Shopa
        </Link>
        <nav className="flex gap-4">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <Authenticated>
            {isAdmin ? (
              <>
                <Link href="/admin" className="hover:underline">
                  Admin
                </Link>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
                <Link href="/settings" className="hover:underline">
                  Settings
                </Link>
                <Link href="/activity" className="hover:underline">
                  Activity
                </Link>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative hover:underline">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="hover:underline">
                  My Orders
                </Link>
              </>
            )}
          </Authenticated>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Authenticated>
          <SignOutButton />
        </Authenticated>
        <Unauthenticated>
          <Link
            href="/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </Unauthenticated>
      </div>
    </header>
  );
}
