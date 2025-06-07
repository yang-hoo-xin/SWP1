const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 允许跨域请求
app.use(cors());
app.use(bodyParser.json());

// 模拟延迟响应
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 处理聊天请求
app.post('/api/chat', async (req, res) => {
  try {
    // 模拟API延迟
    await delay(1000);
    
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '无效的请求格式' });
    }
    
    // 获取最后一条用户消息
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: '未找到用户消息' });
    }
    
    // 简单的回复逻辑
    let reply = '';
    const userQuestion = lastUserMessage.content.toLowerCase();
    
    if (userQuestion.includes('你好') || userQuestion.includes('hi') || userQuestion.includes('hello')) {
      reply = '你好！我是AI助手，有什么可以帮助你的？';
    } else if (userQuestion.includes('名字') || userQuestion.includes('叫什么')) {
      reply = '我是AI智能助手，很高兴为您服务！';
    } else if (userQuestion.includes('天气')) {
      reply = '抱歉，我目前无法获取实时天气信息。但是您可以通过天气App或网站查询最新的天气预报。';
    } else if (userQuestion.includes('时间') || userQuestion.includes('几点')) {
      reply = `现在的时间是 ${new Date().toLocaleTimeString()}`;
    } else if (userQuestion.includes('帮助') || userQuestion.includes('能做什么')) {
      reply = '我可以回答问题、提供信息、进行简单的对话等。有什么我可以帮助你的吗？';
    } else if (userQuestion.includes('代码') || userQuestion.includes('编程')) {
      reply = '以下是一个简单的JavaScript函数示例：\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n// 输出: Hello, World!\n```';
    } else {
      // 默认回复
      reply = `我收到了您的消息："${lastUserMessage.content}"。作为一个AI助手，我正在尽力理解和回答您的问题。请问还有其他我可以帮助您的吗？`;
    }
    
    res.json({
      role: 'assistant',
      content: reply
    });
    
  } catch (error) {
    console.error('处理请求出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`模拟API服务器运行在 http://localhost:${port}`);
}); 