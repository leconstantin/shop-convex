# Shopa - E-commerce Platform

An e-commerce platform built with Convex, Next.js, and Convex Auth where visitors can browse products and place orders, and admins can manage all orders.

## Features

- **Public Product Catalog**: Visitors can browse products without authentication
- **Guest Checkout**: Visitors can place orders without creating an account
- **Shopping Cart**: Authenticated users can add items to cart and checkout
- **Admin Dashboard**: Admins can view and manage all orders across the platform
- **Order Management**: Admins can confirm or cancel orders

## Tech Stack

- [Convex](https://convex.dev/) - Backend (database, server logic)
- [React](https://react.dev/) - Frontend (web page interactivity)
- [Next.js](https://nextjs.org/) - Web framework and routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Convex Auth](https://labs.convex.dev/auth) - Authentication

## Get started

If you just cloned this codebase and didn't use `npm create convex`, run:

```
npm install
npm run dev
```

If you're reading this README on GitHub and want to use this template, run:

```
npm create convex@latest -- -t nextjs-convexauth
```

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.
- [Convex Auth docs](https://labs.convex.dev/auth) for documentation on the Convex Auth library.

## Admin Setup

To set up an admin user:

1. Open `convex/orders.ts`
2. Find the `ADMIN_EMAILS` constant (around line 170)
3. Replace `"admin@example.com"` with your actual admin email address
4. Sign up/sign in with that email address to access the admin dashboard

Example:
```typescript
const ADMIN_EMAILS = ["your-email@example.com"]; // Your admin email
```

## Project Structure

- `/shop` - Product catalog (public, no login required)
- `/cart` - Shopping cart (requires login)
- `/admin` - Admin dashboard to view all orders (admin only)
- `/` - Home page with product catalog

## Configuring other authentication methods

To configure different authentication methods, see [Configuration](https://labs.convex.dev/auth/config) in the Convex Auth docs.

## Join the community

Join thousands of developers building full-stack apps with Convex:

- Join the [Convex Discord community](https://convex.dev/community) to get help in real-time.
- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
