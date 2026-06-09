import { supabase } from "@/lib/supabase";

export type Poll = {
    id: string;
    question: string;
    options: { id: string; text: string; votes: number }[];
    total_votes: number;
    has_voted: boolean;
};

export async function getPolls(voterId: string) {
    const { data: polls, error } = await supabase
        .from("polls")
        .select(`
      id,
      question,
      poll_options (
        id,
        text,
        poll_votes (voter_id)
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching polls:", error);
        return [];
    }

    return (polls || []).map((p: any) => {
        const options = p.poll_options.map((o: any) => ({
            id: o.id,
            text: o.text,
            votes: o.poll_votes.length,
        }));

        const total_votes = options.reduce((sum: number, o: any) => sum + o.votes, 0);

        const has_voted = p.poll_options.some((o: any) =>
            o.poll_votes.some((v: any) => v.voter_id === voterId)
        );

        return {
            id: p.id,
            question: p.question,
            options,
            total_votes,
            has_voted,
        };
    });
}

export async function createPoll(question: string, options: string[]) {
    const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert([{ question }])
        .select()
        .single();

    if (pollError) throw pollError;

    const optionInserts = options.map(opt => ({ poll_id: poll.id, text: opt }));
    const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionInserts);

    if (optionsError) throw optionsError;

    return poll;
}

export async function voteInPoll(optionId: string, voterId: string) {
    const { error } = await supabase
        .from("poll_votes")
        .insert([{ option_id: optionId, voter_id: voterId }]);

    if (error) throw error;
    return true;
}
