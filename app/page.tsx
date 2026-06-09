import QuestionsList from "./questions-list";
import { getQuestionsPage } from "@/lib/questions";
import AIAnswer from "@/components/ai-answer";
import PollsList from "@/components/polls-list";
import { MessageSquare, Star } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function Page() {
  const { questions, hasMore } = await getQuestionsPage(0, PAGE_SIZE);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent" />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:py-20">
        <header className="mb-12 text-center">
          <MotionWrapper>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand uppercase tracking-wider ring-1 ring-brand/20">
              <Star size={14} className="fill-brand" />
              Interactive Platform
            </span>
            <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl">
              Kealvi <span className="text-brand">Live</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-muted leading-relaxed">
              The ultimate destination for live Q&A sessions, instant AI insights, and interactive polling.
            </p>
          </MotionWrapper>
        </header>

        <AIAnswer />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-2xl font-bold">Live Questions</h2>
            </div>
            <QuestionsList initialQuestions={questions} initialHasMore={hasMore} />
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-10">
              <PollsList />
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t py-10 text-center text-sm text-muted bg-surface/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Kealvi Platform. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

function MotionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="transition-all duration-1000 animate-in fade-in slide-in-from-top-4">{children}</div>;
}
