import MagicBell from "magicbell"
import type { NextApiRequest, NextApiResponse } from "next"

interface WelcomeRequest extends NextApiRequest {
  body: {
    userId: string
  }
}

type ResponseData = {
  status: string
}

const magicbell = new MagicBell({
  apiKey: process.env.NEXT_PUBLIC_MAGICBELL_API_KEY,
  apiSecret: process.env.MAGICBELL_API_SECRET,
})

export default async function handler(
  req: WelcomeRequest,
  res: NextApiResponse<ResponseData>
) {
  await magicbell.notifications.create({
    title: "LETS GOOOO!",
    action_url: "https://w3hub.vercel.app",
    recipients: [{ external_id: req.body.userId }],
    category: "default",
  })
  res.status(200).json({ status: "success" })
}
