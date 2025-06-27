"use client"
import { useEffect, useState } from 'react';

interface ChatRoom {
  id: string;
  rfqId: string;
  type: 'BUYER' | 'SELLER';
  buyerId?: string;
  sellerId?: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: 'ADMIN' | 'BUYER' | 'SELLER';
  content: string;
  sentAt: Date;
  read: boolean;
}
interface RFQ {
  id: string;
  product: {
    name: string;
  };
  status: string;
}
interface API_RESPONSE {
  success: boolean;
  error?: string;
  chatRooms?: ChatRoom[];
}
export default function AdminChat() {
  const [activeTab, setActiveTab] = useState('buyer');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(`${BASE_URL}/chat/chatrooms/admin`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chat rooms');
        }

        const data: API_RESPONSE = await response.json();
        if (data.success) {
          setChatRooms(data.chatRooms || []);
        } else {
          setError(data.error || 'Failed to fetch chat rooms');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchChatRooms();
  }
    , [BASE_URL]);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Chat Management</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
          onClick={() => setActiveTab('buyer')}
        >
          Buyer Chats
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
          onClick={() => setActiveTab('seller')}
        >
          Seller Chats
        </button>
      </div>
      <div>
        {chatRooms.filter(room => room.type === (activeTab === 'buyer' ? 'BUYER' : 'SELLER')).map(room => (
          <div key={room.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Chat Room ID: {room.id}</h2>
            <p>RFQ ID: {room.rfqId}</p>
            <p>Type: {room.type}</p>
            <p>Created At: {new Date(room.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(room.updatedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Total ChatRooms found: {chatRooms.length}</h2>
        {chatRooms.length === 0 && (
          <p className="text-gray-500">No chat rooms available.</p>
        )}
      </section>
    </div>
  );
}