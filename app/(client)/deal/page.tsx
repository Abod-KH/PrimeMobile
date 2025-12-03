import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { getDealProducts } from "@/sanity/queries";
import React from "react";

const DealPage = async () => {
  const products = await getDealProducts();
  
  // Fetch reviews for all products
  const productReviews: {[key: string]: {rating: number}[]} = {};
  for (const product of products) {
    const reviewsQuery = `*[_type == "review" && product._ref == $productId]{rating}`;
    const reviews = await client.fetch(reviewsQuery, { productId: product._id });
    productReviews[product._id] = reviews;
  }

  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product: Product) => (
            <ProductCard 
              key={product?._id} 
              product={product} 
              reviews={productReviews[product._id] || []}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;
