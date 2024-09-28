// export default search;
"use server";

import { client } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  if (typeof query !== "string") {
    return { status: 400, body: { error: "Invalid query parameter" } };
  }

  try {
    // Use the type to infer the response shape
    const r = await client.search<SearchResponse<Book>>({
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

    // Map over the hits and return the result
    return Response.json(
      r.hits.hits.map((hit) => ({ _id: hit._id, ...hit._source })),
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Error retrieving similar books", details: error }, { status: 500 });
  }
}
