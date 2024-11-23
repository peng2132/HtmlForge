<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-6">
      <h2 class="text-xl font-bold text-gray-800">⚙️ API 设置</h2>
      <div class="text-xs text-gray-500">(配置您的密钥和接口)</div>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">🔑 API 地址</label>
        <div class="relative">
          <input
            type="text"
            v-model="apiUrl"
            class="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                   transition-all duration-200"
            placeholder="输入 API 地址，例如：https://api.siliconflow.cn/v1"
          />
          <button 
            @click="resetApiUrl"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                   text-xs px-2 py-1 bg-gray-50 rounded border border-gray-200"
          >
            重置
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">🔑 API 密钥</label>
        <div class="relative">
          <input
            :type="showApiKey ? 'text' : 'password'"
            v-model="apiKey"
            class="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                   transition-all duration-200"
            placeholder="输入您的 API 密钥"
          />
          <button 
            @click="showApiKey = !showApiKey"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {{ showApiKey ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">🤖 选择模型</label>
        <div class="relative">
          <select
            v-model="selectedModel"
            class="w-full p-3 pr-10 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                   transition-all duration-200 appearance-none cursor-pointer"
          >
            <option 
              v-for="model in AVAILABLE_MODELS"
              :key="model.id"
              :value="model"
            >
              {{ model.name }} - {{ model.description }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <button
        @click="saveSettings"
        class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
               text-white rounded-lg font-medium shadow-sm
               hover:from-green-600 hover:to-emerald-600 
               active:from-green-700 active:to-emerald-700
               transition-all duration-200"
      >
        💾 保存设置
      </button>

      <div class="text-xs text-gray-500 mt-4">
        <p>🔒 您的设置仅存储在本地，不会上传到服务器</p>
        <p class="mt-1">
          📝 没有 API 密钥？
          <a 
            href="https://www.siliconflow.cn" 
            target="_blank"
            class="text-blue-500 hover:text-blue-600 hover:underline"
          >
            点击这里获取
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '../stores/configStore';
import { AVAILABLE_MODELS, type ModelOption } from '../types/api';

const emit = defineEmits<{
  (e: 'saved'): void
}>();

const configStore = useConfigStore();
const apiKey = ref('');
const apiUrl = ref('');
const showApiKey = ref(false);
const selectedModel = ref<ModelOption>(configStore.selectedModel);

const defaultApiUrl = import.meta.env.VITE_QWEN_API_URL;

onMounted(() => {
  apiKey.value = configStore.apiKey;
  apiUrl.value = configStore.baseUrl;
  selectedModel.value = configStore.selectedModel;
});

function selectModel(model: ModelOption) {
  selectedModel.value = model;
}

function resetApiUrl() {
  apiUrl.value = defaultApiUrl;
}

function saveSettings() {
  configStore.setApiKey(apiKey.value);
  configStore.setBaseUrl(apiUrl.value);
  configStore.setSelectedModel(selectedModel.value);
  emit('saved');
}
</script>

<style scoped>
/* 自定义下拉框样式 */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style> 