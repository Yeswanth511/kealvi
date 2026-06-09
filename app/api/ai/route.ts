import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { question } = await req.json();
        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const answer = await getAIResponse(question);
        return NextResponse.json({ answer });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
    }
}
