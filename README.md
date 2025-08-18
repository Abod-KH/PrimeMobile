# Shopcart E-commerce Platform

Shopcart is a modern, full-featured e-commerce platform built with Next.js, Sanity.io, and Clerk for authentication. It provides a seamless shopping experience with product listings, categories, a shopping cart, user authentication, and order management.

## Features

- **Product Catalog**: Browse a wide range of products with detailed descriptions and images.
- **Categories & Brands**: Easily navigate products by categories and brands.
- **Shopping Cart**: Add, update, and remove items from your cart.
- **User Authentication**: Secure user login and registration powered by Clerk.
- **Order Management**: View past orders and track their status.
- **Product Reviews**: Users can leave reviews and ratings for products.
- **Wishlist**: Save products to your wishlist for later.
- **Admin Panel (Sanity Studio)**: Manage products, categories, orders, and reviews through a powerful content management system.
- **Stripe Integration**: Secure payment processing.

## Technologies Used

- **Next.js**: React framework for building performant web applications.
- **Sanity.io**: Headless CMS for content management.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Clerk**: User authentication and authorization.
- **Stripe**: Payment gateway.
- **Zustand**: State management.
- **Lucide React**: Icon library.
- **Motion**: Animation library.

## Getting Started

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/Abod-KH/PrimeMobile.git
cd PrimeMobile
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
SANITY_API_READ_TOKEN=your_sanity_api_read_token

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=your_site_url
SITE_NAME=your_site_name
```

Replace the placeholder values with your actual keys from Clerk, Sanity.io, Stripe, and OpenRouter. For Sanity, you'll need to create a project and dataset, and for Stripe, set up your account and webhooks.

### 4. Run Sanity Studio

To manage your content, navigate to the `studio` directory and start the Sanity Studio:

```bash
cd studio
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Access the Sanity Studio at `http://localhost:3333` (or the port specified by Sanity).

### 5. Run the Development Server

After setting up environment variables and optionally Sanity Studio, run the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. What to do next?

- **Explore the application**: Browse products, add items to your cart, and test the authentication flow.
- **Populate data**: Use the Sanity Studio (`http://localhost:3333`) to add products, categories, and brands.
- **Configure webhooks**: Set up Stripe webhooks to handle payment events.
- **Customize**: Modify the codebase to fit your specific needs and design preferences.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
