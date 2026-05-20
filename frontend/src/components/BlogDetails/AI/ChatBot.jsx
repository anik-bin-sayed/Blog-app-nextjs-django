"use client";

import { useProfileQuery } from "@/redux/services/auth/authApi";
import { useChatMutation } from "@/redux/services/blogs/agentApi";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BiSolidSend } from "react-icons/bi";
import { FaAirbnb, FaLanguage } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const ChatBot = ({ selectedText, setSelectedText, setIsChatOpen }) => {
  const [language, setLanguage] = useState("english");

  const { data: userData } = useProfileQuery();
  const [chat, { isLoading: isChatLoading }] = useChatMutation();

  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! Ask me anything about the selected text." },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasSentInitial = useRef(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isSending || isChatLoading) return;

      const userMessage = text.trim();
      setInputValue("");
      setIsSending(true);

      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

      try {
        const conversationHistory = messages.slice(-5).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await chat({
          message: userMessage,
          context: conversationHistory,
          selectedText: selectedText || null,
          language: language,
        }).unwrap();

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: response.reply || response.message || response,
          },
        ]);

        if (setSelectedText) {
          setSelectedText("");
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              error?.data?.message ||
              "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [
      chat,
      language,
      isChatLoading,
      isSending,
      messages,
      selectedText,
      setSelectedText,
    ],
  );

  useEffect(() => {
    if (
      selectedText &&
      selectedText.trim().length > 0 &&
      !hasSentInitial.current &&
      !isSending &&
      !isChatLoading
    ) {
      hasSentInitial.current = true;
      sendMessage(selectedText);
    }
  }, [selectedText, sendMessage, isSending, isChatLoading]);

  useEffect(() => {
    if (selectedText && !hasSentInitial.current) {
      setInputValue(selectedText);
    }
  }, [selectedText]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isSending && !isChatLoading) {
      sendMessage(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const userInitial = userData?.username?.[0] || userData?.email?.[0] || "U";

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUpFade">
      <div
        className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
        style={{
          width: "400px",
          maxWidth: "calc(100vw - 2rem)",
          height: "85vh",
          maxHeight: "700px",
        }}
      >
        <div className="bg-linear-to-r from-gray-100 to-gray-200 px-4 py-3 flex items-center justify-between shrink-0 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-100 p-2">
              <FaAirbnb className="text-indigo-600 text-lg" />
            </div>
            <div>
              <span className="text-gray-800 text-sm font-semibold select-none">
                AI Assistant
              </span>
              <p className="text-xs text-gray-500">Powered by Advanced AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-gray-600 hover:rotate-90 transition-all duration-200  rounded-full cursor-pointer border w-8 h-8 flex items-center justify-center"
            aria-label="Close chat"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 bg-linear-to-b from-gray-50 to-white"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 animate-fadeIn ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaAirbnb className="text-indigo-600 text-sm" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] wrap-break-word shadow-sm ${
                  msg.role === "user"
                    ? "bg-amber-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center capitalize font-semibold text-gray-700 text-sm">
                  {userInitial}
                </div>
              )}
            </div>
          ))}

          {(isSending || isChatLoading) && (
            <div className="flex items-start gap-2 animate-fadeIn">
              <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <FaAirbnb className="text-indigo-600 text-sm" />
              </div>
              <div className="bg-white rounded-lg px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-bl-none">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    •
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    •
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
            <span className="text-gray-700 text-sm font-medium flex items-center gap-1">
              <FaLanguage className="h-4 w-4 text-black" />
              Response language :
            </span>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-indigo-400 block w-32 py-2 px-3 pr-8 cursor-pointer hover:bg-gray-100 transition-colors duration-200 outline-0"
              >
                <option value="english">🇬🇧 English</option>
                <option value="bangla">🇧🇩 Bangla</option>
                <option value="hindi">🇮🇳 Hindi</option>
                <option value="spanish">🇪🇸 Spanish</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <IoIosArrowDown className="fill-current h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about the selected text..."
                className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white resize-none border border-gray-200 transition-all"
                style={{ minHeight: "40px", maxHeight: "120px" }}
                disabled={isSending || isChatLoading}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending || isChatLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500 shadow-sm hover:shadow"
            >
              <BiSolidSend size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUpFade {
          animation: slideUpFade 0.25s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
