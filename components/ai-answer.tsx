"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, Bot } from "lucide-react";

export default function AIAnswer() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function askAI() {
        if (!question.trim()) return;
        setIsLoading(true);
        setAnswer("");
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            setAnswer(data.answer);
        } catch (error) {
            setAnswer("Oops, something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mb-8 overflow-hidden rounded-2xl border bg-surface shadow-lg transition-all hover:shadow-xl">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-brand-soft/30"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Ask Kealvi AI</h3>
                        <p className="text-xs text-muted">Get instant answers to your questions</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-muted"
                >
                    <Sparkles size={18} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t px-4 pb-4 pt-4"
                    >
                        <div className="flex gap-2">
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && askAI()}
                                placeholder="How do I get started with Next.js?"
                                className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
                            />
                            <button
                                onClick={askAI}
                                disabled={isLoading}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white transition-all hover:bg-brand-strong disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>

                        {answer && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 rounded-xl bg-brand-soft/50 p-4 text-sm text-foreground ring-1 ring-brand/10"
                            >
                                <div className="mb-2 flex items-center gap-2 font-semibold text-brand">
                                    <Bot size={14} />
                                    Answer
                                </div>
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                                    {answer}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
