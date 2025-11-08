import React, { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [openChat, setOpenChat] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // ✅ Send message to Flask backend
  async function send(userMessage) {
    const messageToSend = userMessage || msg;
    if (!messageToSend.trim()) return;

    setHistory((h) => [...h, { from: "user", text: messageToSend }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5023/chat", { message: messageToSend });
      const data = res.data;
      setLoading(false);

      // If backend returns clarification options (like "fees?")
      if (data.options && Array.isArray(data.options)) {
        setHistory((h) => [
          ...h,
          {
            from: "bot",
            text: data.answer,
            options: data.options,
            intent: data.predicted_intent,
          },
        ]);
        return;
      }

      // Standard answer handling
      let answerLines = [];
      if (!data.answer) {
        answerLines = ["🤖 No response from server."];
      } else if (typeof data.answer === "string") {
        answerLines = data.answer.split("\n");
      } else if (Array.isArray(data.answer)) {
        answerLines = data.answer.map((line, i) => `${i + 1}. ${line}`);
      } else {
        answerLines = ["🤖 Unable to parse server response."];
      }

      setHistory((h) => [
        ...h,
        {
          from: "bot",
          text: answerLines,
          intent: data.predicted_intent,
        },
      ]);
    } catch (err) {
      setLoading(false);
      setHistory((h) => [
        ...h,
        { from: "bot", text: "⚠️ Unable to connect to backend!" },
      ]);
    }
  }

  // ✅ Quick backend test
  async function testBackend() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5023/");
      setLoading(false);
      setHistory((h) => [
        ...h,
        { from: "bot", text: `✅ Backend says: ${res.data.message}` },
      ]);
    } catch {
      setLoading(false);
      setHistory((h) => [
        ...h,
        { from: "bot", text: "⚠️ Unable to reach backend!" },
      ]);
    }
  }

  // ✅ Clickable option (for clarification)
  const handleOptionClick = (option) => {
    send(option);
  };

  return (
    <div className="chatgpt-root">
      <style>{`
        :root {
          --chatgpt-green: #74aa9c;
          --chatgpt-purple: #ab68ff;
          --chatgpt-bg: #f7f7fa;
          --chatgpt-white: #fff;
          --chatgpt-text: #343541;
          --user-bubble: var(--chatgpt-purple);
          --bot-bubble: var(--chatgpt-green);
          --bubble-bg: var(--chatgpt-white);
        }
        * { box-sizing: border-box; }
        .chatgpt-root {
          font-family: 'Inter', 'Segoe UI', system-ui, Arial, sans-serif;
          min-height: 100vh;
          color: var(--chatgpt-text);
        }
        .chat-toggle {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 99;
        }
        .chat-window {
          position: fixed;
          right: 24px;
          bottom: 90px;
          width: 440px;
          background: var(--chatgpt-white);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(52,53,65,0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid #e1e1e1;
        }
        .chat-header {
          padding: 14px 18px;
          background: linear-gradient(90deg, #74aa9c, #ab68ff);
          color: #fff;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .avatar {
          width: 40px;
          height: 36px;
          border-radius: 12px;
          background: var(--chatgpt-white);
          color: var(--chatgpt-green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
        }
        .chat-title-box {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .chat-title {
          font-weight: 800;
          font-size: 16px;
        }
        .chat-desc {
          font-size: 12px;
          color: #eaffee;
        }
        .chat-body {
          padding: 16px;
          height: 400px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--chatgpt-bg);
        }
        .bubble {
          max-width: 80%;
          padding: 12px 18px;
          border-radius: 15px;
          font-size: 15px;
          white-space: pre-line;
          margin-bottom: 3px;
          box-shadow: 0 2px 7px rgba(52,53,65,0.08);
        }
        .bubble.user {
          align-self: flex-end;
          background: var(--user-bubble);
          color: #fff;
          border-bottom-right-radius: 6px;
        }
        .bubble.bot {
          align-self: flex-start;
          background: var(--bot-bubble);
          color: #fff;
          border-bottom-left-radius: 6px;
        }
        .chat-composer {
          display: flex;
          gap: 8px;
          padding: 14px;
          border-top: 1px solid #eee;
          background: var(--chatgpt-white);
        }
        .chat-composer input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d4d4d4;
          font-size: 15px;
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--chatgpt-green) 80%, var(--chatgpt-purple) 120%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0 20px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          height: 40px;
        }
        .btn-primary:active {
          opacity: 0.87;
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .option-btn {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 13px;
          cursor: pointer;
          color: #333;
        }
        .option-btn:hover {
          background: #74aa9c;
          color: white;
        }
      `}</style>

      {/* Floating Chat Toggle */}
      <div className="chat-toggle">
        <button className="btn-primary" onClick={() => setOpenChat((s) => !s)}>
          {openChat ? "Close Chat" : "Open Chat"}
        </button>
        {openChat && (
          <button
            className="btn-primary"
            style={{ marginLeft: "8px" }}
            onClick={testBackend}
            disabled={loading}
          >
            Test Backend
          </button>
        )}
      </div>

      {/* Chat Window */}
      {openChat && (
        <div className="chat-window" role="dialog" aria-label="ChatGPT-Inspired Chat">
          <div className="chat-header">
            <div className="avatar">N</div>
            <div className="chat-title-box">
              <span className="chat-title">NIET Buddy</span>
              <span className="chat-desc">Placement & Admission Help</span>
            </div>
          </div>

          <div className="chat-body">
            {history.map((m, i) => (
              <div key={i} className={`bubble ${m.from}`}>
                {Array.isArray(m.text)
                  ? m.text.map((line, idx) => (
                      <div key={idx} style={{ marginBottom: "4px" }}>
                        {line}
                      </div>
                    ))
                  : m.text}
                {m.options && (
                  <div className="options">
                    {m.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="option-btn"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {m.intent && (
                  <div style={{ fontSize: "12px", marginTop: "6px", color: "#e0f7f1" }}>
                    Intent: {m.intent}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="bubble bot">⏳ Loading...</div>}
          </div>

          <div className="chat-composer">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button className="btn-primary" onClick={() => send()} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
