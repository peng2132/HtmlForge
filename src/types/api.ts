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