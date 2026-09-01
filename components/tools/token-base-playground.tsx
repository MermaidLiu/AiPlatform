'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function TokenBasePlayground() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? '请求失败');
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.content || '（无回复内容）' }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '请求失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-800">在线体验 · Token 底座</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        通过 AgentFlow 内置代理调用你的 API（密钥保存在服务端 .env.local，不会暴露给浏览器）。
      </p>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-lg border bg-slate-50 p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">发送一条消息试试，例如：帮我写一段产品介绍</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'ml-8 bg-violet-100 text-violet-900'
                : 'mr-8 bg-white text-slate-700 shadow-sm'
            }`}
          >
            <span className="mb-1 block text-xs font-medium opacity-70">
              {msg.role === 'user' ? '你' : 'AI'}
            </span>
            {msg.content}
          </div>
        ))}
        {loading && (
          <p className="text-sm text-muted-foreground">思考中…</p>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息…"
          disabled={loading}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? '发送中' : '发送'}
        </Button>
      </div>
    </div>
  );
}
