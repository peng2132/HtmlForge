import { ApiConfig, QwenResponse, StreamChunk } from '../types/api';

export class QwenAPIService {
  constructor(private config: ApiConfig) {}

  public updateConfig(newConfig: ApiConfig) {
    this.config = newConfig;
  }

  async *generateHTMLStream(prompt: string): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-Coder-32B-Instruct",
          messages: [
            {
              role: "system",
              content: "你是一个专业的html 前端绘画师。请根据用户的描述生成对应的HTML代码，页面要具有教学示范意义，页面精美好看。页面不要直接返回结果，还有返回对应知识点思考的的过程。注意展示这个知识点的每一步。注意：1. 只返回HTML代码本身，不要包含```html或任何其他标记 2. 不要包含任何解释性文字 3. 生成的代码要包含完整的样式，确保界面美观 4. 生产的页面能帮助学生很好的学习对应的知识点，确保学生能根据这个动图页面理解对应的知识"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 请求失败: ${errorData.error?.message || response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line === 'data: [DONE]') return;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as StreamChunk;
              const content = data.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.error('解析流数据失败:', e, line);
            }
          }
        }
      }

      if (buffer) {
        try {
          const data = JSON.parse(buffer.slice(6)) as StreamChunk;
          const content = data.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          console.error('解析最后的数据失败:', e);
        }
      }
    } catch (error) {
      console.error('API 调用错误:', error);
      throw error;
    }
  }
}

export const qwenApi = new QwenAPIService({
  apiKey: '',
  baseUrl: 'https://api.siliconflow.cn/v1'
}); 