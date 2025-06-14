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
      const { search } = req.query;
      const ref = req.query.ref as string;
      const strapiRes = await axios.get(
        `   ${process.env.STRAPI_URL}/api/orders?filters[orderId][$eq]=${ref}&populate=*`,
        {
          headers: {
            "x-api-secret": process.env.API_SECRET!,
          },
        }
      );

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
