"use client";
import CartItemSummary from "@/components/cart/cart-item";
import Price from "@/components/custom/price";
import { api } from "@/convex/_generated/api";
import { TcartItem } from "@/lib/types";
import { useQuery } from "convex/react";
import { DotIcon } from "lucide-react";
export default function CheckoutCartItems() {
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
    <section className="sticky top-2 hidden h-fit w-full max-w-xl p-9 lg:block">
      <div className="mb-6 flex flex-col gap-2">
        {cart.map((item: TcartItem) => (
          <CartItemSummary item={item} key={item._id} isSheet={false} />
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-2 text-foreground/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            Subtotal
            <DotIcon />
            {cartItemCount} items
          </div>
          <Price
            amount={totalAmount.toString()}
            className="text-right text-base"
            currencyCode={"USD"}
            currencyCodeClassName="sr-only"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">Shipping</div>
          {4 > 0 ? (
            <Price
              amount={totalAmount.toString()}
              className="text-right text-base"
              currencyCode={"USD"}
              currencyCodeClassName="sr-only"
            />
          ) : (
            <p className="text-muted-foreground">Calculated at next step</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">Total</p>
        <Price
          amount={totalAmount.toString()}
          className="text-right font-bold text-lg"
          currencyCode={"USD"}
          currencyCodeClassName="sr-only"
        />
      </div>
    </section>
  );
}
