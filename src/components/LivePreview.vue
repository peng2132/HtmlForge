<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center px-4 py-2 bg-gray-50">
      <span class="text-sm text-gray-600">实时预览</span>
      <button 
        v-if="html"
        @click="openInNewTab"
        class="px-3 py-1.5 text-sm bg-white border rounded-md hover:bg-gray-50 
               transition-colors flex items-center gap-2"
      >
        <span>在新标签页中打开</span>
        <span>🔗</span>
      </button>
    </div>
    
    <!-- 普通预览 -->
    <div class="flex-1 overflow-auto p-4 bg-white">
      <iframe
        v-if="sanitizedHTML"
        ref="previewFrame"
        class="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
        :srcdoc="sanitizedHTML"
      ></iframe>
      <div v-else class="text-gray-400 text-sm text-center">
        生成的 HTML 页面将在这里显示
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps<{
  html: string
}>();

const previewFrame = ref<HTMLIFrameElement | null>(null);

const sanitizedHTML = computed(() => {
  let cleanHtml = props.html
    .replace(/```html\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  if (cleanHtml.includes('<!DOCTYPE html>')) {
    // 确保有正确的编码和视口设置
    if (!cleanHtml.includes('<meta charset="UTF-8">')) {
      cleanHtml = cleanHtml.replace('<head>', `<head>\n    <meta charset="UTF-8">`);
    }
    if (!cleanHtml.includes('viewport')) {
      cleanHtml = cleanHtml.replace('<head>', `<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    }
    return DOMPurify.sanitize(cleanHtml, {
      ADD_TAGS: ['style', 'script', 'meta'],
      ADD_ATTR: ['onclick', 'class', 'id', 'src', 'type', 'charset', 'name', 'content'],
      FORCE_BODY: true,
      WHOLE_DOCUMENT: true
    });
  }
  
  // 如果是 HTML 片段，包装成完整的文档
  return DOMPurify.sanitize(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>预览</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    ${cleanHtml}
</body>
</html>
  `, {
    ADD_TAGS: ['style', 'script', 'meta'],
    ADD_ATTR: ['onclick', 'class', 'id', 'src', 'type', 'charset', 'name', 'content'],
    FORCE_BODY: true,
    WHOLE_DOCUMENT: true
  });
});

function openInNewTab() {
  // 创建一个 Blob 对象，确保使用 UTF-8 编码
  const blob = new Blob([sanitizedHTML.value], { 
    type: 'text/html;charset=utf-8' 
  });
  const url = URL.createObjectURL(blob);
  
  // 在新标签页中打开
  window.open(url, '_blank');
  
  // 清理 URL 对象
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
</script>

<style scoped>
:deep(iframe) {
  border: none;
  margin: 0;
  padding: 0;
}
</style> 