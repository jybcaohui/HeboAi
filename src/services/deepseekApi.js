import axios from 'axios';
import { config } from '../config';

const deepseekApi = axios.create({
  baseURL: config.deepseek.apiUrl,
  headers: {
    'Authorization': `Bearer ${config.deepseek.apiKey}`,
    'Content-Type': 'application/json',
  }
});

export const chatWithAI = async (messages) => {
  try {
    const response = await deepseekApi.post('', {
      model: 'deepseek-chat',
      messages: messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI响应错误:', error);
    throw error;
  }
}; 