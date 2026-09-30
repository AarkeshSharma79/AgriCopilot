import { useState } from "react";
import { Send, Bot } from "lucide-react";
import Navbar from "../components/Navbar";
import { askAssistant } from "../services/aiService";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello Ramesh! How can I help you with your farm today?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const { reply } = await askAssistant(userMsg.text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the assistant service right now." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen">
      <Navbar />
      <main className="px-6 pb-6 flex-1 flex flex-col min-h-0">
        <div className="card flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center">
              <Bot size={16} className="text-leaf-600" />
            </span>
            <p className="card-title">AI Assistant</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-forest-700 text-white"
                    : "bg-leaf-50 text-forest-950"
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="bg-leaf-50 text-forest-950/50 text-sm rounded-2xl px-4 py-2.5 w-fit">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 border-t border-forest-950/5 pt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border border-forest-950/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500"
            />
            <button onClick={send} className="btn-primary px-4">
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
