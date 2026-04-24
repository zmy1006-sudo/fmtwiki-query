// AI搜索服务 - DeepSeek API
// API文档：https://api.deepseek.com/

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || import.meta.env.VITE_GLM_API_KEY || '';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const FETCH_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

export function isConfigured(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

// ─────────────────────────────────────────
// HTML 实体解码
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
// HTML 标签剥离
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
// Markdown → HTML（医生端 v3 — 医疗报告排版引擎）
// ─────────────────────────────────────────
export function renderMarkdown(text: string): string {
  if (!text) return '';

  let html = decodeHtmlEntities(text);
  html = stripHtmlTags(html);

  // ── 0. 预处理：中文句号/分号后面补换行，防止列表项全挤在一起 ──
  html = html.replace(/([。；])/g, "$1\n");

  // ── 1. 代码块保护 ──
  const codeBlocks: string[] = [];
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_m, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<div class="my-4"><pre class="bg-gray-900 text-gray-100 rounded-xl px-4 py-3 text-xs font-mono overflow-x-auto leading-relaxed"><code>${code.trim()}</code></pre></div>`
    );
    return `§CODEBLOCK${idx}§`;
  });
  html = html.replace(/`([^`]+)`/g,
    '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600">$1</code>');

  // ── 2. 标题层级 ──
  // H1: 大标题（深墨色，底部加线）
  html = html.replace(/^# ([^\n]+)$/gm,
    '<h1 class="text-xl font-black text-gray-900 mt-6 mb-3 pb-2 border-b-2 border-emerald-400">$1</h1>');
  // H2: 章节标题（翡翠绿，主色调）
  html = html.replace(/^## ([^\n]+)$/gm,
    '<h2 class="text-lg font-bold text-emerald-700 mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-5 bg-emerald-400 rounded-full inline-block"></span>$1</h2>');
  // H3: 小节标题（蓝紫色，上边线）
  html = html.replace(/^### ([^\n]+)$/gm,
    '<h3 class="text-sm font-bold text-blue-700 mt-5 mb-2.5 pl-3 border-l-3 border-blue-400 bg-blue-50/50 rounded-r py-1">$1</h3>');
  // H4: 重点标签（深灰，左边框强调）
  html = html.replace(/^#### ([^\n]+)$/gm,
    '<h4 class="text-xs font-bold text-gray-600 mt-4 mb-1.5 uppercase tracking-wider text-emerald-600">$1</h4>');

  // ── 3. 加粗 ──
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-gray-900">$1</strong>');
  // 加粗后冒号自动加空格（**内容：** → **内容**： ）
  html = html.replace(
    /<strong([^>]*)>([^<]*)[\uff1a:]([^<]*)<\/strong>(\s*[\uff1a:])/g,
    '<strong$1>$2$3</strong>$4 '
  );
  // 斜体
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-500">$1</em>');
  html = html.replace(/_(.+?)_/g, '<em class="italic text-gray-500">$1</em>');
  // 删除线
  html = html.replace(/~~(.+?)~~/g, '<del class="text-gray-400 line-through">$1</del>');

  // ── 4. 引用 ──
  html = html.replace(/^>\s?([^\n]+)$/gm,
    '<blockquote class="border-l-4 border-emerald-400 bg-emerald-50 pl-3.5 py-2 my-3 rounded-r-lg text-sm text-emerald-800 leading-7 flex gap-2"><span class="text-lg mt-[-2px]">📌</span><span>$1</span></blockquote>');

  // ── 5. 分割线 ──
  html = html.replace(/^---$/gm, '<div class="my-5 border-t border-gray-200"></div>');
  html = html.replace(/^\*\*\*$/gm, '<div class="my-5 border-t border-gray-200"></div>');

  // ── 6. 无序列表（连续合并，深缩进+翡翠边框） ──
  const lines = html.split('\n');
  const out1: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^[-*•·]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•·]\s/.test(lines[i])) {
        const content = lines[i].replace(/^[-*•·]\s/, '').trim();
        items.push(`<li class="py-1 text-sm text-gray-700 leading-7 break-words overflow-wrap-break-word">${content}</li>`);
        i++;
      }
      out1.push(
        `<ul class="ml-3 my-3 space-y-0.5 border-l-2 border-emerald-300 pl-3 bg-emerald-50/50 rounded-r-lg py-1">${items.join('')}</ul>`
      );
    } else {
      out1.push(line);
      i++;
    }
  }

  // ── 7. 有序列表（连续合并，蓝色边框，序号正确） ──
  const out2: string[] = [];
  let k = 0;
  let seqNum = 1;
  while (k < out1.length) {
    const line = out1[k];
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      const startN = seqNum;
      while (k < out1.length && /^\d+\.\s/.test(out1[k])) {
        items.push(`<li class="py-1 text-sm text-gray-700 leading-7">${out1[k].replace(/^\d+\.\s/, '')}</li>`);
        k++; seqNum++;
      }
      out2.push(
        `<ol start="${startN}" class="ml-3 my-3 space-y-0.5 border-l-2 border-blue-300 pl-3 bg-blue-50/50 rounded-r-lg py-1 list-decimal list-inside">${items.join('')}</ol>`
      );
    } else {
      out2.push(line);
      k++;
    }
  }
  html = out2.join('\n');

  // ── 8. 段落（双换行分割） ──
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (
      block.startsWith('<h1') || block.startsWith('<h2') || block.startsWith('<h3') ||
      block.startsWith('<h4') || block.startsWith('<ul') ||
      block.startsWith('<ol') || block.startsWith('<blockquote') ||
      block.startsWith('<pre') || block.startsWith('<div class="my-5')
    ) return block;
    // 孤立 <li> 包裹
    if (/^<li>/.test(block) && !/<ul|<ol/.test(block)) {
      return `<ul class="ml-3 my-2 space-y-0.5 border-l-2 border-emerald-200 pl-3 rounded-r-lg">${block}</ul>`;
    }
    return `<p class="text-sm text-gray-700 leading-8 my-2">${block.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  // ── 9. 恢复代码块 ──
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`§CODEBLOCK${idx}§`, block);
  });

  return html;
}

// ─────────────────────────────────────────
// 患者端 Markdown 渲染（轻量格式，温和样式）
// ─────────────────────────────────────────
export function cleanMarkdown(text: string): string {
  if (!text) return '';
  let t = decodeHtmlEntities(text);
  t = stripHtmlTags(t);
  t = t.replace(/^### (.+)$/gm, '◆ $1');
  t = t.replace(/^## (.+)$/gm, '▍ $1');
  t = t.replace(/^# (.+)$/gm, '◈ $1');
  t = t.replace(/\*\*(.+?)\*\*/g, '【$1】');
  t = t.replace(/__(.+?)__/g, '【$1】');
  t = t.replace(/\*(.+?)\*/g, '"$1"');
  t = t.replace(/_(.+?)_/g, '"$1"');
  t = t.replace(/~~(.+?)~~/g, '̶$1̶');
  t = t.replace(/^>\s?(.+)$/gm, '▎ $1');
  t = t.replace(/^[-*•] (.+)$/gm, '  • $1');
  t = t.replace(/^\d+\. (.+)$/gm, '    $1');
  t = t.replace(/```[\s\S]*?```/g, '[代码段]');
  t = t.replace(/`([^`]+)`/g, '"$1"');
  return t.replace(/\n{3,}/g, '\n\n').trim();
}

// ─────────────────────────────────────────
// 类型定义
// ─────────────────────────────────────────
export interface AIResult { content: string; error?: string; }
export type TokenCallback = (token: string, done: boolean) => void;

const FALLBACK_CONTENT = (query: string) =>
  `抱歉，当前 AI 服务暂时不可用。\n\n关于「${query}」的一般性参考：\n\n粪菌移植（FMT）目前已被认可的适应证包括：\n• 复发性艰难梭菌感染（rCDI）— 循证等级 A，金标准治疗\n• 炎症性肠病（IBD）— 溃疡性结肠炎、克罗恩病\n• 肠易激综合征（IBS）\n• 自闭症谱系障碍（ASD）\n\n如症状持续，请到正规医院消化科就诊。\n\n⚠️ 本回答仅供参考，不能替代临床判断，请遵医嘱。`;

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
