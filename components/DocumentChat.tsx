"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  analysisContext: string; // JSON-stringified analysis result
  documentType: string;
}

const STARTER_QUESTIONS = [
  "What does this charge mean?",
  "How do I write an appeal email?",
  "What are my strongest arguments?",
  "What is a reasonable settlement?",
];

export default function DocumentChat({ analysisContext, documentType }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I've reviewed your document in detail. Ask me anything — I can explain specific charges, help you craft an appeal, or walk you through your next steps. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(1), // skip the initial assistant greeting
          analysisContext,
          documentType,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setMessages(newMessages); // keep user message visible
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-orange-400" />
        Ask FairPrint AI
      </h2>

      <div className="card border-zinc-700 bg-zinc-900/60 flex flex-col gap-0 p-0 overflow-hidden">
        {/* Starter prompts */}
        {messages.length === 1 && (
          <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Message history */}
        <div className="flex flex-col gap-3 px-4 py-4 max-h-80 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                "flex gap-3 items-start",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={clsx(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
                  msg.role === "assistant"
                    ? "bg-orange-600"
                    : "bg-zinc-700"
                )}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-zinc-300" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={clsx(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-zinc-800 text-zinc-200 rounded-tl-none"
                    : "bg-orange-600/20 border border-orange-500/20 text-white rounded-tr-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-center">
              <div className="shrink-0 w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-800 px-4 py-3 flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a charge, your rights, or next steps..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 resize-none outline-none leading-relaxed"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={clsx(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              input.trim() && !loading
                ? "bg-orange-500 hover:bg-orange-400 text-black"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-zinc-600 text-xs mt-2">
        FairPrint AI is for informational purposes only, not legal advice. Press Enter to send, Shift+Enter for new line.
      </p>
    </section>
  );
}
