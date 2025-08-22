export const PRODUCT_REVIEWS_QUERY = `*[_type == "review" && product._ref == $productId]{
  _id,
  rating,
  comment,
  user->{name, email},
  _createdAt
}`;