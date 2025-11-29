"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  User,
  SendHorizontal,
  Trash2,
  ChevronDown,
  Sparkles,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import ThinkingLoader from "./ThinkingLoader";
import { siteConfig } from "@/config/site";

interface SuggestedPrompt {
  icon: string;
  text: string;
  description: string;
}

interface AskAnythingProps {
  suggestedPrompts?: SuggestedPrompt[];
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export default function AskAnything({
  suggestedPrompts = [],
}: AskAnythingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldScrollRef = useRef(true);

  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current?.focus();
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    shouldScrollRef.current = isNearBottom;
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      shouldScrollRef.current = true;

      const userMessage: Message = { role: "user", content: messageText };
      const newMessages: Message[] = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "__THINKING_LOADER__" },
      ]);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            ...(messages.length > 0 && {
              chat_history: messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
            }),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setMessages((prev) =>
          prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data?.content) {
          const assistantMessage: Message = {
            role: "assistant",
            content: data.content,
          };
          setMessages((prev) => [
            ...prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
            assistantMessage,
          ]);
          return;
        }

        if (data?.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (fetchError) {
        setMessages((prev) =>
          prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
        );
        setMessages((prev) => [
          ...prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
          {
            role: "assistant",
            content:
              "I apologize for the inconvenience. There seems to be a connection issue. Please try again later.",
          },
        ]);

        if (fetchError instanceof Error) {
          setError(`Connection issue: ${fetchError.message}`);
        } else {
          setError("Connection issue. Please try again later.");
        }
      }
    } catch (err: unknown) {
      setMessages((prev) =>
        prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
      );
      let errorMessage =
        "I apologize for the inconvenience. There seems to be a connection issue.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "The request took too long. Please try again.";
        } else {
          errorMessage = `Connection issue: ${err.message}`;
        }
      }
      setError(errorMessage);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.content !== "__THINKING_LOADER__"),
        {
          role: "assistant",
          content:
            "I apologize for the inconvenience. There seems to be a connection issue. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptClick = async (prompt: string) => {
    setInput(prompt);
    await sendMessage(prompt);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className={cn(
          "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent",
          isEmpty ? "flex items-center justify-center" : "space-y-6 pb-28 pt-4",
        )}
      >
        {isEmpty ? (
          // Empty State - Welcome & Suggested Prompts
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto px-4 py-8"
          >
            {/* Welcome Message */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative w-20 h-20 mx-auto mb-6"
              >
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30" />
                <div
                  className={cn(
                    "absolute inset-2 rounded-lg flex items-center justify-center",
                    isDark ? "bg-gray-900" : "bg-white",
                  )}
                >
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>
              <h2
                className={cn(
                  "text-2xl font-bold mb-3",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                How can I help you today?
              </h2>
              <p
                className={cn(
                  "text-base",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Ask me anything about {siteConfig.ownerName}&apos;s work, projects, or expertise
              </p>
            </div>

            {/* Suggested Prompts Grid */}
            {suggestedPrompts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => handlePromptClick(prompt.text)}
                    className={cn(
                      "group relative p-5 rounded-2xl text-left transition-all duration-300",
                      "border-2 hover:border-blue-500/50",
                      "hover:shadow-xl hover:shadow-blue-500/10",
                      "hover:-translate-y-1",
                      isDark
                        ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800"
                        : "bg-white border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                    <div className="relative flex items-start gap-4">
                      <span className="text-3xl">{prompt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-semibold text-sm leading-tight mb-1.5",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {prompt.text}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDark ? "text-gray-500" : "text-gray-500",
                          )}
                        >
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // Messages List
          <div className="space-y-6 px-2 sm:px-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {/* Assistant Avatar */}
                  {message.role === "assistant" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                        "bg-gradient-to-br from-blue-500 to-purple-600",
                        "shadow-lg shadow-blue-500/25",
                      )}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%]",
                      message.role === "user"
                        ? cn(
                            "rounded-2xl rounded-br-md px-5 py-3",
                            "bg-gradient-to-br from-blue-500 to-blue-600",
                            "text-white shadow-lg shadow-blue-500/20",
                          )
                        : cn(
                            "rounded-2xl rounded-bl-md px-5 py-4",
                            isDark
                              ? "bg-gray-800/80 border border-gray-700/50"
                              : "bg-white border border-gray-200 shadow-sm",
                          ),
                    )}
                  >
                    {message.content === "__THINKING_LOADER__" ? (
                      <ThinkingLoader />
                    ) : message.role === "user" ? (
                      <p className="text-sm sm:text-base leading-relaxed">
                        {message.content}
                      </p>
                    ) : (
                      <div
                        className={cn(
                          "prose prose-sm max-w-none",
                          "prose-p:my-2 prose-p:leading-relaxed",
                          "prose-headings:mt-4 prose-headings:mb-2",
                          "prose-ul:my-2 prose-li:my-0.5",
                          "prose-strong:font-semibold",
                          isDark
                            ? "prose-invert prose-p:text-gray-200 prose-headings:text-white prose-strong:text-white"
                            : "prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900",
                        )}
                      >
                        <ReactMarkdown
                          components={{
                            a: ({ ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "font-medium underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-500",
                                  "transition-colors",
                                  isDark
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700",
                                )}
                              />
                            ),
                            code: ({ inline, ...props }: CodeProps) => (
                              <code
                                {...props}
                                className={cn(
                                  "font-mono",
                                  inline
                                    ? cn(
                                        "px-1.5 py-0.5 rounded-md text-xs",
                                        isDark
                                          ? "bg-gray-700 text-gray-200"
                                          : "bg-gray-100 text-gray-800",
                                      )
                                    : cn(
                                        "block p-4 rounded-xl overflow-x-auto text-xs",
                                        isDark
                                          ? "bg-gray-900 text-gray-200"
                                          : "bg-gray-50 text-gray-800",
                                      ),
                                )}
                              />
                            ),
                            pre: ({ ...props }) => (
                              <pre
                                {...props}
                                className="bg-transparent p-0 m-0"
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {message.role === "user" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      <User className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-32 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full shadow-lg h-10 w-10",
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:bg-gray-50 border border-gray-200",
              )}
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div
        className={cn(
          "sticky bottom-0 pt-4 pb-4 px-2 sm:px-4",
          isDark
            ? "bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent"
            : "bg-gradient-to-t from-white via-white/95 to-transparent",
        )}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-500"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative rounded-2xl shadow-2xl",
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200",
          )}
        >
          {/* Textarea - full width with right padding for buttons */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading}
            rows={1}
            className={cn(
              "w-full resize-none border-0 bg-transparent rounded-2xl",
              "focus:outline-none focus:ring-0",
              "placeholder:text-gray-500",
              "text-sm sm:text-base",
              "py-4 pl-4",
              messages.length > 0 && !loading ? "pr-28" : "pr-16",
              "max-h-[120px] min-h-[56px]",
              isDark ? "text-white" : "text-gray-900",
            )}
          />

          {/* Buttons - absolutely positioned for perfect vertical centering */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {messages.length > 0 && !loading && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleClearChat}
                className={cn(
                  "h-10 w-10 rounded-full",
                  "flex items-center justify-center",
                  "hover:bg-red-500/10 hover:text-red-500",
                  "transition-all duration-200",
                )}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                "flex items-center justify-center",
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                "text-white shadow-lg shadow-blue-500/25",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:shadow-none",
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </motion.form>

        {/* Keyboard hint */}
        <p
          className={cn(
            "text-xs text-center mt-2",
            isDark ? "text-gray-600" : "text-gray-400",
          )}
        >
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
