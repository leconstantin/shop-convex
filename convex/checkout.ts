import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkoutInfoArgs = {
  email_phone: v.string(),
  receive_updates: v.optional(v.boolean()),
  country: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  apartment: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  road_number: v.optional(v.string()),
  save_info: v.optional(v.boolean()),
};

export const saveInfo = mutation({
  args: checkoutInfoArgs,
  returns: v.object({ saved: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to continue checkout.");
    }

    const session = await ctx.db
      .query("checkoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const contactEmail = args.email_phone.includes("@")
      ? args.email_phone
      : undefined;
    const contactPhone = args.email_phone.includes("@")
      ? undefined
      : args.email_phone;

    const shippingAddress = {
      country: args.country,
      first_name: args.first_name,
      last_name: args.last_name,
      email: contactEmail,
      apartment: args.apartment,
      city: args.city,
      state: args.state,
      road_number: args.road_number,
    };

    if (session) {
      await ctx.db.patch(session._id, {
        contactEmail: contactEmail ?? session.contactEmail,
        contactPhone: contactPhone ?? session.contactPhone,
        receive_updates: args.receive_updates ?? session.receive_updates,
        save_info: args.save_info ?? session.save_info,
        shipping_address: shippingAddress,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("checkoutSessions", {
        userId,
        contactEmail,
        contactPhone,
        receive_updates: args.receive_updates,
        save_info: args.save_info,
        shipping_address: shippingAddress,
        updatedAt: Date.now(),
      });
    }

    // Optionally keep user's contact email/phone in sync if present
    const user = await ctx.db.get(userId);
    if (user) {
      await ctx.db.patch(userId, {
        email: contactEmail ?? user.email,
        phone: contactPhone ?? user.phone,
      });
    }

    return { saved: true };
  },
});

export const selectShippingMethod = mutation({
  args: {
    method: v.string(),
    price: v.number(),
  },
  returns: v.object({
    saved: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to choose shipping.");
    }

    const session = await ctx.db
      .query("checkoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (session) {
      await ctx.db.patch(session._id, {
        shipping_method: args.method,
        shipping_price: args.price,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("checkoutSessions", {
        userId,
        shipping_method: args.method,
        shipping_price: args.price,
        updatedAt: Date.now(),
      });
    }

    return { saved: true };
  },
});

export const paywithPhoneNumber = mutation({
  args: {
    phone: v.string(),
  },
  returns: v.object({
    saved: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to pay.");
    }

    const session = await ctx.db
      .query("checkoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (session) {
      await ctx.db.patch(session._id, {
        contactPhone: args.phone,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("checkoutSessions", {
        userId,
        contactPhone: args.phone,
        updatedAt: Date.now(),
      });
    }

    // Keep user's phone up to date as well.
    const user = await ctx.db.get(userId);
    if (user?.phone !== args.phone) {
      await ctx.db.patch(userId, { phone: args.phone });
    }

    return { saved: true };
  },
});

export const getSession = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      contactEmail: v.optional(v.string()),
      contactPhone: v.optional(v.string()),
      receive_updates: v.optional(v.boolean()),
      save_info: v.optional(v.boolean()),
      shipping_address: v.optional(
        v.object({
          country: v.optional(v.string()),
          first_name: v.optional(v.string()),
          last_name: v.optional(v.string()),
          email: v.optional(v.string()),
          apartment: v.optional(v.string()),
          city: v.optional(v.string()),
          state: v.optional(v.string()),
          road_number: v.optional(v.string()),
        }),
      ),
      shipping_method: v.optional(v.string()),
      shipping_price: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const session = await ctx.db
      .query("checkoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!session) {
      return null;
    }

    const {
      contactEmail,
      contactPhone,
      receive_updates,
      save_info,
      shipping_address,
      shipping_method,
      shipping_price,
    } = session;

    return {
      contactEmail,
      contactPhone,
      receive_updates,
      save_info,
      shipping_address,
      shipping_method,
      shipping_price,
    };
  },
});
