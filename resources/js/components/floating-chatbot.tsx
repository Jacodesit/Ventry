import React, { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const FloatingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hey. I'm Paul, your support listener. You can share anything with me, and I'll listen without judgment. Even the things you can't say out loud. What's on your mind?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close chat when pressing ESC
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) {
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/chatbot/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    message: userMessage,
                    history: history
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response
            }]);

            if (!isOpen) {
                setHasUnread(true);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);

            if (isOpen) {
                inputRef.current?.focus();
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window - Only visible when open */}
            {isOpen && (
                <div
                    ref={chatWindowRef}
                    className="mb-4 bg-white rounded-2xl shadow-2xl w-96 h-137 flex flex-col overflow-hidden border border-gray-200
                    dark:border-0"
                >
                    {/* Header */}
                    <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <span className="text-2xl">💭</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Paul</h3>
                                <p className="text-blue-100 text-sm">Safe space • You talk, I listen.</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0a0a0a]">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 shrink-0">
                                        <span className="text-sm">🩵</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-md'
                                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200 dark:bg-[#1e1e1e] dark:text-accent-foreground dark:border-0'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center ml-2 shrink-0">
                                        <span className="text-sm">👤</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-sm">🩵</span>
                                </div>
                                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200 ">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white dark:bg-[#1e1e1e]">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Say what you can't say out loud…"
                                className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-4 py-2 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Footer Note */}
                    <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-100 dark:bg-[#1e1e1e]">
                        <p className="text-xs text-gray-500">This is anonymous. No one knows it's you.</p>
                    </div>
                </div>
            )}

            {/* Chat Bubble Button - Only visible when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                    aria-label="Open chat"
                >
                    <span className="text-2xl">💭</span>
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-16 right-0 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Need someone to talk to? 😊
                    </div>
                </button>
            )}
        </div>
    );
};

export default FloatingChatbot;
