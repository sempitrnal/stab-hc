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
      const { search, ref } = req.query;

      let url = `${process.env.STRAPI_URL}/api/orders?populate=*`;

      if (ref) {
        url += `&filters[orderId][$eq]=${ref}`;
      } else if (search) {
        const params = new URLSearchParams({
          "filters[$or][0][firstName][$containsi]": String(search),
          "filters[$or][1][lastName][$containsi]": String(search),
          "filters[$or][2][email][$containsi]": String(search),
        });
        url += `&${params.toString()}`;
      }

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
