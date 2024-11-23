<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        🎨 描述您想要的界面
      </h2>
      <div class="text-xs text-gray-500">(让 AI 为您创造)</div>
    </div>
    
    <div class="relative">
      <textarea
        v-model="prompt"
        class="w-full h-40 p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
               transition-all duration-200 resize-none shadow-sm"
        placeholder="例如：创建一个现代风格的登录表单，包含用户名和密码输入框，使用优雅的阴影和渐变效果..."
      ></textarea>
      <div class="absolute bottom-4 right-4 text-xs text-gray-400">
        {{ prompt.length }} 字
      </div>
    </div>

    <div class="flex gap-4">
      <button 
        @click="generateHTML"
        class="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 
               text-white rounded-xl font-medium shadow-sm
               hover:from-blue-600 hover:to-indigo-600 
               active:from-blue-700 active:to-indigo-700
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        :disabled="isLoading || !prompt.trim()"
      >
        <span class="flex items-center justify-center gap-2">
          <span v-if="isLoading" class="animate-spin">🌟</span>
          {{ isLoading ? '正在创作中...' : '开始生成' }}
          {{ isLoading ? '✨' : '🚀' }}
        </span>
      </button>
      
      <button 
        @click="prompt = ''"
        class="px-4 py-2 text-gray-500 hover:text-gray-700 
               bg-white/80 hover:bg-gray-50 rounded-xl transition-all duration-200
               border border-gray-200 shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
        :disabled="isLoading || !prompt"
      >
        🗑️ 清空
      </button>
    </div>

    <!-- 提示信息 -->
    <div class="mt-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-2">
      <p class="text-sm font-medium text-blue-700">💡 小贴士：</p>
      <ul class="text-xs text-blue-600 space-y-1 list-disc list-inside">
        <li>描述越详细，生成的界面越符合预期</li>
        <li>可以指定颜色、布局、间距等具体要求</li>
        <li>支持生成响应式布局的 HTML 代码</li>
        <li>可以要求添加动画和交互效果</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { qwenApi } from '../services/qwenApi';
import { useConfigStore } from '../stores/configStore';

const prompt = ref('');
const isLoading = ref(false);
const configStore = useConfigStore();

const emit = defineEmits<{
  (e: 'update:generatedCode', code: string): void
  (e: 'update:isGenerating', value: boolean): void
}>();

async function generateHTML() {
  if (!prompt.value.trim()) return;
  if (!configStore.apiKey) {
    alert('请先设置 API 密钥');
    return;
  }
  
  isLoading.value = true;
  emit('update:isGenerating', true);
  let generatedCode = '';
  
  try {
    qwenApi.updateConfig({
      apiKey: configStore.apiKey,
      baseUrl: configStore.baseUrl
    });
    
    for await (const chunk of qwenApi.generateHTMLStream(prompt.value)) {
      generatedCode += chunk;
      emit('update:generatedCode', generatedCode);
    }

    // 确保最终代码被正确发送
    setTimeout(() => {
      emit('update:generatedCode', generatedCode);
      emit('update:isGenerating', false);
    }, 100);
    
  } catch (error: any) {
    console.error('生成失败:', error);
    alert(`生成失败: ${error.message || '请检查 API 设置和网络连接'}`);
  } finally {
    isLoading.value = false;
  }
}
</script> 