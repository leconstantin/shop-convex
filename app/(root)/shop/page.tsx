"use client";
import { ProductCatalog } from "@/components/custom/product-list";
import { SignInForm } from "@/components/custom/signin-form";
import { StoreDashboard } from "@/components/custom/store-dashboard";
import { api } from "@/convex/_generated/api";
import { Unauthenticated, Authenticated, useQuery } from "convex/react";

export default function Shoppage() {
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
        <ProductCatalog />
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Store Manager
            </h1>
            <p className="text-xl text-secondary">
              Sign in to manage your store
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
