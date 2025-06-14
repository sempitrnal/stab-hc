// pages/api/send-order-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { order } = req.body;
    if (!order) return res.status(400).json({ error: "Missing order data" });

    const itemsHtml = order.items
      .map((item: any) => {
        return `
        <div style="margin-bottom: 16px;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
          <p>${item.name} (${item.size}) x${item.quantity} - ₱${item.price.toFixed(2)}</p>
        </div>
      `;
      })
      .join("");

    const addressHtml = order.address
      ? `
        <div>
          <strong>Shipping Address:</strong><br/>
          ${order.address.street}, ${order.address.barangay}<br/>
          ${order.address.city}, ${order.address.province} ${order.address.zip}
        </div>
      `
      : "<div><strong>Delivery Method:</strong> Pick up</div>";

    const htmlContent = `
      <div style="font-family: sans-serif;">
        <h2>Order Confirmation - ${order.orderId}</h2>
        <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
        <p><strong>Contact:</strong> ${order.contactNumber}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        ${addressHtml}
        <h3 style="margin-top: 24px;">Items:</h3>
        ${itemsHtml}
        <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
      </div>
    `;

    const res2 = await resend.emails.send({
      from: "no-reply@stabcult.com",
      to: order.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: htmlContent,
    });
    console.log("Email sent successfully:", res2);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
