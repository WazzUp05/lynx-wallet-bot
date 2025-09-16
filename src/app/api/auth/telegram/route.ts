import { NextRequest } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { initData } = body;
    console.log("initData", initData);

    if (!initData) {
        return Response.json({ ok: false, error: "No initData" }, { status: 400 });
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
        return Response.json({ ok: false, error: "Invalid hash" }, { status: 403 });
    }

    return Response.json({ ok: true });
}
