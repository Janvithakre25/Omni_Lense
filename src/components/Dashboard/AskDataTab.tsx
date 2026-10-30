import React, { useState, useRef, useEffect } from 'react';
import { ParsedDataset, ChatMessage } from '../../types/dataset';
import { answerDataQuestion } from '../../utils/qaEngine';
import { Send, Sparkles, User, Bot, HelpCircle, ArrowRight, CornerDownRight, CheckCircle2, BarChart2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AskDataTabProps {
  dataset: ParsedDataset;
}

export const AskDataTab: React.FC<AskDataTabProps> = ({ dataset }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I'm your OmniLens Data Assistant. I have analyzed your **${dataset.data.length} records** and **${dataset.columns.length} columns**. Ask me any question in everyday English, and I'll calculate the answers directly from your information.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: dataset.suggestedQuestions.slice(0, 4),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate realistic analytical calculation pause
    setTimeout(() => {
      const response = answerDataQuestion(
        queryText,
        dataset.data,
        dataset.columns,
        dataset.findings,
        dataset.quality
      );
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-forest" />
          <span>Conversational Intelligence</span>
        </div>
        <h2 className="text-2xl font-extrabold text-forest-dark">Ask Your Data</h2>
        <p className="text-xs text-charcoal/80 mt-1">
          No SQL or technical jargon. Ask in plain English and receive evidence-backed answers.
        </p>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl shadow-soft overflow-hidden flex flex-col h-[560px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-forest text-warmWhite flex items-center justify-center shrink-0 shadow-soft">
                  <Bot className="w-4 h-4 text-mint" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-forest text-warmWhite rounded-tr-sm shadow-soft'
                    : 'bg-cream/60 border border-sage/50 text-charcoal rounded-tl-sm shadow-soft'
                }`}
              >
                {/* Message Body with markdown formatting */}
                <div className="leading-relaxed whitespace-pre-line">
                  {msg.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-2 last:mb-0">
                      {paragraph.split('**').map((part, pIdx) =>
                        pIdx % 2 === 1 ? (
                          <strong key={pIdx} className="font-bold text-forest-dark">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Inline Chart if returned by engine */}
                {msg.chartConfig && (
                  <div className="mt-4 pt-4 border-t border-sage/40 bg-warmWhite p-4 rounded-2xl border">
                    <p className="text-xs font-bold text-forest-dark mb-2 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5" />
                      {msg.chartConfig.title}
                    </p>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {msg.chartConfig.type === 'line' ? (
                          <LineChart data={msg.chartConfig.data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" />
                            <XAxis dataKey={msg.chartConfig.xAxis} stroke="#66736B" fontSize={10} tickLine={false} />
                            <YAxis stroke="#66736B" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey={msg.chartConfig.yAxis} stroke="#006241" strokeWidth={2.5} dot={{ fill: '#00754A', r: 3 }} />
                          </LineChart>
                        ) : (
                          <BarChart data={msg.chartConfig.data} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" vertical={false} />
                            <XAxis dataKey={msg.chartConfig.xAxis} stroke="#66736B" fontSize={10} tickLine={false} angle={-15} textAnchor="end" />
                            <YAxis stroke="#66736B" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                            <Bar dataKey={msg.chartConfig.yAxis} fill="#006241" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Evidence Note */}
                {msg.evidence && (
                  <div className="mt-3 pt-2 border-t border-sage/30 flex items-center gap-1.5 text-[11px] text-mutedGrey">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                    <span>Evidence: {msg.evidence}</span>
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-sage/30">
                    <p className="text-[11px] font-semibold text-forest-dark mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-left text-xs bg-warmWhite hover:bg-forest hover:text-warmWhite text-charcoal px-3 py-1.5 rounded-full border border-sage/60 transition-colors shadow-soft"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-mutedGrey mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-cream text-charcoal flex items-center justify-center shrink-0 border border-sage/40">
                  <User className="w-4 h-4 text-charcoal" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest text-warmWhite flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-mint" />
              </div>
              <div className="bg-cream/60 border border-sage/50 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-mutedGrey flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-charcoal">Analyzing dataset records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-warmWhite border-t border-sage/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your data in plain English..."
              className="flex-1 bg-cream/40 border border-sage/80 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest shadow-soft"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-5 py-3 rounded-2xl bg-forest text-warmWhite hover:bg-forest-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
