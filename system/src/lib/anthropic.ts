import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

export const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

interface AskOpts {
  system: string;
  user: string;
  smart?: boolean;      // true -> Opus, false -> Haiku
  maxTokens?: number;
  effort?: 'low' | 'medium' | 'high';
}

/** Oddiy matn javobi (adaptive thinking bilan). */
export async function ask({ system, user, smart = true, maxTokens = 4000, effort = 'medium' }: AskOpts): Promise<string> {
  const res = await anthropic.messages.create({
    model: smart ? config.modelSmart : config.modelCheap,
    max_tokens: maxTokens,
    thinking: { type: 'adaptive' },
    output_config: { effort },
    system,
    messages: [{ role: 'user', content: user }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

/** JSON sxema bo'yicha strukturalangan javob. Toza obyekt qaytadi. */
export async function askJson<T>({ system, user, schema, smart = false, maxTokens = 4000 }: AskOpts & { schema: object }): Promise<T> {
  const res = await anthropic.messages.create({
    model: smart ? config.modelSmart : config.modelCheap,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
    output_config: { format: { type: 'json_schema', schema } as any },
  });
  const text = res.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? '{}';
  return JSON.parse(text) as T;
}
