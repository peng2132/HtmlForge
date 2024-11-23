<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-green-400/10 to-teal-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <!-- 内容容器 -->
    <div class="relative min-h-screen flex flex-col">
      <!-- 顶部导航栏 -->
      <nav class="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- 左侧空白区域，用于保持对称 -->
            <div class="w-24">
            </div>
            
            <!-- 居中的标题 -->
            <div class="text-center flex-1">
              <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ✨ AI HTML 生成器
              </h1>
              <p class="text-gray-500 text-sm mt-1">🪄 让 AI 为您创造完美的 HTML 页面</p>
            </div>
            
            <!-- 右侧按钮，宽度与左侧空白区域相同 -->
            <div class="flex items-center gap-4 w-24 justify-end">
              <button 
                @click="showSettings = true"
                class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 
                       bg-gray-50/50 hover:bg-gray-100/50 rounded-lg transition-all duration-200
                       border border-gray-200/50 shadow-sm"
              >
                <span class="text-lg">⚙️</span>
                <span class="text-sm font-medium">设置</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- 主要内容区域 -->
      <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧面板 -->
          <div class="lg:sticky lg:top-28">
            <AIInputPanel 
              class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50" 
              @update:generated-code="updateGeneratedCode"
              @update:is-generating="updateIsGenerating"
            />
          </div>

          <!-- 右侧预览面板 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
            <div class="border-b border-gray-100">
              <div class="flex">
                <button 
                  v-for="tab in ['preview', 'code']"
                  :key="tab"
                  @click="activeTab = tab"
                  :class="[
                    'flex-1 px-8 py-4 text-sm font-medium transition-all duration-200 gap-2 flex items-center justify-center',
                    activeTab === tab 
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  ]"
                >
                  <span>{{ tab === 'code' ? '💻' : '🖼️' }}</span>
                  <span>{{ tab === 'code' ? '代码' : '预览' }}</span>
                </button>
              </div>
            </div>
            
            <div class="h-[calc(100%-3.5rem)]">
              <Transition name="fade" mode="out-in">
                <CodePreview 
                  v-if="activeTab === 'code'" 
                  :code="generatedCode" 
                  :is-generating="isGenerating"
                  class="h-full"
                />
                <LivePreview 
                  v-else
                  :html="generatedCode"
                  class="h-full"
                />
              </Transition>
            </div>
          </div>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="mt-auto py-8 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="flex items-center gap-8 text-gray-500">
              <a href="#" class="hover:text-gray-900 transition-colors">关于</a>
              <a href="#" class="hover:text-gray-900 transition-colors">文档</a>
              <a href="#" class="hover:text-gray-900 transition-colors">GitHub</a>
            </div>
            <div class="text-center">
              <p class="text-gray-600">🚀 使用 Vue 3 + TypeScript + Tailwind CSS 构建</p>
              <p class="mt-2 text-gray-500 text-sm">💝 Made with love for developers</p>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- 设置弹窗 -->
    <Transition name="modal">
      <div v-if="showSettings" class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div 
            class="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            @click="showSettings = false"
          ></div>
          <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div class="absolute top-4 right-4">
              <button 
                @click="showSettings = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <SettingsPanel @saved="showSettings = false" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingsPanel from './components/SettingsPanel.vue';
import AIInputPanel from './components/AIInputPanel.vue';
import CodePreview from './components/CodePreview.vue';
import LivePreview from './components/LivePreview.vue';

const generatedCode = ref('');
const activeTab = ref<'code' | 'preview'>('code');
const showSettings = ref(false);
const isGenerating = ref(false);

function updateGeneratedCode(code: string) {
  generatedCode.value = code;
}

function updateIsGenerating(value: boolean) {
  isGenerating.value = value;
  if (!value && generatedCode.value) {
    setTimeout(() => {
      activeTab.value = 'preview';
    }, 200);
  }
}
</script>

<style>
/* 添加全局滚动条样式 */
html {
  scroll-behavior: smooth;
  overflow-y: auto;
  overflow-x: hidden;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
