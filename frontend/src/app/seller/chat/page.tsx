"use client"
import { useState } from 'react';

export default function SellerChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello Seller! Do you have any questions?'},
    { id: 2, sender: 'seller', text: 'Yes, I need to update my product inventory'},
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'seller',
      text: newMessage
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate admin reply after 1 second
    setTimeout(() => {
      const adminReply = {
        id: messages.length + 2,
        sender: 'admin',
        text: 'We can help with that. Please provide the product details.'
      };
      setMessages(prev => [...prev, adminReply]);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      <p className="mb-6">Welcome, TechSeller</p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Chat with Admin</h2>
        
        <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-3 ${message.sender === 'seller' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${message.sender === 'seller' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800'}`}
              >
                {message.text}
                <div className="text-xs mt-1 opacity-70">
                  {message.sender === 'seller' ? 'You' : 'Admin'}
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
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}