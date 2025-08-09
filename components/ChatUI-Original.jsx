"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      text:
        "Peace researcher.\n\nMy name is Jabril your personal assistant here at the Black Civilization Research Archive.\n\nHow may I be of service to you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();

      let botText = data.reply || "No response from AI";

      try {
        const parsed = JSON.parse(botText);
        botText = parsed.output || botText;
      } catch {
        // Not JSON
      }

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "There was an error processing your message. Please try again.",
        },
      ]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <style>{`
        /* Container */
        .chat-container {
          max-width: 800px;
          margin: 40px auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          border: 1px solid #444;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: 80vh;
          background-color: #181818;
          color: #eee;
          box-shadow: 0 0 15px rgba(0,0,0,0.8);
        }

        /* Messages area */
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Individual message bubbles */
        .message {
          max-width: 75%;
          padding: 14px 22px;
          border-radius: 24px;
          white-space: pre-wrap;
          font-size: 16px;
          opacity: 0;
          transform: translateY(15px);
          animation: fadeSlideIn 0.3s forwards;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          line-height: 1.4;
        }

        .message.user {
          background-color: #3b82f6;
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 8px rgba(59,130,246,0.6);
        }

        .message.bot {
          background-color: #2a2a2a;
          color: #ddd;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(255,255,255,0.1);
        }

        /* Typing indicator bubble */
        .typing {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          max-width: 60px;
          padding: 14px 20px;
          border-radius: 24px;
          background-color: #2a2a2a;
          color: #ddd;
          box-shadow: 0 2px 8px rgba(255,255,255,0.1);
          animation: fadeSlideIn 0.3s forwards;
          align-self: flex-start;
          gap: 6px;
          height: 30px;
        }

        /* Animated dots */
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: #ddd;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }

        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }

        /* Animation keyframes */
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Input area */
        form.chat-form {
          display: flex;
          border-top: 1px solid #444;
          padding: 12px 16px;
          background-color: #222;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }

        textarea.chat-input {
          flex: 1;
          border-radius: 20px;
          padding: 12px 16px;
          border: none;
          resize: none;
          font-size: 16px;
          background-color: #333;
          color: #eee;
          font-family: inherit;
          outline-offset: 2px;
          transition: background-color 0.3s;
        }

        textarea.chat-input:focus {
          background-color: #444;
          outline: 2px solid #3b82f6;
        }

        button.send-btn {
          margin-left: 14px;
          padding: 0 26px;
          border-radius: 20px;
          border: none;
          background-color: #3b82f6;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button.send-btn:disabled {
          background-color: #555;
          cursor: not-allowed;
        }

        button.send-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }
      `}</style>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`message ${message.role === "user" ? "user" : "bot"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {(() => {
                if (typeof message.text === "string") {
                  try {
                    const parsed = JSON.parse(message.text);
                    return parsed.output || message.text;
                  } catch {
                    return message.text;
                  }
                }
                return message.text;
              })()}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="typing" aria-label="Jabril is typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-form">
          <textarea
            rows={1}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                sendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}


