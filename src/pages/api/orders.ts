// pages/api/orders.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const strapiRes = await axios.post(
        `${process.env.STRAPI_URL}/api/orders`,
        req.body,
        {
          headers: {
            "x-api-secret": process.env.API_SECRET!,
          },
        }
      );

      return res.status(200).json(strapiRes.data);
    } catch (error: any) {
      console.error("Order API error:", error.response?.data || error.message);
      return res
        .status(error.response?.status || 500)
        .json({ error: "Order creation failed" });
    }
  }

  if (req.method === "GET") {
    try {
      const queryParams = new URLSearchParams();

      if (req.query.ref) {
        queryParams.append("filters[orderId][$eq]", String(req.query.ref));
      } else if (req.query.search) {
        const search = String(req.query.search);
        queryParams.append("filters[$or][0][firstName][$containsi]", search);
        queryParams.append("filters[$or][1][lastName][$containsi]", search);
        queryParams.append("filters[$or][2][email][$containsi]", search);
        queryParams.append("filters[$or][3][orderId][$containsi]", search);
      }

      const itemFilters = [];
      console.log("Raw req.query:", JSON.stringify(req.query));
      console.log("Incoming request URL:", req.url);
      if (req.query.item) {
        itemFilters.push(
          `filters[items][$and][${itemFilters.length}][name][$containsi]=${req.query.item}`
        );
      }
      if (req.query.color) {
        itemFilters.push(
          `filters[items][$and][${itemFilters.length}][color][$containsi]=${req.query.color}`
        );
      }
      if (req.query.size) {
        itemFilters.push(
          `filters[items][$and][${itemFilters.length}][size][$containsi]=${req.query.size}`
        );
      }

      if (itemFilters.length > 0) {
        itemFilters.forEach((filter) => {
          const [key, value] = filter.split("=");
          queryParams.append(key, value);
        });
      }

      queryParams.append("populate", "*");

      const url = `${process.env.STRAPI_URL}/api/orders?${queryParams.toString()}`;
      console.log(url);

      const strapiRes = await axios.get(url, {
        headers: {
          "x-api-secret": process.env.API_SECRET!,
        },
      });

      return res.status(200).json(strapiRes.data);
    } catch (error: any) {
      console.error(
        "Order fetch error:",
        error.response?.data || error.message
      );
      return res
        .status(error.response?.status || 500)
        .json({ error: "Order fetch failed" });
    }
  }

  return res.status(405).end("Method Not Allowed");
}
