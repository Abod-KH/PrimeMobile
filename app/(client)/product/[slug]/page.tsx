import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCard from "@/components/ProductCard";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { Product } from "@/sanity.types";
import Reviews from "@/components/Reviews";
import { calculateAverageRating } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { getProductBySlug, PRODUCT_REVIEWS_QUERY } from "@/sanity/queries";
import { CornerDownLeft, StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

type CategoryReference = {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  _key: string;
  internalGroqTypeReferenceTo?: "category";
};

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Fetch reviews for this product
  const reviews = await client.fetch(PRODUCT_REVIEWS_QUERY, {
    productId: product._id,
  });

  // Fetch related products from the same category
  const relatedProducts: Product[] = await client.fetch(`
    *[_type == "product" && 
      _id != $productId && 
      count(categories[@._ref in $categories]) > 0
    ] | order(name asc)[0...5]{
      ...,
      "categories": categories[]->title
    }
  `, {
    productId: product._id,
    categories: product.categories?.map((cat: CategoryReference) => cat._ref) || []
  });

  const averageRating = calculateAverageRating(reviews);

  return (
    <Container className="flex flex-col gap-10 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {product?.images && (
          <ImageView images={product?.images} isStock={product?.stock} />
        )}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product?.name}</h2>
            <p className="text-sm text-gray-600 tracking-wide">
              {product?.description}
            </p>
            <div className="flex items-center gap-0.5 text-xs">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  size={12}
                  className={
                    index < Math.round(averageRating) 
                      ? "text-shop_light_green" 
                      : "text-gray-300"
                  }
                  fill={
                    index < Math.round(averageRating)
                      ? "#3b9c3c"
                      : "#d1d5db"
                  }
                />
              ))}
              <p className="font-semibold">
                {averageRating > 0 ? `${averageRating} (${reviews?.length})` : `No reviews yet`}
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-gray-200 py-5">
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />
            <p
              className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
            >
              {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <div className="flex items-center gap-2.5 lg:gap-3">
            <AddToCartButton product={product} />
            <FavoriteButton showProduct={true} product={product} />
          </div>
          <ProductCharacteristics product={product} />
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <RxBorderSplit className="text-lg" />
              <p>Compare color</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <FaRegQuestionCircle className="text-lg" />
              <p>Ask a question</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <TbTruckDelivery className="text-lg" />
              <p>Delivery & Return</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <FiShare2 className="text-lg" />
              <p>Share this product</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 hover:text-shop_dark_green hoverEffect">
              <CornerDownLeft className="text-gray-400" size={16} />
              <p className="text-base font-semibold">
                <span className="underline underline-offset-2">Details</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts?.map((relatedProduct: Product) => (
            <ProductCard
              key={relatedProduct._id}
              product={relatedProduct}
              reviews={[]}
            />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={product._id} reviews={reviews} />
    </Container>
  );
};

export default SingleProductPage;
