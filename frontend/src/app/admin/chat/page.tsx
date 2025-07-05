"use client";
import { CameraIcon, File } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatRoom {
  id: string;
  rfqId: string;
  type: "BUYER" | "SELLER";
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
  senderRole: "ADMIN" | "BUYER" | "SELLER";
  content: string;
  sentAt: Date;
  read: boolean;
}
interface API_RESPONSE {
  success: boolean;
  error?: string;
  chatRooms?: ChatRoom[];
}
interface RFQ {
  id: string;
  product: {
    id: string;
    name: string;
  };
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: "PENDING" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
}
export default function AdminChat() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]); // Always an array, safe for .length
  const [error, setError] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingRfqs, setLoadingRfqs] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await fetch(`${BASE_URL}/chat/chatrooms/admin`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch chat rooms");
        }
        const data: API_RESPONSE = await response.json();
        if (data.success) {
          setChatRooms(data.chatRooms || []);
        } else {
          setError(data.error || "Failed to fetch chat rooms");
        }
      } catch (err) {
        setError((err as Error).message);
      }
      setLoadingRooms(false);
    };

    const fetchRFQs = async () => {
      setLoadingRfqs(true);
      try {
        const response = await fetch(`${BASE_URL}/rfq/pending`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch RFQs");
        }
        const data = await response.json();
        setTestResponse(JSON.stringify(data, null, 2)); // For debugging

        // Handle both array and object with .data
        let rfqArr: any[] = [];
        if (Array.isArray(data)) {
          rfqArr = data;
        } else if (Array.isArray(data.rfqs)) {
          rfqArr = data.rfqs;
        } else if (Array.isArray(data.data)) {
          rfqArr = data.data;
        }
        setRfqs(rfqArr);
      } catch (err) {
        setError((err as Error).message);
      }
      setLoadingRfqs(false);
    };

    fetchChatRooms();
    fetchRFQs();
  }, [BASE_URL]);

  const fetchChatMessages = async (chatRoomId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `${BASE_URL}/chat/chatroom/${chatRoomId}/messages`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch chat messages");
      }
      const data: ChatMessage[] = await response.json();
      setMessages(data);
    } catch (err) {
      setError((err as Error).message);
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  const sendMessage = async (chatRoomId: string, content: string) => {
    if (!content.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/chat/chatroom/message`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId,
          content,
          senderRole: "ADMIN",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
      fetchChatMessages(chatRoomId);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const markMessagesAsRead = async (chatRoomId: string) => {
    try {
      const responseMessages = await fetch(
        `${BASE_URL}/chat/chatroom/${chatRoomId}/messages`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data: ChatMessage[] = await responseMessages.json();
      const unreadMessageIds = data
        .filter(msg => msg.senderRole !== "ADMIN" && !msg.read)
        .map(msg => msg.id);

      if (unreadMessageIds.length === 0) return;

      await fetch(`${BASE_URL}/chat/chatroom/${chatRoomId}/mark-read`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageIds: unreadMessageIds,
          chatRoomId,
        }),
      });
      fetchChatMessages(chatRoomId);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const createChatRoom = async (rfqId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/chatroom`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create chat room");
      }
      const data = await response.json();
      setChatRooms((prev) => [...prev, data]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleViewMessages = (room: ChatRoom) => {
    setSelectedRoom(room);
    setShowModal(true);
    fetchChatMessages(room.id);
    markMessagesAsRead(room.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* <section className="mb-6">
        {testResponse && (
          <pre className="bg-gray-100 p-4 rounded mb-4">
            <code className="text-sm text-gray-700">{testResponse}</code>
          </pre>
        )}
      </section> */}
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Chat Management</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* RFQ List */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending RFQs</h2>
        {loadingRfqs ? (
          <div className="text-center py-4 text-blue-500">Loading RFQs...</div>
        ) : (
          <div>
            {rfqs.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No pending RFQs.</div>
            ) : (
              rfqs.map((rfq) => {
                const sellerChatExists = chatRooms.some(
                  (room) => room.rfqId === rfq.id && room.type === "SELLER"
                );
                return (
                  <div
                    key={rfq.id}
                    className="border p-4 mb-4 rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="font-semibold">
                        Product: {rfq.product.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Buyer: {rfq.buyer.firstName} {rfq.buyer.lastName} ({rfq.buyer.email})
                      </div>
                      <div className="text-xs text-gray-500">
                        RFQ ID: <span className="font-mono">{rfq.id}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Created: {new Date(rfq.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      {sellerChatExists ? (
                        <span className="text-green-600 font-semibold hover:underline cursor-pointer"
                          onClick={() => handleViewMessages(chatRooms.find(room => room.rfqId === rfq.id && room.type === "SELLER")!)}
                        >Open Seller Chat</span>
                      ) : (
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                          onClick={() => createChatRoom(rfq.id)}
                        >
                          Start Seller Chat
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mr-2 rounded transition ${activeTab === "buyer"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-800"
            }`}
          onClick={() => setActiveTab("buyer")}
        >
          Buyer Chats
        </button>
        <button
          className={`px-4 py-2 rounded transition ${activeTab === "seller"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-800"
            }`}
          onClick={() => setActiveTab("seller")}
        >
          Seller Chats
        </button>
      </div>
      <div>
        {loadingRooms ? (
          <div className="text-center py-8 text-blue-500">Loading chat rooms...</div>
        ) : (
          chatRooms
            .filter((room) => room.type === (activeTab === "buyer" ? "BUYER" : "SELLER"))
            .map((room) => (
              <div
                key={room.id}
                className={`border p-4 mb-4 rounded-lg shadow-sm transition ${selectedRoom?.id === room.id ? "border-blue-500 bg-blue-50" : "hover:border-blue-300 hover:bg-blue-50 cursor-pointer"}`}
                onClick={() => handleViewMessages(room)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Chat Room <span className="text-blue-600">#{room.id}</span>
                    </h2>
                    <div className="text-sm text-gray-600 mb-1">
                      RFQ ID: <span className="font-mono">{room.rfqId}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(room.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated: {new Date(room.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                    onClick={() => handleViewMessages(room)}
                  >
                    View Messages
                  </button>
                </div>
              </div>
            ))
        )}
        {!loadingRooms &&
          chatRooms.filter(
            (room) => room.type === (activeTab === "buyer" ? "BUYER" : "SELLER")
          ).length === 0 && (
            <div className="text-gray-500 text-center py-8">
              No chat rooms available.
            </div>
          )}
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Total ChatRooms found: {chatRooms.length}
        </h2>
      </section>

      {/* Modal for chat messages */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">
              Messages for Chat Room <span className="text-blue-600">#{selectedRoom.id}</span>
            </h3>
            {loadingMessages ? (
              <div className="text-blue-500 py-8 text-center">Loading messages...</div>
            ) : (
              <div className="mb-4">
                <div className="max-h-60 overflow-y-auto scroll-m-2 flex flex-col gap-2">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderRole === "ADMIN" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`p-3 mb-2 rounded max-w-xs break-words
                      ${message.senderRole === "ADMIN"
                              ? "bg-blue-100 text-blue-900 ml-16"
                              : "bg-gray-100 text-gray-800 mr-16"
                            }`}
                        >
                          <div className="font-semibold text-xs mb-1">{message.senderRole}</div>
                          <div>{message.content}</div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {new Date(message.sentAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No messages in this chat room.</div>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <p className="text-sm text-gray-500">
                    Type your message below and press Enter to send. Use Shift + Enter for a new line.
                  </p>
                  <div className="flex items-center gap-4">
                    <CameraIcon className="h-6 w-6 text-blue-500 mb-4" />
                    <File className="h-6 w-6 text-blue-500 mb-4" />
                    <textarea
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(selectedRoom.id, (e.target as HTMLTextAreaElement).value);
                          (e.target as HTMLTextAreaElement).value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}