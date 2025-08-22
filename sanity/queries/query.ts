import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,
    categories[]->{
      _type,
      _id,
      title,
      slug
    }
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);

const PRODUCT_REVIEWS_QUERY = defineQuery(`*[_type == "review" && product._ref == $productId] | order(createdAt desc) {
  ...,
  product->
}`);

const PRODUCT_SEARCH_QUERY = defineQuery(
  `*[_type == "product" && (name match $search || description match $search || brand->name match $search || categories[]->title match $search)]{
    _id,
    name,
    price,
    stock,
    brand->{name},
    "categories": categories[]->title
  }`
);

export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  PRODUCT_REVIEWS_QUERY,
  PRODUCT_SEARCH_QUERY,
};
