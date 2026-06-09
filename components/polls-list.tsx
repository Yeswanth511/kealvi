"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BarChart3, X, Check } from "lucide-react";
import { getVoterId } from "@/lib/voter";

type PollOption = {
    id: string;
    text: string;
    votes: number;
};

type Poll = {
    id: string;
    question: string;
    options: PollOption[];
    total_votes: number;
    has_voted: boolean;
};

export default function PollsList() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", ""]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPolls();
    }, []);

    async function fetchPolls() {
        try {
            const res = await fetch(`/api/polls?voterId=${getVoterId()}`);
            if (res.ok) {
                const data = await res.json();
                setPolls(data);
            }
        } catch (e) {
            console.error("Failed to fetch polls", e);
        }
    }

    async function handleVote(pollId: string, optionId: string) {
        setPolls(prev => prev.map(p => {
            if (p.id === pollId) {
                return {
                    ...p,
                    has_voted: true,
                    total_votes: p.total_votes + 1,
                    options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
                };
            }
            return p;
        }));

        try {
            const res = await fetch("/api/polls/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optionId, voterId: getVoterId() }),
            });
            if (!res.ok) throw new Error();
        } catch (e) {
            fetchPolls();
        }
    }

    async function handleSubmitPoll() {
        if (!newQuestion.trim() || newOptions.some(o => !o.trim())) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/polls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: newQuestion, options: newOptions.filter(o => o.trim()) }),
            });
            if (res.ok) {
                setNewQuestion("");
                setNewOptions(["", ""]);
                setIsCreating(false);
                fetchPolls();
            }
        } catch (e) {
            console.error("Failed to create poll", e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="text-brand" size={24} />
                    Polls
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-all hover:bg-brand/20"
                >
                    {isCreating ? <X size={16} /> : <Plus size={16} />}
                    {isCreating ? "Cancel" : "New Poll"}
                </button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-2xl border bg-surface p-5 shadow-sm space-y-4"
                    >
                        <input
                            placeholder="What's your question?"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                        <div className="space-y-2">
                            {newOptions.map((opt, i) => (
                                <input
                                    key={i}
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                        const next = [...newOptions];
                                        next[i] = e.target.value;
                                        setNewOptions(next);
                                    }}
                                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
                                />
                            ))}
                            <button
                                onClick={() => setNewOptions([...newOptions, ""])}
                                className="text-xs font-medium text-brand hover:underline"
                            >
                                + Add Option
                            </button>
                        </div>
                        <button
                            onClick={handleSubmitPoll}
                            disabled={isLoading}
                            className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition-all hover:bg-brand-strong disabled:opacity-50"
                        >
                            {isLoading ? "Creating..." : "Create Poll"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4">
                {polls.map((poll) => (
                    <div
                        key={poll.id}
                        className="rounded-2xl border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <h3 className="mb-4 font-semibold text-lg">{poll.question}</h3>
                        <div className="space-y-3">
                            {poll.options.map((opt) => {
                                const percentage = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => !poll.has_voted && handleVote(poll.id, opt.id)}
                                        disabled={poll.has_voted}
                                        className="group relative w-full text-left"
                                    >
                                        <div className="relative z-10 flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors">
                                            <span className="flex items-center gap-2">
                                                {opt.text}
                                                {poll.has_voted && opt.votes === Math.max(...poll.options.map(o => o.votes)) && (
                                                    <Check size={14} className="text-brand" />
                                                )}
                                            </span>
                                            <span className="text-muted tabular-nums">{percentage}%</span>
                                        </div>
                                        <div
                                            className={`absolute inset-0 rounded-xl transition-all duration-500 ${poll.has_voted ? "bg-brand/10" : "bg-muted/5 group-hover:bg-muted/10"
                                                }`}
                                            style={{ width: poll.has_voted ? `${percentage}%` : "100%" }}
                                        />
                                        {!poll.has_voted && (
                                            <div className="absolute inset-0 rounded-xl border border-transparent transition-all group-hover:border-brand" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-4 text-xs text-muted flex items-center gap-2">
                            {poll.total_votes} votes • {poll.has_voted ? "You voted" : "Voting active"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
