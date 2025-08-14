"use client";

import { StarIcon, Trash2 } from "lucide-react";
import AddReview from "./AddReview";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  userImage: string;
  createdAt: string;
  userEmail: string;
}

interface ReviewsProps {
  productId: string;
  reviews: Review[];
}

const Reviews = ({ productId, reviews: initialReviews }: ReviewsProps) => {
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {isSignedIn ? (
        <AddReview productId={productId} user={user} />
      ) : (
        <p className="text-gray-600 mb-6">Please sign in to leave a review.</p>
      )}

      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review._id} className="flex space-x-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {review.userImage ? (
                  <Image
                    src={review.userImage}
                    alt={review.userName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-600">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {isSignedIn && user?.emailAddresses[0]?.emailAddress === review.userEmail && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete review"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    size={16}
                    className={index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          </div>
        ))}
        
        {(!reviews || reviews.length === 0) && (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default Reviews;