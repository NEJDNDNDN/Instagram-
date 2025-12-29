
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from './types';

const GeminiQandA: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "أنت عالم فيزياء فلكية خبير. أجب على أسئلة المستخدم حول الجاذبية والفيزياء بطريقة مشوقة وسهلة الفهم باللغة العربية. استخدم أمثلة توضيحية.",
        }
      });

      const aiText = response.text || "عذراً، لم أستطع صياغة إجابة حالياً.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] bg-slate-900/80 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl">
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p className="text-lg">اسأل أي شيء عن الجاذبية!</p>
            <p className="text-sm">مثال: ماذا يحدث للوقت بالقرب من ثقب أسود؟</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-slate-800 p-3 rounded-2xl animate-pulse text-slate-400 text-xs">
              جاري التفكير في إجابة علمية...
            </div>
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="اكتب سؤالك هنا..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg"
        >
          اسأل
        </button>
      </div>
    </div>
  );
};

export default GeminiQandA;
