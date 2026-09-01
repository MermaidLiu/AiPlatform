export interface TokenBaseConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  configured: boolean;
}

/** 从环境变量读取 Token 底座配置（密钥仅存服务端，不暴露给浏览器） */
export function getTokenBaseConfig(): TokenBaseConfig {
  const rawUrl = process.env.TOKEN_BASE_URL?.trim() ?? '';
  const apiKey = process.env.TOKEN_BASE_API_KEY?.trim() ?? '';
  const model = process.env.TOKEN_BASE_MODEL?.trim() || 'deepseek-v4-flash';

  const baseUrl = rawUrl.replace(/\/+$/, '');

  return {
    baseUrl,
    apiKey,
    model,
    configured: Boolean(baseUrl && apiKey),
  };
}

export function getChatCompletionsUrl(baseUrl: string): string {
  if (baseUrl.endsWith('/v1')) {
    return `${baseUrl}/chat/completions`;
  }
  return `${baseUrl}/v1/chat/completions`;
}
