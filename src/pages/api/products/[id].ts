import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Product ID is required" });
  }
  console.log(id);
  try {
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/products/${id}`,
      {
        headers: {
          "x-api-secret": process.env.API_SECRET!,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "Product fetch error:",
      error.response?.data || error.message
    );
    return res
      .status(error.response?.status || 500)
      .json({ error: "Product fetch failed" });
  }
}
