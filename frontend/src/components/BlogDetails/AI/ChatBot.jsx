"use client";

import { useProfileQuery } from "@/redux/services/auth/authApi";
import React, { useEffect, useState, useRef } from "react";
import { BiSolidSend } from "react-icons/bi";
import { FaAirbnb } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const ChatBot = ({ selectedText, setSelectedText, setIsChatOpen }) => {
  const { data } = useProfileQuery();

  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! Ask me anything about the selected text." },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasSentInitial = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await mockAIResponse(selectedText, userMessage);
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
      setSelectedText("");
      setInputValue("");
      setIsLoading(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedText &&
      selectedText.trim().length > 0 &&
      !hasSentInitial.current
    ) {
      hasSentInitial.current = true;
      sendMessage(selectedText);
    }
  }, [selectedText]);

  useEffect(() => {
    if (selectedText) {
      setInputValue(selectedText);
    }
  }, [selectedText]);

  const handleSendMessage = () => {
    sendMessage(inputValue);
    setSelectedText("");
  };

  const mockAIResponse = (selectedText, question) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Here's what I understand about "${selectedText.slice(0, 50)}...": ${question} – (AI response would be generated here.)`,
        );
      }, 1000);
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUpFade">
      <div
        className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
        style={{
          width: "400px",
          maxWidth: "calc(150vw - 2rem)",
          height: "85vh",
        }}
      >
        {/* Header */}
        <div className="bg-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="rounded-full flex items-center justify-center">
              <span className="text-xl text-black p-2 bg-gray-200 rounded-full flex items-center justify-center">
                <FaAirbnb />
              </span>
            </div>
            <span className="text-black text-sm font-medium select-none">
              Ask AI
            </span>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-black hover:rotate-180 text-sm transition bg-gray-300 p-2 rounded-full cursor-pointer"
            aria-label="Close chat"
          >
            <RxCross2 />
          </button>
        </div>

        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-1.5 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "ai" && (
                <span className="text-xs bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  <FaAirbnb />
                </span>
              )}
              <div
                className={`rounded-lg px-2 py-1 text-xs max-w-[85%] select-none ${
                  msg.role === "user"
                    ? "bg-amber-500/90 text-black"
                    : "bg-white text-gray-700 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <span className="text-xs bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center shrink-0 capitalize">
                  {data?.username[0]}
                </span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-1.5">
              <span className="text-xs bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center">
                <FaAirbnb />
              </span>
              <div className="bg-white rounded-lg px-2 py-1 text-xs text-gray-500">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0">
          <textarea
            type="text"
            rows={5}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 text-sm bg-gray-100 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"
            aria-label="Chat input"
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-yellow-600 text-black rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiSolidSend />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpFade {
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
          animation: slideUpFade 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
