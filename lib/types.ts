import { Id } from "@/convex/_generated/dataModel";

export type TDbProduct = {
  _id: Id<"products">;
  _creationTime: number;
  stockQuantity?: number | undefined;
  handle: string;
  collection: string;
  name: string;
  storeId: Id<"stores">;
  shopifyId: string;
  price: number;
  imageUrls: string[];
  inStock: boolean;
};

export type TDbcart = {
  _id: Id<"cart">;
  _creationTime: number;
  userId: Id<"users">;
  productId: Id<"products">;
  quantity: number;
  selectedVariant?: string | undefined;
};

export type TcartItem = TDbcart & {
  product: TDbProduct | null;
};
