"use client";
import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
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
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 h-96">
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
                  className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.content}
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
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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