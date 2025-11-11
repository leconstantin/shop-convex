"use client";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn, createUrl } from "@/lib/utils";
import { DEFAULT_OPTION } from "@/shopify/constants";
import type { CartItem } from "@/shopify/types";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { TcartItem } from "@/lib/types";
import Price from "../custom/price";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartItemSummary({
  item,
  isSheet,
}: {
  item: TcartItem;
  isSheet?: boolean;
}) {
  const merchandiseSearchParams = {} as MerchandiseSearchParams;

  const merchandiseUrl = createUrl(
    `/product/${item.product?.handle}`,
    new URLSearchParams(merchandiseSearchParams),
  );
  if (!item.product) return null;
  return (
    <li
      className={cn(
        "flex w-full flex-col border-neutral-300 border-b dark:border-neutral-700",
        !isSheet && "border-0",
      )}
    >
      <div className="relative flex w-full flex-row justify-between px-1 py-4">
        <div className="-ml-1 -mt-2 absolute z-40">
          <DeleteItemButton item={item} />
        </div>
        <div className="flex flex-row">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <Image
              alt={item.product?.name}
              className="h-full w-full object-cover"
              height={64}
              src={item.product.imageUrls[0]}
              width={64}
            />
          </div>
          <Link
            className="z-30 ml-2 flex flex-row space-x-4"
            href={merchandiseUrl as Route}
          >
            <div className="flex flex-1 flex-col text-base">
              <span className="leading-tight"> {item.product.name}</span>
              {item.selectedVariant !== DEFAULT_OPTION ? (
                <p className="text-neutral-500 text-sm dark:text-neutral-400">
                  {item.selectedVariant}
                </p>
              ) : null}
              {/* <div className="flex gap-1">
                {item.selectedOptions
                  ? item.selectedOptions.map((op, i) => (
                      <p
                        className="text-neutral-500 text-sm dark:text-neutral-400"
                        key={i}
                      >
                        {op}
                        {i < item.selectedOptions.length - 1 && " / "}
                      </p>
                    ))
                  : null}
              </div> */}
            </div>
          </Link>
        </div>
        <div className="flex h-16 flex-col justify-between">
          <Price
            amount={item.product.price.toString()}
            className="flex justify-end space-y-2 text-right text-sm"
            currencyCode={"USD"}
          />
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <EditItemQuantityButton item={item} type="minus" />
            <p className="w-6 text-center">
              <span className="w-full text-sm">{item.quantity}</span>
            </p>
            <EditItemQuantityButton item={item} type="plus" />
          </div>
        </div>
      </div>
    </li>
  );
}
