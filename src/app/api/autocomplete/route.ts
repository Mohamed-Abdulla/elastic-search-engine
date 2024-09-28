"use server";

import { client } from "@/utils/db"; // Ensure the path is correct for your project structure
import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 });
  }

  try {
    // Use the type to infer the response shape
    const r: SearchResponse<Book> = await client.search({
      index: "books",
      size: 10,
      body: {
        query: {
          match_bool_prefix: {
            title: { operator: "and", query },
          },
        },
      },
    });

    const hits = r.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
    }));

    // Map over the hits and return the result
    return NextResponse.json(hits, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error retrieving similar books:", error); // Optional: log the error for debugging
      return NextResponse.json(
        { error: "Error retrieving similar books", details: error.message || error },
        { status: 500 }
      );
    }
  }
}
