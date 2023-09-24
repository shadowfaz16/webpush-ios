import type { NextApiRequest, NextApiResponse } from "next";
import MagicBell from "magicbell";
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const magicbell = new MagicBell({
    apiKey: process.env.NEXT_PUBLIC_MAGICBELL_API_KEY,
    apiSecret: process.env.MAGICBELL_API_SECRET,
  });
  const notifyApiSecret = process.env.NOTIFY_API_SECRET;
  if (!notifyApiSecret) {
    throw new Error("You need to provide NOTIFY_API_SECRET env variable");
  }

  if (req.method !== "POST") {
    throw new ReferenceError("Method not allowed");
  }

  const notificationPayload = req.body;
  console.log({ notificationPayload })
  if (!notificationPayload) {
    return res.status(400).json({ success: false });
  }
console.log("notify secret", notifyApiSecret)
  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${notifyApiSecret}`,
        },
        body: JSON.stringify(notificationPayload),
      }
    );
      console.log("result", result)
   const magicalBall =   await magicbell.notifications.create({
           title: notificationPayload.notification.title,
           content: notificationPayload.notification.body,
           action_url: notificationPayload.notification.url,
           recipients: notificationPayload.accounts.map((e) => ({ external_id: e })),
           category:  notificationPayload.notification.type,
         });
         console.log("magicalBall", magicalBall)
         console.log(
           "recpients",
           notificationPayload.accounts.map((e) => ({ external_id: e }))
         );
    const gmRes = await result.json(); // { "sent": ["eip155:1:0xafeb..."], "failed": [], "not_found": [] }
    console.log("Notify Server response - send notification", gmRes);
    const isSuccessfulGm = gmRes.sent?.includes(
      notificationPayload.accounts[0]
    );
    return res
      .status(result.status)
      .json({ success: isSuccessfulGm, message: gmRes?.reason });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
}
