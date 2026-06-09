import { NextResponse } from "next/server";
import { voteInPoll } from "@/lib/polls";

export async function POST(req: Request) {
    try {
        const { optionId, voterId } = await req.json();
        if (!optionId || !voterId) {
            return NextResponse.json({ error: "Invalid vote data" }, { status: 400 });
        }
        await voteInPoll(optionId, voterId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
