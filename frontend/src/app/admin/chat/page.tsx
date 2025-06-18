"use client"
import { useState } from 'react';

export default function AdminChat() {
  const [activeTab, setActiveTab] = useState('buyer');
  
  const [buyerMessages, setBuyerMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello Samarth! How can I help you today?'},
    { id: 2, sender: 'buyer', text: 'Hi, I have a question about my recent order ORD-78945'},
  ]);
  
  const [sellerMessages, setSellerMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello Seller! Do you have any questions?'},
    { id: 2, sender: 'seller', text: 'Yes, I need to update my product inventory'},
  ]);
  
  const [newBuyerMessage, setNewBuyerMessage] = useState('');
  const [newSellerMessage, setNewSellerMessage] = useState('');

  const handleSendBuyerMessage = () => {
    if (newBuyerMessage.trim() === '') return;
    
    const newMsg = {
      id: buyerMessages.length + 1,
      sender: 'admin',
      text: newBuyerMessage
    };
    
    setBuyerMessages([...buyerMessages, newMsg]);
    setNewBuyerMessage('');
  };

  const handleSendSellerMessage = () => {
    if (newSellerMessage.trim() === '') return;
    
    const newMsg = {
      id: sellerMessages.length + 1,
      sender: 'admin',
      text: newSellerMessage
    };
    
    setSellerMessages([...sellerMessages, newMsg]);
    setNewSellerMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'buyer' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('buyer')}
          >
            Buyer Chats
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'seller' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('seller')}
          >
            Seller Chats
          </button>
        </div>
        
        {activeTab === 'buyer' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Chat with Buyer</h2>
            
            <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              {buyerMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 ${message.sender === 'admin' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg ${message.sender === 'admin' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'}`}
                  >
                    {message.text}
                    <div className="text-xs mt-1 opacity-70">
                      {message.sender === 'admin' ? 'You' : 'Buyer'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newBuyerMessage}
                onChange={(e) => setNewBuyerMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendBuyerMessage()}
              />
              <button
                onClick={handleSendBuyerMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Chat with Seller</h2>
            
            <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              {sellerMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 ${message.sender === 'admin' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg ${message.sender === 'admin' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-800'}`}
                  >
                    {message.text}
                    <div className="text-xs mt-1 opacity-70">
                      {message.sender === 'admin' ? 'You' : 'Seller'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSellerMessage}
                onChange={(e) => setNewSellerMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendSellerMessage()}
              />
              <button
                onClick={handleSendSellerMessage}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}