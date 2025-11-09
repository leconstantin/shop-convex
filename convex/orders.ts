import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to place an order");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (
      !product.inStock ||
      (product.stockQuantity !== undefined &&
        product.stockQuantity < args.quantity)
    ) {
      throw new Error("Not enough stock available");
    }

    const totalAmount = product.price * args.quantity;

    const orderId = await ctx.db.insert("orders", {
      productId: args.productId,
      storeId: product.storeId,
      customerId: userId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      quantity: args.quantity,
      totalAmount,
      status: "pending",
      orderDate: Date.now(),
    });

    // Update product stock
    if (product.stockQuantity !== undefined) {
      await ctx.db.patch(args.productId, {
        stockQuantity: product.stockQuantity - args.quantity,
        inStock: product.stockQuantity - args.quantity > 0,
      });
    }

    // Log activity
    await ctx.db.insert("activities", {
      storeId: product.storeId,
      type: "order_placed",
      description: `New order placed for ${product.name}`,
      timestamp: Date.now(),
      metadata: { orderId, amount: totalAmount },
    });

    return orderId;
  },
});

export const createOrderFromCart = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to place an order");
    }

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderIds = [];

    for (const cartItem of cartItems) {
      const product = await ctx.db.get(cartItem.productId);
      if (!product) continue;

      if (
        !product.inStock ||
        (product.stockQuantity !== undefined &&
          product.stockQuantity < cartItem.quantity)
      ) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      const totalAmount = product.price * cartItem.quantity;

      const orderId = await ctx.db.insert("orders", {
        productId: cartItem.productId,
        storeId: product.storeId,
        customerId: userId,
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        customerPhone: args.customerPhone,
        quantity: cartItem.quantity,
        totalAmount,
        status: "pending",
        orderDate: Date.now(),
      });

      // Update product stock
      if (product.stockQuantity !== undefined) {
        await ctx.db.patch(cartItem.productId, {
          stockQuantity: product.stockQuantity - cartItem.quantity,
          inStock: product.stockQuantity - cartItem.quantity > 0,
        });
      }

      // Log activity
      await ctx.db.insert("activities", {
        storeId: product.storeId,
        type: "order_placed",
        description: `New order placed for ${product.name}`,
        timestamp: Date.now(),
        metadata: { orderId, amount: totalAmount },
      });

      orderIds.push(orderId);

      // Remove from cart
      await ctx.db.delete(cartItem._id);
    }

    return orderIds;
  },
});

export const getStoreOrders = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc")
      .collect();

    // Get product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await ctx.db.get(order.productId);
        return {
          ...order,
          product,
        };
      }),
    );

    return ordersWithProducts;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Verify the user owns the store
    const store = await ctx.db.get(order.storeId);
    if (!store || store.ownerId !== userId) {
      throw new Error("Not authorized to update this order");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    // Log activity
    const activityType =
      args.status === "confirmed" ? "order_confirmed" : "order_cancelled";
    await ctx.db.insert("activities", {
      storeId: order.storeId,
      type: activityType,
      description: `Order ${args.status}`,
      timestamp: Date.now(),
      metadata: { orderId: args.orderId, amount: order.totalAmount },
    });

    return "Order status updated successfully";
  },
});
