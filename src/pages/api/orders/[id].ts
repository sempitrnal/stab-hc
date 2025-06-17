import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Order ID is required" });

  try {
    if (req.method === "PUT") {
      const { data } = req.body;
      console.log({ data });
      const response = await axios.put(
        `${process.env.STRAPI_URL}/api/custom-orders/${id}`,
        { data },
        {
          headers: {
            "x-api-secret": process.env.API_SECRET!,
          },
        }
      );

      return res.status(200).json(response.data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Order update error:", error.response?.data || error.message);
    return res
      .status(error.response?.status || 500)
      .json({ error: "Order update failed" });
  }
}
