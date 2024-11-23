<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center px-4 py-2 bg-gray-50">
      <span class="text-sm text-gray-600">HTML 代码</span>
      <button 
        @click="copyCode"
        class="px-3 py-1.5 text-sm bg-white border rounded-md hover:bg-gray-50 transition-colors"
      >
        {{ copied ? '已复制！' : '复制代码' }}
      </button>
    </div>
    <div class="flex-1 overflow-auto p-4 bg-gray-50">
      <pre class="h-full"><code class="language-html" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const props = defineProps<{
  code: string
}>();

const copied = ref(false);

const highlightedCode = computed(() => {
  return hljs.highlight(props.code || '', { language: 'html' }).value;
});

async function copyCode() {
  if (!props.code) return;
  
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}
</script>

<style>
pre {
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white !important;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style> 