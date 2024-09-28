"use server";

import { client } from "@/utils/db"; // Adjust the path if necessary
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { NextRequest, NextResponse } from "next/server";

// Define the type for book details if not already defined
type BookWithDetails = {
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  // Add other fields as needed
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  // Validate the book ID
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  try {
    // Search for similar books
    const similar: SearchResponse<BookWithDetails> = await client.search({
      index: "books",
      body: {
        size: 12,
        query: {
          more_like_this: {
            fields: ["title", "subtitle", "authors", "description"],
            like: [
              {
                _index: "books",
                _id: id,
              },
            ],
            min_term_freq: 1,
            max_query_terms: 24,
          },
        },
      },
    });

    // Map over the hits to return only the necessary fields
    const hits = similar.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
    }));

    // Return the similar books found
    return NextResponse.json(hits, { status: 200 });
  } catch (error) {
    // Log the error for debugging (optional)
    if (error instanceof Error) {
      console.error("Error retrieving similar books:", error);
      return NextResponse.json(
        { error: "Error retrieving similar books", details: error.message || error },
        { status: 500 }
      );
    }
  }
}
