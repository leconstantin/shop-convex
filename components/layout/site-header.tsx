"use client";
import React from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton } from "./sign-out";
import Link from "next/link";
export default function SiteHeader() {
  const cart = useQuery(api.cart.getMyCart);
  const cartItemCount =
    cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <header className="sticky top-0 z-10  backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-primary">Store Manager</h2>
        <Authenticated>
          <nav className="flex gap-2">
            <Link href="/">Dashboard</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/cart" className="relative">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link href="/activity">Activity</Link>
            <Link href="/about">About</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </Authenticated>
      </div>
      <SignOutButton />
    </header>
  );
}
