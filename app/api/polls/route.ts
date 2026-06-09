import { NextResponse } from "next/server";
import { getPolls, createPoll } from "@/lib/polls";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const voterId = searchParams.get("voterId") || "anonymous";
    const polls = await getPolls(voterId);
    return NextResponse.json(polls);
}

export async function POST(req: Request) {
    try {
        const { question, options } = await req.json();
        if (!question || !options || options.length < 2) {
            return NextResponse.json({ error: "Invalid poll data" }, { status: 400 });
        }
        const poll = await createPoll(question, options);
        return NextResponse.json(poll);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
