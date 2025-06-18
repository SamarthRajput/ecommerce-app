"use client"
import { useState } from 'react';

export default function BuyerChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello Samarth! How can I help you today?'},
    { id: 2, sender: 'buyer', text: 'Hi, I have a question about my recent order ORD-78945' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'buyer',
      text: newMessage
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate admin reply after 1 second
    setTimeout(() => {
      const adminReply = {
        id: messages.length + 2,
        sender: 'admin',
        text: 'Thanks for your message. We\'ll look into your order and get back to you shortly.'
      };
      setMessages(prev => [...prev, adminReply]);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>
      <p className="mb-6">Welcome, Samarth</p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Chat with Admin</h2>
        
        <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-3 ${message.sender === 'buyer' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${message.sender === 'buyer' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'}`}
              >
                {message.text}
                <div className="text-xs mt-1 opacity-70">
                  {message.sender === 'buyer' ? 'You' : 'Admin'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}