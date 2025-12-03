import { NextRequest } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { initData } = body;
    console.log("initData", initData);

    // Dev mock: если NEXT_PUBLIC_DEV_MOCK_USER_FUNDS=1 — пропускаем валидацию и возвращаем мок-юзера
    if (process.env.NEXT_PUBLIC_DEV_MOCK_USER_FUNDS === "1") {
        const mockUser = {
            id: Number(process.env.NEXT_PUBLIC_DEV_MOCK_USER_ID || 123456789),
            first_name: process.env.NEXT_PUBLIC_DEV_MOCK_USER_FIRST_NAME || "Dev",
            last_name: process.env.NEXT_PUBLIC_DEV_MOCK_USER_LAST_NAME || "User",
            username: process.env.NEXT_PUBLIC_DEV_MOCK_USER_USERNAME || "dev_user",
            photo_url: process.env.NEXT_PUBLIC_DEV_MOCK_USER_PHOTO_URL || undefined,
        };
        console.log("auth/telegram: using dev mock user", mockUser);
        return Response.json({ ok: true, user: mockUser }, { status: 200 });
    }

    if (!BOT_TOKEN) {
        return Response.json({ ok: false, error: "No BOT_TOKEN" }, { status: 500 });
    }
    if (!initData) {
        return Response.json({ ok: false, error: "No initData" }, { status: 400 });
    }

    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get("hash")!;
        urlParams.delete("hash");

        const dataCheckString = [...urlParams.entries()]
            .map(([key, value]) => `${key}=${value}`)
            .sort()
            .join("\n");

        const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
        const calculatedHash = crypto
            .createHmac("sha256", secretKey)
            .update(dataCheckString)
            .digest("hex");

        if (calculatedHash !== hash) {
            return Response.json({ ok: false, error: "Invalid hash" }, { status: 403 });
        }

        return Response.json({ ok: true });
    } catch (e) {
        console.error(e);
        return Response.json({ ok: false, error: "Internal error" }, { status: 500 });
    }
}
