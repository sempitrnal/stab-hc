import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://www.stabcult.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const productsRes = await fetch(`${process.env.STRAPI_URL}/api/products`);
  const productsData = await productsRes.json();

  const productUrls = productsData.data.map((product: any) => {
    return `
      <url>
        <loc>${baseUrl}/product/${product.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  const staticUrls = ["/", "/merch"].map((path) => {
    return `
      <url>
        <loc>${baseUrl}${path}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticUrls, ...productUrls].join("")}
    </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
}
