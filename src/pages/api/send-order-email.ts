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
    console.log(order.items);
    const itemsHtml = Array.isArray(order.items)
      ? order.items
          .map((item: any) => {
            return `
        <div style="margin-bottom: 16px;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
          <p>${item.name} (${item.size}) x${item.quantity} - ₱${item.price.toFixed(2)}</p>
        </div>
      `;
          })
          .join("")
      : "<p>No items found in this order.</p>";

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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
<div style="text-align: center; margin-bottom: 24px;">
  <img
    src="https://www.stabcult.com/type-shi.jpg"
    alt="Stab Cult"
    style="width: 100px; border-radius: 8px;"
  />
</div>

    <h3 style="margin-bottom: 2px; color: #111; text-align: center;">order confirmation</h3>
    <p style="margin: 0 0 16px 0; text-align: center;">salamat sa suporta gawz</p>
    <p style="margin: 0 0 16px 0; ">here’s your order summary:</p>
    <table style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0;"><strong>order ID</strong></td>
        <td style="padding: 8px 0;">${order.orderId}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>name</strong></td>
        <td style="padding: 8px 0;">${order.firstName} ${order.lastName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>email</strong></td>
        <td style="padding: 8px 0;">${order.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>contact</strong></td>
        <td style="padding: 8px 0;">${order.contactNumber}</td>
      </tr>
    </table>

    ${
      order.address
        ? `
    <div style="margin-bottom: 24px;">
      <h3 style="margin-bottom: 8px;">Shipping Address</h3>
      <p style="margin: 0;">
        ${order.address.street}, ${order.address.barangay}<br/>
        ${order.address.city}, ${order.address.province} ${order.address.zip}
      </p>
    </div>`
        : `<div style="margin-bottom: 24px;"><strong>delivery method</strong> Pick up</div>`
    }

    <h3 style="margin-bottom: 16px;">ordered Items</h3>
    ${
      Array.isArray(order.items)
        ? order.items
            .map(
              (item: any) => `
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
  <img
    src="${item.image}"
    alt="${item.name}"
    style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px; margin-right: 12px;"
  />
  <div>
    <p style="margin: 0 0 4px; text-transform: lowercase;"><strong>${item.name}</strong> (${item.size})</p>
    <p style="margin: 0;">Qty: ${item.quantity} — ₱${item.price.toFixed(2)}</p>
  </div>
</div>`
            )
            .join("")
        : "<p>No items found in this order.</p>"
    }

    <div style="margin-top: 24px; font-size: 18px;">
      <strong>Total: ₱${order.total.toFixed(2)}</strong>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #888;">This email serves as your order confirmation. We'll contact you soon for the next steps.</p>
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
