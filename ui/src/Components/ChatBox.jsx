import React, { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [openChat, setOpenChat] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function send(userMessage) {
    const messageToSend = userMessage || msg;
    if (!messageToSend.trim()) return;

    setHistory((h) => [...h, { from: "user", text: messageToSend }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("https://niet-chatbot-back.onrender.com/chat", {
        message: messageToSend,
      });
      const data = res.data;
      setLoading(false);

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

      let answerLines = [];
      if (!data.answer) {
        answerLines = ["🤖 No response from server."];
      } else if (typeof data.answer === "string") {
        answerLines = data.answer.split("\n");
      } else if (Array.isArray(data.answer)) {
        answerLines = data.answer.map((line, i) => `${i + 1}. ${line}`);
      } else {
        answerLines = ["Unable to parse server response."];
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

  async function testBackend() {
    setLoading(true);
    try {
      const res = await axios.get("https://niet-chatbot-back.onrender.com/");
      setLoading(false);
      setHistory((h) => [
        ...h,
        { from: "bot", text: `Backend says: ${res.data.message}` },
      ]);
    } catch {
      setLoading(false);
      setHistory((h) => [
        ...h,
        { from: "bot", text: "Unable to reach backend!" },
      ]);
    }
  }

  const handleOptionClick = (option) => send(option);

  return (
    <div className="chatgpt-root">
      <style>{`
        :root {
          --niet-red: #e11d48;
          --niet-dark: #0f172a;
          --niet-gradient: linear-gradient(90deg, #0f172a, #1e293b, #e11d48);
        }

        * { box-sizing: border-box; }
        .chatgpt-root {
          font-family: 'Inter', 'Segoe UI', system-ui, Arial, sans-serif;
          color: #1e293b;
        }

        /* Floating Chat Buttons */
        .chat-toggle {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 99;
          display: flex;
          flex-direction: row;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(to right, #e11d48, #be123c);
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);
          transition: all 0.3s ease;
          min-width: 130px;
        }

        .btn-primary:hover {
          transform: scale(1.05);
          background: linear-gradient(to right, #be123c, #e11d48);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Chat window styling */
        .chat-window {
          position: fixed;
          right: 24px;
          bottom: 90px;
          width: 420px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid #e5e7eb;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .chat-header {
          padding: 16px 20px;
          background: var(--niet-gradient);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: white;
          color: var(--niet-red);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
        }

        .chat-title-box {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .chat-title {
          font-weight: 700;
          font-size: 16px;
        }

        .chat-desc {
          font-size: 12px;
          color: #e2e8f0;
        }

        .chat-body {
          background: url('/college-bg.jpg') no-repeat center center/cover;
          backdrop-filter: blur(8px);
          padding: 16px;
          height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 15px;
          line-height: 1.4;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.3s ease;
        }

        .bubble.user {
          align-self: flex-end;
          background: linear-gradient(to right, #e11d48, #be123c);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .bubble.bot {
          align-self: flex-start;
          background: #fff;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-composer {
          display: flex;
          gap: 10px;
          padding: 14px;
          border-top: 1px solid #e5e7eb;
          background: #fff;
        }

        .chat-composer input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 9999px;
          border: 1px solid #d1d5db;
          font-size: 15px;
          background: #f9fafb;
        }

        .chat-composer input:focus {
          outline: none;
          border-color: var(--niet-red);
          box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.3);
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .option-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 6px 12px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: var(--niet-red);
          color: white;
          border-color: var(--niet-red);
        }

        /* ✅ Responsive Design */

        @media (max-width: 768px) {
          .chat-window {
            right: 16px;
            bottom: 80px;
            width: 90%;
            max-width: 400px;
          }

          .btn-primary {
            font-size: 13px;
            padding: 8px 14px;
            min-width: 110px;
          }

          .chat-body {
            height: 350px;
          }
        }

        @media (max-width: 480px) {
          .chat-window {
            width: 100%;
            right: 0;
            left: 0;
            bottom: 0;
            border-radius: 0;
            height: 100vh;
          }

          .chat-header {
            padding: 14px;
          }

          .chat-body {
            height: calc(100vh - 140px);
            padding: 12px;
          }

          .chat-toggle {
            right: 12px;
            bottom: 12px;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          }

          .btn-primary {
            width: 100%;
            font-size: 14px;
            padding: 12px;
            border-radius: 10px;
          }

          .chat-composer {
            flex-direction: column;
            gap: 8px;
            padding: 10px;
          }

          .chat-composer input {
            width: 100%;
            border-radius: 8px;
          }

          .bubble {
            max-width: 90%;
            font-size: 14px;
            padding: 10px 12px;
          }
        }
      `}</style>

      {/* Floating Buttons */}
      <div className="chat-toggle">
        <button
          className="btn-primary"
          onClick={() => setOpenChat((s) => !s)}
        >
          {openChat ? "Close Chat" : "Chat with NIET"}
        </button>

        {openChat && (
          <button
            className="btn-primary"
            onClick={testBackend}
            disabled={loading}
          >
            Test Backend
          </button>
        )}
      </div>

      {/* Chat Window */}
      {openChat && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="avatar">N</div>
              <div className="chat-title-box">
                <span className="chat-title">NIET Assistant</span>
                <span className="chat-desc">Admissions • Placement • Info</span>
              </div>
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
              </div>
            ))}
            {loading && <div className="bubble bot loading">⏳ Thinking...</div>}
          </div>

          <div className="chat-composer">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              className="btn-primary"
              onClick={() => send()}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
