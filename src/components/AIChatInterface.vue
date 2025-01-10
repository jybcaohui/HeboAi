<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>HeboAI</h1>
    </div>
    
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.type]">
        <div class="message-content"
             v-if="message.type === 'user'">
          {{ message.text }}
        </div>
        <div class="message-content markdown-body"
             v-else
             v-html="renderMarkdown(message.text)">
        </div>
      </div>
      <div v-if="isLoading" class="message ai">
        <div class="message-content loading">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <input 
        ref="inputField"
        type="text" 
        v-model="userInput" 
        @keyup.enter="sendMessage"
        placeholder="输入您的问题..."
      >
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
        <span class="send-icon">↑</span>
      </button>
    </div>
  </div>
</template>

<script>
import { chatWithAI } from '../services/deepseekApi';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {
        console.error(e);
      }
    }
    return code;
  },
  breaks: true,
  gfm: true
});

export default {
  name: 'AIChatInterface',
  data() {
    return {
      userInput: '',
      messages: [
        {
          type: 'ai',
          text: '你好！我是 HeboAI，很高兴为您服务。'
        }
      ],
      isLoading: false
    }
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;
      
      const userMessage = {
        type: 'user',
        text: this.userInput.trim()
      };
      
      this.messages.push(userMessage);
      this.userInput = '';
      this.isLoading = true;

      try {
        const aiResponse = await chatWithAI(this.messages);
        this.messages.push({
          type: 'ai',
          text: aiResponse
        });
      } catch (error) {
        this.messages.push({
          type: 'ai',
          text: '抱歉，我遇到了一些问题。请稍后再试。'
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
          this.$refs.inputField.focus();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
    renderMarkdown(text) {
      try {
        return marked(text);
      } catch (e) {
        console.error('Markdown 渲染错误:', e);
        return text;
      }
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.chat-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
}

.chat-header h1 {
  margin: 0;
  color: #333;
  font-weight: 500;
  font-size: 24px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.message {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.5;
}

.user {
  align-items: flex-end;
}

.user .message-content {
  background: #007AFF;
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.ai .message-content {
  background: white;
  color: #333;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  max-width: 90%;
}

.chat-input {
  padding: 20px;
  display: flex;
  gap: 10px;
  background: white;
  border-top: 1px solid #eaeaea;
}

input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #eaeaea;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #007AFF;
}

button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: #007AFF;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

button:hover {
  background: #0056b3;
}

.send-icon {
  font-size: 18px;
}

.loading {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  min-width: 60px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #007AFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
  opacity: 0.6;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1.0);
  }
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.markdown-body {
  font-size: 15px;
  line-height: 1.6;
}

.markdown-body :deep(p) {
  margin: 8px 0;
}

.markdown-body :deep(pre) {
  background: #f6f8fa;
  border-radius: 6px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
}

.markdown-body :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 13px;
  background: #f6f8fa;
  padding: 2px 4px;
  border-radius: 3px;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(ul), 
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.markdown-body :deep(li) {
  margin: 4px 0;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 12px;
}

.markdown-body :deep(th) {
  background: #f6f8fa;
}

.markdown-body :deep(blockquote) {
  margin: 8px 0;
  padding-left: 12px;
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #dfe2e5;
  margin: 16px 0;
}

.markdown-body :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}
</style> 