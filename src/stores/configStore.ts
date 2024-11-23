import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ModelOption } from '../types/api';
import { AVAILABLE_MODELS } from '../types/api';

export const useConfigStore = defineStore('config', () => {
  const apiKey = ref('');
  const baseUrl = ref('https://api.siliconflow.cn/v1');
  const selectedModel = ref<ModelOption>(AVAILABLE_MODELS[0]);

  function setApiKey(key: string) {
    apiKey.value = key;
    localStorage.setItem('apiKey', key);
  }

  function setBaseUrl(url: string) {
    baseUrl.value = url;
    localStorage.setItem('baseUrl', url);
  }

  function setSelectedModel(model: ModelOption) {
    selectedModel.value = model;
    localStorage.setItem('selectedModel', JSON.stringify(model));
  }

  // 初始化时从 localStorage 加载配置
  if (typeof window !== 'undefined') {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedBaseUrl = localStorage.getItem('baseUrl');
    const savedModel = localStorage.getItem('selectedModel');

    if (savedApiKey) apiKey.value = savedApiKey;
    if (savedBaseUrl) baseUrl.value = savedBaseUrl;
    if (savedModel) {
      try {
        selectedModel.value = JSON.parse(savedModel);
      } catch (e) {
        console.error('Failed to parse saved model:', e);
      }
    }
  }

  return {
    apiKey,
    baseUrl,
    selectedModel,
    setApiKey,
    setBaseUrl,
    setSelectedModel
  };
}); 