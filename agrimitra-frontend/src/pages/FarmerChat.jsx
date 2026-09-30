import React, { useState } from 'react';
import { Mic, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function FarmerChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Assuming a generic chat API call to the proxy route
      const response = await api.post('/farmer-chat', { query: userMessage.text });
      setMessages(prev => [...prev, { text: response.data.answer, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    // Placeholder for Bhashini voice integration
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording... (reuse Bhashini if exists)
      console.log('Voice recording started');
    } else {
      console.log('Voice recording stopped');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-sand h-[calc(100vh-theme(spacing.20))]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-forest-500 mt-20">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-display font-semibold mb-2">Farmer AI Assistant</h2>
            <p className="opacity-80">Ask me anything about crops, weather, or farming practices in your language.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-xl flex items-start gap-3 ${msg.sender === 'user' ? 'bg-leaf-500 text-white' : 'bg-white text-forest-900 shadow-sm'}`}>
                {msg.sender === 'bot' && <Bot size={20} className="shrink-0 mt-0.5" />}
                <p>{msg.text}</p>
                {msg.sender === 'user' && <User size={20} className="shrink-0 mt-0.5" />}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-xl shadow-sm text-forest-900 flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-2 flex items-center gap-2">
        <button 
          onClick={toggleRecording}
          className={`p-3 rounded-lg transition-colors ${isRecording ? 'bg-red-100 text-red-500' : 'text-forest-400 hover:bg-forest-50'}`}
        >
          <Mic size={24} />
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 p-2 outline-none bg-transparent text-forest-900"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-3 bg-leaf-500 text-white rounded-lg hover:bg-leaf-600 disabled:opacity-50 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
