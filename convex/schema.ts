import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  stores: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),

  products: defineTable({
    storeId: v.id("stores"),
    // Shopify identifiers to enable idempotent upserts
    shopifyId: v.string(),
    handle: v.string(),
    name: v.string(),
    price: v.number(),
    imageUrls: v.array(v.string()),
    collection: v.string(),
    inStock: v.boolean(),
    stockQuantity: v.optional(v.number()),
  })
    .index("by_store", ["storeId"])
    .index("by_shopifyId", ["shopifyId"])
    .index("by_handle", ["handle"]),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    selectedVariant: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  orders: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    customerId: v.optional(v.id("users")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    quantity: v.number(),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
    ),
    orderDate: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"]),

  activities: defineTable({
    storeId: v.id("stores"),
    type: v.union(
      v.literal("order_placed"),
      v.literal("order_confirmed"),
      v.literal("order_cancelled"),
      v.literal("product_added"),
      v.literal("store_updated"),
    ),
    description: v.string(),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id("orders")),
        productId: v.optional(v.id("products")),
        amount: v.optional(v.number()),
      }),
    ),
  }).index("by_store", ["storeId"]),
};

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // other "users" fields...

    // InfoForm shipping address fields
    country: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    apartment: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    road_number: v.optional(v.string()),
    save_info: v.optional(v.boolean()),
    receive_updates: v.optional(v.boolean()),
    shipping_method: v.optional(v.string()),
    shipping_price: v.optional(v.number()),
  }).index("email", ["email"]),
  ...applicationTables,
});
