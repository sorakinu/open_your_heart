import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, History, Trash2, Sparkles, X } from 'lucide-react';

const App = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('kokoro_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('kokoro_logs', JSON.stringify(logs));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAiResponse = (userText) => {
    if (userText.includes("幸せになりたい")) {
      return "そう思うのは、本当に自然なことだよ。その願いをここに置けてよかった。";
    }
    const responses = [
      "その気持ち、大切に受け止めるね。",
      "そう思うのは、とても自然なことだよ。",
      "今までずっと、頑張ってきたんだね。",
      "ここに吐き出してくれて、ありがとう。",
      "無理に答えを出さなくても、大丈夫だよ。",
      "あなたの心が、少しでも軽くなりますように。",
      "そのままのあなたで、いいんだよ。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', text: input, date: new Date().toLocaleString('ja-JP', { hour: '2-digit', minute: '2-digit' }) };
    const aiMessage = { id: Date.now() + 1, type: 'ai', text: getAiResponse(input), date: new Date().toLocaleString('ja-JP', { hour: '2-digit', minute: '2-digit' }) };
    setLogs([...logs, userMessage, aiMessage]);
    setInput('');
  };

  // ★一つずつ削除する機能
  const deleteLog = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  // ★すべて削除する機能
  const clearLogs = () => {
    if (window.confirm('これまでの記録をすべて消去しますか？')) {
      setLogs([]);
      localStorage.removeItem('kokoro_logs');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-slate-700 font-sans p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2 flex justify-center items-center gap-2">
          こころの解放＆開放 <Sparkles size={28} />
        </h1>
        <p className="text-teal-500/80 italic">答えを出しても出さなくてもいいよ</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-6">
        <section className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-teal-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm font-medium text-teal-700 ml-1">今の気持ちをそっと教えてね</label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="自由に書いてみてね..."
                className="w-full p-4 pr-12 rounded-2xl border-none ring-1 ring-teal-100 focus:ring-2 focus:ring-teal-300 outline-none resize-none min-h-[100px] bg-white/50 transition-all"
              />
              <button type="submit" className="absolute bottom-4 right-4 p-2 bg-teal-400 text-white rounded-full hover:bg-teal-500 shadow-md">
                <Send size={20} />
              </button>
            </div>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="flex items-center gap-2 text-teal-700 font-semibold"><History size={18} /> ふりかえり</h2>
            {logs.length > 0 && (
              <button onClick={clearLogs} className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                <Trash2 size={14} /> すべて消す
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-white/30 rounded-3xl border border-dashed border-teal-200">
                記録はありません。
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`group relative p-4 rounded-2xl shadow-sm max-w-[90%] ${log.type === 'user' ? 'bg-white ml-0 rounded-tl-none border-l-4 border-teal-200' : 'bg-teal-50 ml-auto rounded-tr-none border-r-4 border-teal-300'}`}>
                  {/* 個別削除ボタン（ホバーで表示） */}
                  <button 
                    onClick={() => deleteLog(log.id)}
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-sm leading-relaxed mb-1">{log.text}</p>
                  <div className="flex items-center justify-end gap-1 opacity-40 text-[10px]">
                    {log.type === 'ai' && <Heart size={10} className="fill-current" />}
                    <span>{log.date}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </section>
      </main>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
};

export default App;