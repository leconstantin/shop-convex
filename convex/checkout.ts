import { mutation } from "./_generated/server";
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
  returns: v.object({
    saved: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to continue checkout.");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const maybeEmail = args.email_phone.includes("@")
      ? args.email_phone
      : undefined;
    const maybePhone = args.email_phone.includes("@")
      ? undefined
      : args.email_phone;

    await ctx.db.patch(userId, {
      email: maybeEmail ?? user.email,
      phone: maybePhone ?? user.phone,
      receive_updates: args.receive_updates ?? user.receive_updates,
      country: args.country ?? user.country,
      first_name: args.first_name ?? user.first_name,
      last_name: args.last_name ?? user.last_name,
      apartment: args.apartment ?? user.apartment,
      city: args.city ?? user.city,
      state: args.state ?? user.state,
      road_number: args.road_number ?? user.road_number,
      save_info: args.save_info ?? user.save_info,
    });

    return {
      saved: true,
    };
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

    await ctx.db.patch(userId, {
      shipping_method: args.method,
      shipping_price: args.price,
    });

    return {
      saved: true,
    };
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
      throw new Error("You must be signed in to choose shipping.");
    }

    await ctx.db.patch(userId, {
      phone: args.phone,
    });

    return {
      saved: true,
    };
  },
});
