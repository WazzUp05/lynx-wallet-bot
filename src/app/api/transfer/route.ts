import { NextRequest } from "next/server";
import { v1 as uuidv1 } from "uuid";

interface TransferRequest {
    amount: string;
    crypto: string;
    network: string;
    address: string;
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as TransferRequest;
    const { amount, crypto, network, address } = body;

    console.log("Transfer request:", { amount, crypto, network, address });

    // Валидация
    if (!amount || !crypto || !network || !address) {
        return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // Dev mock: если NEXT_PUBLIC_DEV_MOCK_USER_FUNDS=1 — возвращаем mock-успех
    if (process.env.NEXT_PUBLIC_DEV_MOCK_USER_FUNDS === "1") {
        const mockTransactionId = `LYNXW-${uuidv1()}`;
        console.log("transfer: using dev mock", { transactionId: mockTransactionId });
        return Response.json(
            {
                ok: true,
                success: true,
                transactionId: mockTransactionId,
                amount,
                crypto,
                network,
                address,
                timestamp: new Date().toISOString(),
                message: "Mock transfer successful",
            },
            { status: 200 }
        );
    }

    // Production: реальный запрос на backend
    try {
        const backendUrl = process.env.API_URL || "http://localhost:3001";
        const res = await fetch(`${backendUrl}/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Telegram-ID": req.headers.get("X-Telegram-ID") || "",
            },
            body: JSON.stringify({ amount, crypto, network, address }),
        });

        const data = await res.json();
        return Response.json(data, { status: res.status });
    } catch (error) {
        console.error("Transfer error:", error);
        return Response.json({ ok: false, error: "Transfer failed" }, { status: 500 });
    }
}
