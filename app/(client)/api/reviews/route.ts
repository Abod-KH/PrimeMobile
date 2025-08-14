import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment, userEmail, userName, userImage } = body;

    // Create the review document
    const review = await client.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      rating,
      comment,
      userEmail,
      userName,
      userImage,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}