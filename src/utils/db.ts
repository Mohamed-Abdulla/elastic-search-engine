import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: "https://localhost:9200",
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY!,
  },
});
