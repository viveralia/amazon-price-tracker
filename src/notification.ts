import nodemailer from "nodemailer";

interface Product {
  name: string;
  url: string;
  img?: string;
  price: number;
}

export const sendNotification = async (product: Product) => {
  console.log("🏗️ Building the notification...");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"🤖 Amazon Price Tracker Bot" <${process.env.GMAIL_ADDRESS}>`,
    to: process.env.GMAIL_ADDRESS,
    subject: "🔥 An Amazon product just lowered its price",
    html: `
      <p>Hey!</p>
      <p>The item you were keeping an eye on, <strong>${product.name}</strong>, just lowered its price to <strong>${product.price}</strong>.</p>
      <a href="${product.url}">
        <img alt="${product.name}" src="${product.img}" />
      </a>
      <p>So, hurry up and <a href="${product.url}">click here to buy it</a> before it is too late</p>
    `,
  });

  console.log("📤 Notification sent: %s", info.messageId);
};
