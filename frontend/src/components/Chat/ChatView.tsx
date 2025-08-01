"use client"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import {
    Send,
    RefreshCw,
    MoreVertical,
    Paperclip,
    Camera,
    Shield,
    FileText,
    Download,
    Reply,
    Pin,
    Trash2,
    Edit,
    MessageSquare,
    X,
    Smile,
} from "lucide-react"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/src/context/AuthContext"

interface MessageReaction {
    id: string
    messageId: string
    reactorId: string
    reactorRole: string
    emoji: string
    createdAt: Date
}

export type Role = "SELLER" | "BUYER" | "ADMIN"
export type MessageStatus = "sending" | "sent" | "read"

export interface ChatReaction {
    reactorId: string
    reactorRole: Role
    emoji: string
    reactedAt: string
}

export interface ReplyToMessage {
    id: string
    content: string | null
    senderId: string
    senderRole: Role
    deleted: boolean
}

export interface ChatMessage {
    id: string
    chatRoomId: string
    content: string | null
    senderId: string
    senderRole: Role
    sentAt: string
    status: MessageStatus
    read: boolean
    edited: boolean
    deleted: boolean
    isPinned: boolean
    isStarred: boolean
    attachmentType: "raw" | "image"
    attachmentUrl: string
    replyTo: ReplyToMessage | null
    reactions: ChatReaction[]
}

interface ChatViewProps {
    chatRoomId: string
    messages: ChatMessage[]
    isLoading?: boolean
    onSendMessage: (content: string, replyToId?: string) => Promise<void>
    onUploadFile: (file: File) => Promise<void>
    onEditMessage?: (messageId: string, content: string) => Promise<void>
    onDeleteMessage?: (messageId: string) => Promise<void>
    onPinMessage?: (messageId: string, pin: boolean) => Promise<void>
    onReactToMessage?: (messageId: string, emoji: string) => Promise<void>
    onMarkAsRead?: (messageId: string) => Promise<void>
    headerContent?: React.ReactNode
    placeholder?: string
}

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"]

const ChatView: React.FC<ChatViewProps> = ({
    chatRoomId,
    messages,
    isLoading = false,
    onSendMessage,
    onUploadFile,
    onEditMessage,
    onDeleteMessage,
    onPinMessage,
    onReactToMessage,
    onMarkAsRead,
    headerContent,
    placeholder = "Type your message...",
}) => {
    const [newMessage, setNewMessage] = useState("")
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
    const [editingMessage, setEditingMessage] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
    const [sending, setSending] = useState(false)
    const [currentUserRole, setCurrentUserRole] = useState("ADMIN")

    const { authLoading, role } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (authLoading) return
        setCurrentUserRole(role?.toUpperCase() || "ADMIN")
        scrollToBottom()
    }, [authLoading, role])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return

        const currentMessage = newMessage.trim()
        setNewMessage("")
        setSending(true)

        try {
            await onSendMessage(currentMessage, replyingTo?.id)
            setReplyingTo(null)
        } catch (error) {
            setNewMessage(currentMessage)
            console.error("Failed to send message:", error)
        } finally {
            setSending(false)
        }
    }

    const handleEditMessage = async (messageId: string) => {
        if (!onEditMessage || !editContent.trim()) return

        try {
            await onEditMessage(messageId, editContent.trim())
            setEditingMessage(null)
            setEditContent("")
        } catch (error) {
            console.error("Failed to edit message:", error)
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onUploadFile(file)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onUploadFile(file)
        }
        if (cameraInputRef.current) {
            cameraInputRef.current.value = ""
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (editingMessage) {
                handleEditMessage(editingMessage)
            } else {
                handleSendMessage()
            }
        }
    }

    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const isImageAttachment = (message: ChatMessage) => {
        return message.attachmentType === "image" && message.attachmentUrl
    }

    const isPdfAttachment = (message: ChatMessage) => {
        return message.attachmentType === "raw" && message.attachmentUrl
    }

    const getFileName = (url: string) => {
        try {
            const urlParts = url.split("/")
            const fileName = urlParts[urlParts.length - 1]
            return fileName.split("_").slice(-1)[0] || "document"
        } catch {
            return "document"
        }
    }

    const renderAttachment = (message: ChatMessage) => {
        if (isImageAttachment(message)) {
            return (
                <div className="mt-2">
                    <img
                        src={message.attachmentUrl || "/placeholder.svg"}
                        alt="Shared image"
                        className="max-w-full max-h-64 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => window.open(message.attachmentUrl, "_blank")}
                    />
                    {message.content && <p className="text-sm mt-2 opacity-90">{message.content}</p>}
                </div>
            )
        }

        if (isPdfAttachment(message)) {
            const fileName = getFileName(message.attachmentUrl!)
            return (
                <div className="mt-2">
                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 max-w-xs">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                                <p className="text-xs text-gray-500">PDF Document</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(message.attachmentUrl, "_blank")}
                                className="shrink-0 h-8 w-8 p-0"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    {message.content && <p className="text-sm mt-2 opacity-90">{message.content}</p>}
                </div>
            )
        }

        return null
    }

    const renderReactions = (message: ChatMessage) => {
        if (!message.reactions || message.reactions.length === 0) return null

        const reactionCounts = message.reactions.reduce(
            (acc, reaction) => {
                acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )

        return (
            <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(reactionCounts).map(([emoji, count]) => {
                    const userReacted = message.reactions?.some((r) => r.emoji === emoji && r.reactorId === currentUserRole)
                    return (
                        <button
                            key={emoji}
                            onClick={() => onReactToMessage?.(message.id, emoji)}
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${userReacted
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <span>{emoji}</span>
                            <span>{count}</span>
                        </button>
                    )
                })}
            </div>
        )
    }

    const renderMessageOptions = (message: ChatMessage) => {
        const isFromCurrentUser = message.senderId === currentUserRole
        const canEdit =
            isFromCurrentUser &&
            !message.deleted &&
            new Date().getTime() - new Date(message.sentAt).getTime() < 15 * 60 * 1000

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-3 h-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                    </DropdownMenuItem>
                    {onPinMessage && (
                        <DropdownMenuItem onClick={() => onPinMessage(message.id, !message.isPinned)}>
                            <Pin className="w-4 h-4 mr-2" />
                            {message.isPinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                    )}
                    {canEdit && onEditMessage && (
                        <DropdownMenuItem
                            onClick={() => {
                                setEditingMessage(message.id)
                                setEditContent(message.content ?? "")
                            }}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                    )}
                    {isFromCurrentUser && onDeleteMessage && (
                        <DropdownMenuItem onClick={() => onDeleteMessage(message.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setShowEmojiPicker(message.id)}>
                        <Smile className="w-4 h-4 mr-2" />
                        React
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    const renderReplyPreview = (message: ChatMessage) => {
        if (!message.replyTo) return null

        return (
            <div className="mb-2 p-2 border-l-2 border-gray-300 bg-gray-50 rounded">
                <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                        {message.replyTo.senderRole === currentUserRole ? "You" : message.replyTo.senderRole}
                    </Badge>
                </div>
                <p className="text-xs text-gray-600 truncate">
                    {message.replyTo.deleted ? "This message was deleted" : message.replyTo.content || "Attachment"}
                </p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.pdf" className="hidden" />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                accept="image/*"
                capture="environment"
                className="hidden"
            />

            {headerContent && (
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                    {headerContent}
                </CardHeader>
            )}

            <CardContent className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 opacity-50" />
                            <h4 className="font-semibold mb-2">No messages yet</h4>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 lg:space-y-6">
                        {messages.map((message) => {
                            const isSent = message.senderRole === role?.toUpperCase()
                            const isFromCurrentUser = message.senderRole === currentUserRole
                            const hasAttachment = isImageAttachment(message) || isPdfAttachment(message)

                            return (
                                <div key={message.id} className={`flex group ${isSent ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] lg:max-w-md ${isSent ? "order-2" : "order-1"}`}>
                                        <div className="flex items-center mb-2 space-x-2">
                                            {!isSent && (
                                                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <Shield className="w-3 h-3 text-purple-600" />
                                                </div>
                                            )}
                                            <Badge
                                                className={`text-xs ${isSent
                                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                                    : "bg-purple-100 text-purple-700 border-purple-200"
                                                    }`}
                                            >
                                                {isFromCurrentUser ? "You" : message.senderRole}
                                            </Badge>
                                            <span className="text-xs text-gray-500">{formatMessageTime(new Date(message.sentAt))}</span>
                                            {message.edited && (
                                                <Badge variant="outline" className="text-xs text-gray-400">
                                                    edited
                                                </Badge>
                                            )}
                                            {message.isPinned && <Pin className="w-3 h-3 text-yellow-600" />}
                                            {renderMessageOptions(message)}
                                        </div>

                                        {renderReplyPreview(message)}

                                        <div
                                            className={`px-3 py-2 lg:px-4 lg:py-3 rounded-2xl shadow-sm ${isSent
                                                ? "bg-blue-600 text-white rounded-br-md"
                                                : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                                                }`}
                                        >
                                            {message.deleted ? (
                                                <p className="text-sm italic opacity-60">This message was deleted</p>
                                            ) : editingMessage === message.id ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        onKeyDown={handleKeyPress}
                                                        className="text-sm bg-transparent border-none p-0 resize-none focus:ring-0"
                                                        rows={1}
                                                    />
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" onClick={() => handleEditMessage(message.id)} className="h-6 text-xs">
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setEditingMessage(null)
                                                                setEditContent("")
                                                            }}
                                                            className="h-6 text-xs"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {message.content && !hasAttachment && (
                                                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                                    )}
                                                    {hasAttachment && renderAttachment(message)}
                                                </>
                                            )}
                                        </div>

                                        {renderReactions(message)}

                                        {showEmojiPicker === message.id && (
                                            <div className="flex space-x-1 mt-2 p-2 bg-white rounded-lg shadow-md border">
                                                {EMOJI_REACTIONS.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => {
                                                            onReactToMessage?.(message.id, emoji)
                                                            setShowEmojiPicker(null)
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                                <button onClick={() => setShowEmojiPicker(null)} className="p-1 hover:bg-gray-100 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {isFromCurrentUser && (
                                            <div className="flex justify-end mt-1">
                                                <span className="text-xs text-gray-500">{message.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </CardContent>

            {replyingTo && (
                <div className="border-t bg-blue-50 p-3 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs text-blue-600 font-medium">
                            Replying to {replyingTo.senderRole === currentUserRole ? "yourself" : replyingTo.senderRole}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{replyingTo.content || "Attachment"}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="h-6 w-6 p-0">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            <div className="border-t bg-white p-3 lg:p-4 flex-shrink-0">
                <div className="flex items-end space-x-2 lg:space-x-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mb-2 p-2"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={sending}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upload File</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mb-2 p-2"
                                    onClick={() => cameraInputRef.current?.click()}
                                    disabled={sending}
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Take Photo</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="flex-1">
                        <Textarea
                            placeholder={placeholder}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                            className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            style={{ minHeight: "40px", maxHeight: "120px" }}
                        />
                    </div>

                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="h-10 bg-blue-600 hover:bg-blue-700 px-3 lg:px-4"
                    >
                        {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    Supported: Images (JPEG, PNG, GIF, WebP) and PDF documents (max 5MB)
                </div>
            </div>
        </div>
    )
}

export default ChatView
