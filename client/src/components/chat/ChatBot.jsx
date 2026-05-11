import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import api from '../../api/axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! I'm the RecoMart Assistant. How can I help you today?",
      products: [],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const getConversationHistory = () =>
    messages.map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: typeof msg.content === 'string' ? msg.content : msg.content?.message || '',
    }));

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, products: [] }]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [
        ...getConversationHistory(),
        { role: 'user', content: trimmed },
      ];

      const { data } = await api.post('/chatbot/message', {
        message: trimmed,
        conversationHistory,
      });

      const botReply = data.reply || data.message || {
        message: "Sorry, I didn't understand that.",
        products: [],
      };

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: typeof botReply === 'string' ? botReply : botReply.message,
          products: typeof botReply === 'object' ? botReply.products || [] : [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, something went wrong. Please try again.', products: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-80 h-[500px] mb-3 flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, #0f0c2a 0%, #0d0b1e 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">RecoMart Assistant</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  AI-powered
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.3) transparent' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl text-sm"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          color: '#ffffff',
                          borderBottomRightRadius: '4px',
                          boxShadow: '0 2px 12px rgba(124,58,237,0.35)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.06)',
                          color: '#e5e7eb',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderBottomLeftRadius: '4px',
                        }
                  }
                >
                  {/* Message Text */}
                  <div className="leading-relaxed">
                    {typeof msg.content === 'string' ? msg.content : msg.content?.message}
                  </div>

                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((product) => (
                        <a
                          key={product._id}
                          href={`/products/${product.slug}`}
                          className="block rounded-xl overflow-hidden transition-all duration-200"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(124,58,237,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          }}
                        >
                          <img
                            src={product.images?.[0]?.url || product.images?.[0] || '/placeholder.png'}
                            alt={product.title}
                            className="w-full h-28 object-cover"
                          />
                          <div className="p-2.5">
                            <h4
                              className="font-semibold text-xs line-clamp-2"
                              style={{ color: '#f0eeff' }}
                            >
                              {product.title}
                            </h4>
                            <p
                              className="text-xs font-bold mt-1"
                              style={{ color: '#a78bfa' }}
                            >
                              Rs {product.price}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9ca3af',
                  }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#a78bfa' }} />
                  <span>Typing…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
              placeholder="Type a message…"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm rounded-full outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0eeff',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: !input.trim() || isLoading
                  ? 'rgba(124,58,237,0.2)'
                  : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: !input.trim() || isLoading ? '#6b7280' : '#ffffff',
                boxShadow: !input.trim() || isLoading ? 'none' : '0 4px 12px rgba(124,58,237,0.4)',
                cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.7)';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.5)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default ChatBot;