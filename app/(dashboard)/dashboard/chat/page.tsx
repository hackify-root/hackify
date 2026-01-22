"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  Send,
  Bot,
  User,
  Terminal,
  Sparkles,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { CyberButton } from "@/components/cyber-button";

const suggestedQuestions = [
  "What is SQL injection and how can I prevent it?",
  "Explain the OWASP Top 10 vulnerabilities",
  "How do I set up a penetration testing lab?",
  "What are the best CTF platforms for beginners?",
  "How does XSS (Cross-Site Scripting) work?",
  "What tools do ethical hackers use?",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Safe HTML formatter - no complex markdown, just basic formatting
function formatMessage(text: string): string {
  if (!text) return "";

  try {
    // Escape HTML first
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Format code blocks - simple version
    formatted = formatted.replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      '<pre class="bg-background border border-border rounded-lg p-3 my-2 overflow-x-auto text-sm"><code class="text-primary">$2</code></pre>'
    );

    // Format inline code
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="bg-background border border-border px-1.5 py-0.5 rounded text-sm text-primary">$1</code>'
    );

    // Format bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Format line breaks
    formatted = formatted.replace(/\n/g, "<br />");

    return formatted;
  } catch {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

// Memoized message bubble component
const MessageBubble = memo(function MessageBubble({ role, content }: { role: string; content: string }) {
  const formattedContent = formatMessage(content);
  
  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-primary/10 border border-primary/30 text-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none">
          {content ? (
            <div
              className="whitespace-pre-wrap break-words [&_pre]:whitespace-pre-wrap [&_code]:break-all"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          ) : (
            <span className="text-muted-foreground">...</span>
          )}
        </div>
      </div>

      {role === "user" && (
        <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-neon-cyan" />
        </div>
      )}
    </div>
  );
});

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Create placeholder for assistant response
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = { id: assistantId, role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            // AI SDK data stream format: 0:"text"
            try {
              const jsonStr = line.slice(2);
              const text = JSON.parse(jsonStr);
              if (typeof text === "string") {
                accumulatedText += text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulatedText } : m
                  )
                );
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to connect to AI service. Please try again.");
      // Remove the empty assistant message on error
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleSuggestionClick = useCallback((question: string) => {
    if (isLoading) return;
    sendMessage(question);
  }, [isLoading, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Root
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Your AI Cybersecurity Assistant
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <CyberButton variant="danger" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4" />
            Clear
          </CyberButton>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex-shrink-0">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Chat area */}
      <CyberCard className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-6">
                <Terminal className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Welcome to Root
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                I&apos;m your AI cybersecurity assistant. Ask me anything about
                ethical hacking, penetration testing, or cybersecurity concepts.
              </p>

              {/* Suggested questions */}
              <div className="w-full max-w-2xl">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Try asking:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSuggestionClick(question)}
                      disabled={isLoading}
                      className="text-left p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {isLoading && messages.length > 0 && messages[messages.length - 1].content === "" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Root anything about cybersecurity..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50"
            />
            <CyberButton 
              type="submit" 
              disabled={!input.trim()}
              className={input.trim() ? "bg-primary hover:bg-primary/80" : ""}
            >
              <Send className="w-5 h-5" />
            </CyberButton>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Root provides educational information only. Always practice ethical
            hacking responsibly.
          </p>
        </div>
      </CyberCard>
    </div>
  );
}
