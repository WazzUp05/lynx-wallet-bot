import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN!; // токен бота из BotFather

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Telegram auth request:", req.method, req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { initData } = req.body;
    if (!initData) {
        return res.status(400).json({ ok: false, error: "No initData" });
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash")!;
    urlParams.delete("hash");

    const dataCheckString = [...urlParams.entries()]
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();

    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (calculatedHash !== hash) {
        return res.status(403).json({ ok: false, error: "Invalid hash" });
    }

    return res.json({ ok: true });
}
