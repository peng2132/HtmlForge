export interface QwenResponse {
  htmlCode: string;
  message?: string;
}

export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
}

export interface StreamChunk {
  choices: {
    delta: {
      content: string;
    };
  }[];
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen 2.5 Coder 32B",
    description: "通义千问代码专用模型，适合生成高质量代码"
  },
  {
    id: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    name: "Llama 3 8B",
    description: "Meta最新的轻量级指令模型"
  },
  {
    id: "deepseek-ai/DeepSeek-V2.5",
    name: "DeepSeek V2.5",
    description: "深度求索大模型，通用能力强"
  }
]; 