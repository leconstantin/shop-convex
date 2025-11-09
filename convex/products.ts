import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const createProduct = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    stockQuantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const store = await ctx.db.get(args.storeId);
    if (!store || store.ownerId !== userId) {
      throw new Error("Not authorized to add products to this store");
    }

    const stockQuantity = args.stockQuantity || 0;

    const productId = await ctx.db.insert("products", {
      storeId: args.storeId,
      name: args.name,
      description: args.description,
      price: args.price,
      imageUrl: args.imageUrl,
      category: args.category,
      inStock: stockQuantity > 0,
      stockQuantity,
    });

    // Log activity
    await ctx.db.insert("activities", {
      storeId: args.storeId,
      type: "product_added",
      description: `Product "${args.name}" was added`,
      timestamp: Date.now(),
      metadata: { productId },
    });

    return productId;
  },
});

export const createDummyProducts = mutation({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const dummyProducts = [
      {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        category: "Electronics",
        stockQuantity: 25,
      },
      {
        name: "Coffee Mug",
        description: "Ceramic coffee mug with beautiful design",
        price: 15.99,
        imageUrl:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
        category: "Home & Kitchen",
        stockQuantity: 50,
      },
      {
        name: "Running Shoes",
        description: "Comfortable running shoes for daily exercise",
        price: 89.99,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        category: "Sports",
        stockQuantity: 15,
      },
      {
        name: "Backpack",
        description: "Durable backpack perfect for travel and work",
        price: 49.99,
        imageUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        category: "Accessories",
        stockQuantity: 30,
      },
      {
        name: "Smartphone Case",
        description: "Protective case for your smartphone",
        price: 24.99,
        imageUrl:
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
        category: "Electronics",
        stockQuantity: 40,
      },
    ];

    for (const product of dummyProducts) {
      await ctx.db.insert("products", {
        storeId: args.storeId,
        inStock: product.stockQuantity > 0,
        ...product,
      });
    }

    return "Dummy products created successfully";
  },
});
