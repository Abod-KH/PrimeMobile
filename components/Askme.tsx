"use client";
import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Askme = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    const systemPrompt: Message = {
      role: 'system',
      content: `You are "PrimeMobile", an AI shopping assistant for an e-commerce website.

Your goals:
1. Help users choose the right products (PCs, laptops, phones, and electronics).
2. Always answer clearly, concisely, and in a customer-friendly tone.
3. Never invent specifications, prices, or details. Only use the product data I provide.
4. If information is missing, politely say you don’t have it.
5. When comparing products, show pros and cons in bullet points.
6. Suggest accessories or related items when it makes sense (cross-sell).

Response format:
* Always reply in **Markdown** so it can render in my chat UI.
* Use headings (###), bold text, bullet points, and short paragraphs.
* For product recommendations, use:

### Product Name — $Price

* Key spec 1
* Key spec 2
* Key spec 3
  Short description.

* For comparisons, use a **side-by-side bullet format**.

Example:
Here are my top picks under $1500:

### 1. **Acer Nitro 5** — $1,199.99

* Intel i7, 16GB RAM, RTX 3060
* Great for gaming and content creation
* Solid cooling system

### 2. **ASUS TUF Dash** — $1,499.00

* Intel i7, 16GB RAM, RTX 3070
* Lightweight design
* High refresh rate display

💡 Recommendation: If you value portability, pick the **ASUS TUF Dash**. For better value, choose the **Acer Nitro 5**.

Final rules:
* Keep answers under 200 words unless the user asks for detail.
* Be persuasive but not pushy.
* Always be friendly and helpful.`,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [systemPrompt, ...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50">
      {!isOpen && (
        <button
          className="bg-shop_dark_green text-white p-3 rounded-full shadow-lg hover:bg-[#90D1CA] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-90 h-[500px]">
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Ask Me Anything</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-shop_dark_green text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">
                <span>Typing...</span>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-shop_dark_green text-white p-2 rounded-r-lg hover:bg-[#90D1CA] focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:ring-opacity-50"
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Askme;