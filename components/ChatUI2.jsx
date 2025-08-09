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
  .message {
    animation: fadeSlideInScale 0.3s forwards;
  }
  @keyframes fadeSlideInScale {
    0% {
      opacity: 0;
      transform: translateY(15px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .message.bot {
    box-shadow: 0 0 15px 1px rgba(59, 130, 246, 0.7);
  }

  .chat-form {
    background: linear-gradient(270deg, #1e1e1e, #222e3e, #1e1e1e);
    background-size: 600% 600%;
    animation: gradientShift 15s ease infinite;
  }

  @keyframes gradientShift {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }

  .typing-dot {
    animation: pulseScale 1.2s infinite ease-in-out;
  }
  .typing-dot:nth-child(2) {
    animation-delay: 0.15s;
  }
  .typing-dot:nth-child(3) {
    animation-delay: 0.3s;
  }
  @keyframes pulseScale {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
  }

  button.send-btn:hover:not(:disabled) {
    animation: pulseGlow 1.5s infinite alternate;
  }
  @keyframes pulseGlow {
    0% {
      box-shadow: 0 0 5px #3b82f6;
      transform: scale(1);
    }
    100% {
      box-shadow: 0 0 20px #3b82f6;
      transform: scale(1.05);
    }
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


