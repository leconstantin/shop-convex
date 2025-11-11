"use client";
import CartItemSummary from "@/components/cart/cart-item";
import Price from "@/components/custom/price";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/convex/_generated/api";
import { TcartItem } from "@/lib/types";
import { useQuery } from "convex/react";
import { DotIcon } from "lucide-react";
export default function CheckoutCartItemsMobile() {
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
    <section className="h-fit w-full lg:hidden">
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer bg-muted/50 px-4 hover:no-underline">
            <div className="flex w-full items-center justify-between">
              <span>Order Summary</span>
              <Price
                amount={totalAmount.toString()}
                className="text-right font-bold text-lg"
                currencyCode={"USD"}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-9">
            <div className="mb-6 flex flex-col gap-5">
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
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">Shipping</div>
                <p className="text-muted-foreground">Calculated at next step</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">Total</p>
              <Price
                amount={totalAmount.toString()}
                className="text-right font-bold text-lg"
                currencyCode={"USD"}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
