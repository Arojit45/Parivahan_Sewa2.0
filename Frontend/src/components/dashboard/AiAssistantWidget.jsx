import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Maximize2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { askVehicle } from "../../utils/assistantApi";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";

const QUICK_CHIPS = (t) => [
  t.dash?.q1 || "Is my pollution certificate valid?",
  t.dash?.q2 || "Any pending traffic challans?",
  t.dash?.q3 || "When is my next service due?",
];

const AiAssistantWidget = () => {
  const navigate = useNavigate();
  const { selectedVehicleId, dashboard } = useDashboard();
  const { t, language } = useLanguage();

  // Derive vehicle label from real data for the greeting message
  const vehicleName = dashboard?.vehicleCard
    ? `${dashboard.vehicleCard.manufacturer} ${dashboard.vehicleCard.model}`
    : "your vehicle";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: (t.dash?.greetingMsg || "Hello! ðŸ‘‹ Ask me anything about {vehicle} â€” health, documents, challans, or live location.").replace("{vehicle}", vehicleName),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset chat when vehicle switches or load from session
  useEffect(() => {
    if (!selectedVehicleId) return;
    const saved = sessionStorage.getItem(`askMyVehicleMessages_${selectedVehicleId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setMessages([
      {
        role: "assistant",
        text: (t.dash?.greetingMsg || "Hello! ðŸ‘‹ Ask me anything about {vehicle} â€” health, documents, challans, or live location.").replace("{vehicle}", vehicleName),
      },
    ]);
  }, [selectedVehicleId, vehicleName, t.dash?.greetingMsg]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    if (!text?.trim() || isLoading || !selectedVehicleId) return;
    const question = text.trim();
    setInput("");

    setMessages((prev) => {
      const next = [...prev, { role: "user", text: question }];
      sessionStorage.setItem(`askMyVehicleMessages_${selectedVehicleId}`, JSON.stringify(next));
      return next;
    });
    setIsLoading(true);

    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.role === "user" ? m.text : m.answer,
    }));

    try {
      const response = await askVehicle(selectedVehicleId, question, history, language);
      setMessages((prev) => {
        const next = [...prev, { role: "assistant", answer: response.answer }];
        sessionStorage.setItem(`askMyVehicleMessages_${selectedVehicleId}`, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            role: "assistant",
            answer:
              err.message === "UNAUTHORIZED"
                ? "Session expired. Please log in again."
                : "I'm unable to reach the vehicle assistant right now. Please try again later.",
          },
        ];
        sessionStorage.setItem(`askMyVehicleMessages_${selectedVehicleId}`, JSON.stringify(next));
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleOpenFullPage = () => {
    if (selectedVehicleId) {
      navigate(`/ask-my-vehicle?vehicleId=${selectedVehicleId}`);
    } else {
      navigate("/ask-my-vehicle");
    }
  };

  return (
    <div className="bg-white rounded-[1.25rem] h-[500px] border border-slate-200 p-5 shadow-sm flex flex-col relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-slate-900 leading-tight">{t.dash?.askMyVehicle || "Ask My Vehicle"}</h2>
            <p className="text-[10px] text-slate-500 font-medium leading-[1.2] mt-0.5">{t.dash?.aiAssistant || "AI Assistant"} Â· Powered by Gemini</p>
          </div>
        </div>

        <button
          onClick={handleOpenFullPage}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-colors"
          title="Open in Full Page"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Page</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 h-[80px] min-h-[80px] scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-blue-600" />
              </div>
            )}
            <div
              className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-sm"
              }`}
            >
              {msg.text || msg.answer}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3 h-3 text-blue-600" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl rounded-tl-sm px-3 py-2 flex items-center">
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      {messages.length === 1 && !isLoading && (
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">{t.dash?.quickQuestions || "Quick Questions"}</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_CHIPS(t).map((chip, idx) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              disabled={isLoading || !selectedVehicleId}
              className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200
                         px-2.5 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative mt-auto shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !selectedVehicleId}
          placeholder={selectedVehicleId ? "Ask anything..." : "Select a vehicle first"}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[12px] text-slate-800
                     focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-inner disabled:opacity-60"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading || !selectedVehicleId}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:hover:bg-white shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AiAssistantWidget;
