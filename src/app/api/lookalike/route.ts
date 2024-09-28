"use server";
import { client } from "@/utils/db";
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (typeof id !== "string") {
    return { status: 400, body: { error: "Invalid book ID" } };
  }

  try {
    // Search for similar books
    const similar = await client.search<SearchResponse<BookWithDetails>>({
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

    // Return the similar books found
    return Response.json(
      similar.hits.hits.map((hit) => ({ _id: hit._id, ...hit._source })),
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Error retrieving similar books", details: error }, { status: 500 });
  }
}
