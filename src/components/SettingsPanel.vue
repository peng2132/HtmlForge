<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-6">
      <h2 class="text-xl font-bold text-gray-800">⚙️ API 设置</h2>
      <div class="text-xs text-gray-500">(配置您的密钥)</div>
    </div>

    <div class="space-y-4">
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
        <p>🔒 您的 API 密钥仅存储在本地，不会上传到服务器</p>
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

const configStore = useConfigStore();
const apiKey = ref('');
const showApiKey = ref(false);

onMounted(() => {
  apiKey.value = configStore.apiKey;
});

function saveSettings() {
  configStore.setApiKey(apiKey.value);
  alert('✅ 设置已保存！');
}
</script> 