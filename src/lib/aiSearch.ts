// AI搜索服务 - DeepSeek v1 + 完整Markdown渲染器
// API文档：https://api.deepseek.com/

const API_KEY = import.meta.env.VITE_GLM_API_KEY || '';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const FETCH_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

export function isConfigured(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

// ─────────────────────────────────────────
// HTML 实体解码（AI 输出保护，统一在入口处理）
// AI 可能返回 HTML 原文（<tag>）或实体形式（&lt;tag&amp;gt;）
// 统一在函数入口 decode 一次，防止双重转义
// ─────────────────────────────────────────
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

// ─────────────────────────────────────────
// HTML 标签剥离（AI 混合输出保护）
// 保留 <br> → 换行符；剥离其余标签，提取标签内文字
// ─────────────────────────────────────────
function stripHtmlTags(html: string): string {
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match) => {
    if (/^<br\s*\/?>$/i.test(match)) return '\n';
    return '';
  });
  return html;
}

// ─────────────────────────────────────────
// Markdown → HTML（医生端）
// 顺序：decode entity → strip HTML → process markdown
// 支持：h1-h4、加粗、斜体、列表、引用、代码块
// ─────────────────────────────────────────
export function renderMarkdown(text: string): string {
  if (!text) return '';

  // 【关键修复】先 decode HTML entity，再 strip HTML，最后处理 markdown
  let html = decodeHtmlEntities(text);
  html = stripHtmlTags(html);

  // 1. 先处理代码块（保护内容不做其他转换）
  const codeBlocks: string[] = [];
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_m, code) => {
    const placeholder = `§CODEBLOCK${codeBlocks.length}§`;
    codeBlocks.push(`<pre class="bg-gray-900 text-gray-100 rounded-xl px-4 py-3 text-xs font-mono my-3 overflow-x-auto leading-relaxed"><code>${code}</code></pre>`);
    return placeholder;
  });
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600">$1</code>');

  // 2. 标题（行首检测）
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-sm font-bold text-gray-800 mt-4 mb-2">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-800 mt-5 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-5 mb-3 border-b border-gray-100 pb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-5 mb-3">$1</h1>');

  // 3. 加粗（处理多行）
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-gray-900">$1</strong>');

  // 4. 斜体
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-600">$1</em>');
  html = html.replace(/_(.+?)_/g, '<em class="italic text-gray-600">$1</em>');

  // 5. 删除线
  html = html.replace(/~~(.+?)~~/g, '<del class="text-gray-400 line-through">$1</del>');

  // 6. 引用
  html = html.replace(/^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-indigo-400 pl-3 py-2 my-2 text-sm text-indigo-700 bg-indigo-50 rounded-r-lg">$1</blockquote>');

  // 7. 无序列表（合并连续项）
  const lines = html.split('\n');
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^[-*•] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•] /.test(lines[i])) {
        items.push(`<li class="ml-6 text-gray-700 text-sm leading-7 list-disc marker:text-blue-500">${lines[i].replace(/^[-*•] /, '')}</li>`);
        i++;
      }
      result.push(`<ul class="space-y-1 my-3">${items.join('')}</ul>`);
    } else {
      result.push(line);
      i++;
    }
  }
  html = result.join('\n');

  // 8. 有序列表
  const result2: string[] = [];
  let j = 0;
  while (j < result.length) {
    const line = result[j];
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (j < result.length && /^\d+\. /.test(result[j])) {
        items.push(`<li class="ml-6 text-gray-700 text-sm leading-7 list-decimal">${result[j].replace(/^\d+\. /, '')}</li>`);
        j++;
      }
      result2.push(`<ol class="list-decimal list-inside space-y-1 my-3">${items.join('')}</ol>`);
    } else {
      result2.push(line);
      j++;
    }
  }
  html = result2.join('\n');

  // 9. 段落（双换行分割）
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<ul') ||
        block.startsWith('<ol') || block.startsWith('<blockquote') ||
        block.startsWith('<pre')) return block;
    const safe = block.replace(/\n/g, '<br/>');
    return `<p class="text-sm text-gray-700 leading-7 my-2">${safe}</p>`;
  }).join('\n');

  // 10. 仅对裸露的 < 和 > 做安全转义（不在已生成的HTML标签内）
  // 不动 & 避免误伤 decode 后的合法 & 字符
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 11. 恢复代码块
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`§CODEBLOCK${idx}§`, block);
  });

  return html;
}

// ─────────────────────────────────────────
// 患者端 Markdown 渲染（轻量格式，温和样式）
// 支持：标题/加粗/斜体/列表/引用；自动剥离 HTML 标签防止乱码
// ─────────────────────────────────────────
export function cleanMarkdown(text: string): string {
  if (!text) return '';
  // 【关键修复】先 decode HTML entity，再 strip HTML，最后处理 markdown
  let t = decodeHtmlEntities(text);
  t = t
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, (m) => /^<br\s*\/?>$/i.test(m) ? '\n' : '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

  // 标题 → 加粗前缀（患者友好符号）
  t = t.replace(/^### (.+)$/gm, '◆ $1');
  t = t.replace(/^## (.+)$/gm, '▍ $1');
  t = t.replace(/^# (.+)$/gm, '◈ $1');
  // 加粗 → 【】
  t = t.replace(/\*\*(.+?)\*\*/g, '【$1】');
  t = t.replace(/__(.+?)__/g, '【$1】');
  // 斜体 → ""
  t = t.replace(/\*(.+?)\*/g, '"$1"');
  t = t.replace(/_(.+?)_/g, '"$1"');
  // 删除线
  t = t.replace(/~~(.+?)~~/g, '̶$1̶');
  // 引用
  t = t.replace(/^&gt; (.+)$/gm, '▎ $1');
  t = t.replace(/^> (.+)$/gm, '▎ $1');
  // 列表
  t = t.replace(/^[-*•] (.+)$/gm, '  • $1');
  t = t.replace(/^\d+\. (.+)$/gm, '    $1');
  // 代码块/行内代码
  t = t.replace(/```[\w]*\n?[\s\S]*?```/g, '[代码段]');
  t = t.replace(/`([^`]+)`/g, '"$1"');

  return t.replace(/\n{3,}/g, '\n\n').trim();
}

// ─────────────────────────────────────────
// 类型定义
// ─────────────────────────────────────────
export interface AIResult { content: string; error?: string; }
export type TokenCallback = (token: string, done: boolean) => void;

const FALLBACK_CONTENT = (query: string) =>
  `抱歉，当前 AI 服务暂时不可用。\n\n关于「${query}」的一般性参考：\n\n粪菌移植（FMT）目前已被认可的适应证包括：\n  • 复发性艰难梭菌感染（rCDI）— 循证等级 A，金标准治疗\n  • 炎症性肠病（IBD）— 溃疡性结肠炎、克罗恩病\n  • 肠易激综合征（IBS）\n  • 自闭症谱系障碍（ASD）\n\n如症状持续，请到正规医院消化科就诊。\n\n⚠️ 本回答仅供参考，不能替代临床判断，请遵医嘱。`;

// ─────────────────────────────────────────
// SSE 流式调用
// ─────────────────────────────────────────
export async function callGLMStream(
  query: string,
  portal: 'doctor' | 'patient',
  onToken: TokenCallback,
  onError: (msg: string) => void
): Promise<{ abort: () => void }> {
  const controller = new AbortController();
  let finished = false;
  const abort = () => { if (!finished) { finished = true; controller.abort(); } };
  if (!isConfigured()) { onError('[演示模式] API Key 未配置'); return { abort }; }

  const systemPrompt = portal === 'doctor'
    ? `你是一位专注于FMT（粪菌移植）的医学专家助手。用户会提出临床相关问题。请基于FMT医学专业知识回答，语言专业但易懂。使用清晰的分段和结构回答（建议用## 标题、- 列表、**加粗**）。回答末尾必须包含："⚠️ 本回答仅供参考，不能替代临床判断，请遵医嘱。"`
    : `你是一位专注于FMT科普的医学教育助手。请用通俗易懂的语言回答。回答末尾必须包含："⚠️ 本回答仅供科普参考，不能替代医生诊断，请遵医嘱。"`;

  let retryCount = 0;
  const attempt = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.4,
          max_tokens: 800,
          stream: true
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount) + Math.random() * 500, 8000);
          onError(`请求繁忙（${response.status}），${Math.round(delay / 1000)}秒后自动重试…`);
          await new Promise(r => setTimeout(r, delay));
          return attempt();
        }
        throw new Error(`HTTP ${response.status}`);
      }
      if (!response.body) throw new Error('Response body is null');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') { finished = true; onToken('', true); return; }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onToken(content, false);
          } catch {}
        }
      }
      finished = true; onToken('', true);
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) { finished = true; onToken('', true); return; }
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = Math.min(1000 * Math.pow(2, retryCount) + Math.random() * 500, 8000);
        onError(`请求失败（${err.message}），${Math.round(delay / 1000)}秒后自动重试…`);
        try { await new Promise(r => setTimeout(r, delay)); } catch { return; }
        return attempt();
      }
      finished = true;
      onError('AI 服务暂时不可用，已使用离线知识回复。');
      onToken(FALLBACK_CONTENT(query), true);
    }
  };

  const globalTimeout = setTimeout(() => {
    if (!finished) { controller.abort(); if (!finished) { finished = true; onError(`请求超时（${FETCH_TIMEOUT_MS / 1000}秒），请检查网络后重试。`); } }
  }, FETCH_TIMEOUT_MS);

  attempt().finally(() => clearTimeout(globalTimeout));
  return { abort };
}
