"use client";
import { Cart } from "@/components/custom/cart";
import { SignInForm } from "@/components/custom/signin-form";
import { api } from "@/convex/_generated/api";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

export default function CartPage() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto">
      <Authenticated>
        <Cart />
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Shopping Cart
            </h1>
            <p className="text-xl text-secondary">
              Please sign in to view your cart
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
