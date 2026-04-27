import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de BPO SmartFlow, une plateforme d'externalisation de services professionnels basée à Madagascar. 
Tu aides les utilisateurs à :
- Comprendre les services BPO disponibles (développement web, support client, comptabilité, etc.)
- Soumettre ou suivre leurs candidatures et projets
- Obtenir des informations sur les délais, budgets et équipes
- Naviguer sur la plateforme

Réponds toujours en français, de manière professionnelle mais chaleureuse. Sois concis (max 3 phrases par réponse sauf si plus de détails sont demandés).
Si une question dépasse tes connaissances sur BPO SmartFlow, propose de contacter l'équipe directement.`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bonjour  Je suis l'assistant BPO SmartFlow. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply =
        data.content?.[0]?.text ||
        "Je n'ai pas pu traiter votre demande. Veuillez réessayer.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Une erreur s'est produite. Veuillez vérifier votre connexion et réessayer.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cb-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        .cb-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #6366f1 100%);
          box-shadow: 0 4px 24px rgba(96,165,250,0.45), 0 0 0 0 rgba(96,165,250,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
          animation: cb-pulse 3s infinite;
        }
        .cb-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 32px rgba(96,165,250,0.6), 0 0 0 8px rgba(96,165,250,0.1);
        }
        .cb-fab svg { transition: transform 0.3s; }
        .cb-fab.open svg { transform: rotate(45deg); }

        @keyframes cb-pulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(96,165,250,0.45), 0 0 0 0 rgba(96,165,250,0.3); }
          50% { box-shadow: 0 4px 24px rgba(96,165,250,0.45), 0 0 0 10px rgba(96,165,250,0); }
        }

        .cb-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #0f172a;
          animation: cb-blink 2s infinite;
        }
        @keyframes cb-blink {
          0%,100% { opacity:1; } 50% { opacity:0.4; }
        }

        .cb-window {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9998;
          width: 370px;
          height: 520px;
          border-radius: 20px;
          overflow: hidden;
          background: #0f172a;
          border: 1px solid rgba(96,165,250,0.2);
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
          display: flex;
          flex-direction: column;
          transform-origin: bottom right;
          transform: scale(0.85) translateY(20px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
        }
        .cb-window.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .cb-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(99,102,241,0.08) 100%);
          border-bottom: 1px solid rgba(96,165,250,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .cb-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(96,165,250,0.4);
        }
        .cb-header-info { flex: 1; }
        .cb-header-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #f1f5f9;
          letter-spacing: 0.02em;
        }
        .cb-header-status {
          font-size: 11px;
          color: #22c55e;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 1px;
        }
        .cb-header-status::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
        }
        .cb-close-btn {
          background: rgba(255,255,255,0.05);
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cb-close-btn:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

        .cb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .cb-messages::-webkit-scrollbar { width: 4px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }

        .cb-msg {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          animation: cb-fadein 0.3s ease;
        }
        .cb-msg.user { flex-direction: row-reverse; }

        @keyframes cb-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cb-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.55;
          font-weight: 400;
        }
        .cb-msg.assistant .cb-bubble {
          background: rgba(30,41,59,0.95);
          color: #e2e8f0;
          border-radius: 16px 16px 16px 4px;
          border: 1px solid rgba(96,165,250,0.1);
        }
        .cb-msg.user .cb-bubble {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          border-radius: 16px 16px 4px 16px;
        }

        .cb-msg-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .cb-msg.user .cb-msg-avatar {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .cb-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 14px;
          background: rgba(30,41,59,0.95);
          border: 1px solid rgba(96,165,250,0.1);
          border-radius: 16px 16px 16px 4px;
          width: fit-content;
        }
        .cb-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          animation: cb-bounce 1.2s infinite;
        }
        .cb-dot:nth-child(2) { animation-delay: 0.2s; }
        .cb-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cb-bounce {
          0%,80%,100% { transform: translateY(0); opacity:0.4; }
          40% { transform: translateY(-6px); opacity:1; }
        }

        .cb-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 4px 16px 10px;
          flex-shrink: 0;
        }
        .cb-chip {
          background: rgba(96,165,250,0.08);
          border: 1px solid rgba(96,165,250,0.2);
          color: #93c5fd;
          font-size: 11.5px;
          padding: 5px 11px;
          border-radius: 99px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .cb-chip:hover {
          background: rgba(96,165,250,0.15);
          border-color: rgba(96,165,250,0.4);
          color: #bfdbfe;
        }

        .cb-footer {
          padding: 12px 16px;
          border-top: 1px solid rgba(96,165,250,0.1);
          background: rgba(15,23,42,0.9);
          display: flex;
          gap: 8px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .cb-input-wrap {
          flex: 1;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(96,165,250,0.15);
          border-radius: 12px;
          padding: 10px 14px;
          transition: border-color 0.2s;
        }
        .cb-input-wrap:focus-within {
          border-color: rgba(96,165,250,0.5);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.07);
        }
        .cb-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #f1f5f9;
          font-size: 13.5px;
          resize: none;
          max-height: 80px;
          line-height: 1.5;
          font-family: 'DM Sans', sans-serif;
        }
        .cb-input::placeholder { color: #475569; }

        .cb-send {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }
        .cb-send:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(99,102,241,0.5);
        }
        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }

        .cb-branding {
          text-align: center;
          font-size: 10.5px;
          color: #334155;
          padding: 6px 0 0;
          letter-spacing: 0.04em;
        }

        @media (max-width: 420px) {
          .cb-window { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
          .cb-fab { right: 16px; bottom: 16px; }
        }
      `}</style>

      <div className="cb-root">
        {/* Floating Button */}
        <button
          className={`cb-fab ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le chat"
        >
          <div className="cb-badge" />
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>

        {/* Chat Window */}
        <div className={`cb-window ${isVisible ? "visible" : ""}`}>
          {/* Header */}
          <div className="cb-header">
            <div className="cb-avatar">🤖</div>
            <div className="cb-header-info">
              <div className="cb-header-name">BPO SmartFlow</div>
              <div className="cb-header-status">Assistant en ligne</div>
            </div>
            <button className="cb-close-btn" onClick={() => setIsOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg ${msg.role}`}>
                <div className="cb-msg-avatar">
                  {msg.role === "assistant" ? "🤖" : "👤"}
                </div>
                <div className="cb-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="cb-msg assistant">
                <div className="cb-msg-avatar">🤖</div>
                <div className="cb-typing">
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips (shown only at start) */}
          {messages.length <= 1 && (
            <div className="cb-suggestions">
              {["Nos services", "Soumettre un projet", "Suivre ma candidature", "Délais & tarifs"].map((s) => (
                <button
                  key={s}
                  className="cb-chip"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="cb-footer">
            <div className="cb-input-wrap">
              <textarea
                ref={inputRef}
                className="cb-input"
                placeholder="Écrivez votre message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
            <button
              className="cb-send"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Envoyer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div className="cb-branding">Propulsé par BPO SmartFlow AI</div>
        </div>
      </div>
    </>
  );
}
