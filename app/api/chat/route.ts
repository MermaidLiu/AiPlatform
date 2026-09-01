import { NextResponse } from 'next/server';
import { getChatCompletionsUrl, getTokenBaseConfig } from '@/lib/token-base';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  const config = getTokenBaseConfig();

  if (!config.configured) {
    return NextResponse.json(
      {
        error:
          'Token 底座未配置。请在项目根目录创建 .env.local 并设置 TOKEN_BASE_URL、TOKEN_BASE_API_KEY。',
      },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '无效的请求体' }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (m) => m.content?.trim() && ['user', 'assistant', 'system'].includes(m.role)
  );

  if (!messages?.length) {
    return NextResponse.json({ error: 'messages 不能为空' }, { status: 400 });
  }

  const upstream = await fetch(getChatCompletionsUrl(config.baseUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 1024,
    }),
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error:
          (data as { error?: { message?: string } })?.error?.message ??
          `上游 API 错误 (${upstream.status})`,
      },
      { status: upstream.status }
    );
  }

  const content =
    (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]
      ?.message?.content ?? '';

  return NextResponse.json({
    content,
    model: (data as { model?: string })?.model ?? config.model,
  });
}
