import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full collection of smartphones, accessories, and electronics at PrimeMobile. Find the best deals and the latest tech here.",
};


const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-white">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
