// AI搜索服务 - GLM API调用
// 注意：API Key请通过环境变量 VITE_GLM_API_KEY 注入
// API文档：https://www.minimaxi.com/document

const API_KEY = import.meta.env.VITE_GLM_API_KEY || '';
const API_URL = 'https://api.minimaxi.com/v1/text/chatcompletion_v2';

/** 检测是否已配置API Key */
export function isConfigured(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

interface GLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callGLMAnalysis(
  query: string,
  context: string,
  portal: 'doctor' | 'patient'
): Promise<string> {
  if (!isConfigured()) {
    return `[演示模式] API Key未配置。请在环境变量中设置 VITE_GLM_API_KEY。\n\n基于搜索结果，我为您找到以下信息：\n${context}`;
  }

  const systemPrompt = portal === 'doctor'
    ? '你是一位FMT（粪菌移植）医学专家助手。用户会提出临床相关问题。请基于提供的知识库搜索结果，用专业但易懂的方式回答。回答末尾必须包含"⚠️ 本回答仅供参考，不能替代临床判断，请遵医嘱。"'
    : '你是一位FMT科普教育助手。用户是患者或家属。请用通俗易懂的语言回答科普问题。回答末尾必须包含"⚠️ 本回答仅供科普参考，不能替代医生诊断，请遵医嘱。"';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'abab5.5-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `用户问题：${query}\n\n知识库搜索结果：\n${context}\n\n请基于以上搜索结果，回答用户问题。` },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'AI分析暂时不可用，请稍后重试。';
  } catch (error) {
    console.error('GLM API调用失败:', error);
    return 'AI分析暂时不可用，请稍后重试。';
  }
}
