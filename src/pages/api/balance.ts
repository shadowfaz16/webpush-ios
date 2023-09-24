import type { NextApiRequest, NextApiResponse } from "next";


const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notifyApiSecret = process.env.NOTIFY_API_SECRET;
  if (!notifyApiSecret) {
    throw new Error("You need to provide NOTIFY_API_SECRET env variable");
  }

  if (req.method !== 'POST') {
    throw new ReferenceError("Method not allowed");
  }

  const notificationPayload = req.body;
  if (!notificationPayload) {
    return res.status(400).json({ success: false });
  }
console.log("balance : " , notificationPayload)
  const transactionsArray = notificationPayload.map((e) => e.transactionHash);
console.log("transactionsArray : " , transactionsArray)

let notification= {
    title: "New Sepolia Transactions Found",
    body: JSON.stringify(transactionsArray),
    icon: "https://notify.walletconnect.com/img/walletconnect-logo.png",
    url: `https://etherscan.io/tx/${transactionsArray[0]}`,
    type: "transactional",
}

const payload = {
    accounts: ["eip155:1:0x4269f41Fa8440CdbD1A919eEd9414bF96BDFB5eE","eip155:1:0x71BF184230bF6D412854fffEF1fcf88E62395e8b"],
    notification: notification
}
  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${notifyApiSecret}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const gmRes = await result.json(); // { "sent": ["eip155:1:0xafeb..."], "failed": [], "not_found": [] }
    console.log("Notify Server response - send notification", gmRes);
    const isSuccessfulGm = gmRes.sent?.includes(
      notificationPayload.accounts[0]
    );
    return res
      .status(result.status)
      .json({ succes: isSuccessfulGm, message: gmRes?.reason });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
}
