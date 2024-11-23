import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const apiKey = ref('');
  const baseUrl = ref(import.meta.env.VITE_QWEN_API_URL || 'http://localhost:3000');

  function setApiKey(key: string) {
    apiKey.value = key;
  }

  function setBaseUrl(url: string) {
    baseUrl.value = url;
  }

  return {
    apiKey,
    baseUrl,
    setApiKey,
    setBaseUrl
  };
}); 