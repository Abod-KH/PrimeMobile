import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { reviewId } = params;

    // Get the review to verify ownership
    const review = await client.fetch(
      `*[_type == "review" && _id == $reviewId][0]{
        userEmail,
      }`,
      { reviewId }
    );

    // Check if the review exists and belongs to the user
    if (!review) {
      return new NextResponse("Review not found", { status: 404 });
    }

    // Delete the review
    await client.delete(reviewId);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}