import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: process.env.NODE_ENV == "development" ? process.env.ELASTIC_URL! : process.env.PROD_ELASTIC_URL!,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    apiKey: process.env.NODE_ENV == "development" ? process.env.ELASTIC_API_KEY! : process.env.PROD_ELASTIC_API_KEY!,
  },
});
