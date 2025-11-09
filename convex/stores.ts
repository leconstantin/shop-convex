import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createStore = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a store");
    }

    // Check if user already has a store
    const existingStore = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    if (existingStore) {
      throw new Error("You can only own one store");
    }

    const storeId = await ctx.db.insert("stores", {
      ownerId: userId,
      name: args.name,
      description: args.description,
    });

    // Log activity
    await ctx.db.insert("activities", {
      storeId,
      type: "store_updated",
      description: `Store "${args.name}" was created`,
      timestamp: Date.now(),
    });

    return storeId;
  },
});

export const updateStore = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new Error("Not authorized to update this store");
    }

    await ctx.db.patch(args.storeId, {
      name: args.name,
      description: args.description,
      address: args.address,
      phone: args.phone,
      email: args.email,
      website: args.website,
    });

    // Log activity
    await ctx.db.insert("activities", {
      storeId: args.storeId,
      type: "store_updated",
      description: "Store details were updated",
      timestamp: Date.now(),
    });

    return "Store updated successfully";
  },
});

export const getMyStore = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const store = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    return store;
  },
});

export const getStoreProducts = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const getStoreDashboardStats = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new Error("Not authorized");
    }

    // Get all orders for this store
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    // Get all products for this store
    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((order) => order.status === "confirmed")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const uniqueCustomers = new Set(orders.map((order) => order.customerId))
      .size;
    const totalProducts = products.length;

    // Recent orders (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter(
      (order) => order.orderDate > sevenDaysAgo,
    );

    return {
      totalOrders,
      totalRevenue,
      totalCustomers: uniqueCustomers,
      totalProducts,
      recentOrdersCount: recentOrders.length,
      pendingOrders: orders.filter((order) => order.status === "pending")
        .length,
    };
  },
});
