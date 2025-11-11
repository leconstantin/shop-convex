"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { TcartItem } from "@/lib/types";
import { useQuery } from "convex/react";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import Price from "../custom/price";
import CartItemSummary from "./cart-item";

export type MerchandiseSearchParams = {
  [key: string]: string;
};
export function CartModal() {
  const cart = useQuery(api.cart.getMyCart);
  const cartItemCount =
    cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount =
    cart?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0,
    ) || 0;

  const taxAmount = totalAmount * 0.18;
  if (!cart) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative" size={"icon-lg"} variant={"outline"}>
          <ShoppingCartIcon />
          {cartItemCount ? (
            <div className="-mr-2 -mt-2 absolute top-0 right-0 h-4 w-4 rounded-sm bg-blue-600 font-medium text-[11px] text-white">
              {cartItemCount}
            </div>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full p-4 md:w-3/4 dark:bg-black">
        <SheetHeader className="p-0">
          <SheetTitle className="text-xl">My Cart</SheetTitle>
          <SheetDescription className="sr-only">
            View your cart and checkout.
          </SheetDescription>
        </SheetHeader>
        {cart.length === 0 ? (
          <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
            <ShoppingCartIcon className="h-16" />
            <p className="mt-6 text-center font-bold text-2xl">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between overflow-hidden p-1">
            <ul className="grow overflow-auto py-4">
              {cart.map((item: TcartItem) => (
                <CartItemSummary item={item} key={item._id} />
              ))}
            </ul>
            <div className="px-2 py-4 text-neutral-500 text-sm dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pb-1 dark:border-neutral-700">
                <p>Taxes</p>
                <Price
                  amount={taxAmount.toString()}
                  className="text-right text-base text-black dark:text-white"
                  currencyCode={"USD"}
                />
              </div>
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pt-1 pb-1 dark:border-neutral-700">
                <p>Shipping</p>
                <p className="text-right">Calculated at checkout</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pt-1 pb-1 dark:border-neutral-700">
                <p>Total</p>
                <Price
                  amount={totalAmount.toString()}
                  className="text-right text-base text-black dark:text-white"
                  currencyCode={"USD"}
                />
              </div>
            </div>
            <SheetFooter className="pb-0">
              <Button
                asChild
                className="block w-full rounded-full bg-blue-600 p-3 text-center font-medium text-sm text-white opacity-90 hover:bg-blue-700 hover:opacity-100"
                // onClick={closeCart}
                size={"lg"}
              >
                <Link href="/checkout/information">Proceed to Checkout</Link>
              </Button>
            </SheetFooter>
          </div>
        )}
        {/* {!cart || cart.lines.length === 0 ? (
          <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
            <ShoppingCartIcon className="h-16" />
            <p className="mt-6 text-center font-bold text-2xl">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between overflow-hidden p-1">
            <ul className="grow overflow-auto py-4">
              {cart.lines.map((item) => (
                <CartItemSummary item={item} key={item.id} />
              ))}
            </ul>
            <div className="px-2 py-4 text-neutral-500 text-sm dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pb-1 dark:border-neutral-700">
                <p>Taxes</p>
                <Price
                  amount={cart.cost.totalTaxAmount.amount}
                  className="text-right text-base text-black dark:text-white"
                  currencyCode={cart.cost.totalTaxAmount.currencyCode}
                />
              </div>
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pt-1 pb-1 dark:border-neutral-700">
                <p>Shipping</p>
                <p className="text-right">Calculated at checkout</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-neutral-200 border-b pt-1 pb-1 dark:border-neutral-700">
                <p>Total</p>
                <Price
                  amount={cart.cost.totalAmount.amount}
                  className="text-right text-base text-black dark:text-white"
                  currencyCode={cart.cost.totalAmount.currencyCode}
                />
              </div>
            </div>
            <SheetFooter className="pb-0">
              <Button
                asChild
                className="block w-full rounded-full bg-blue-600 p-3 text-center font-medium text-sm text-white opacity-90 hover:bg-blue-700 hover:opacity-100"
                onClick={closeCart}
                size={"lg"}
              >
                <Link href="/checkout/information">Proceed to Checkout</Link>
              </Button>
            </SheetFooter>
          </div>
        )} */}
      </SheetContent>
    </Sheet>
  );
}
