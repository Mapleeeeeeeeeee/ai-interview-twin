import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, Bot, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { interviewAPI, userAPI } from '../services/api';

const Interview = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeInterview();
    return () => {
      // Cleanup session when component unmounts
      if (sessionId) {
        interviewAPI.clearSession(sessionId).catch(console.error);
      }
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      
      // Get user info
      const user = await userAPI.getUser(userId);
      setUserInfo(user);
      
      // Start interview session
      const session = await interviewAPI.startInterview(userId);
      setSessionId(session.session_id);
      
      // Add welcome message
      setMessages([
        {
          role: 'system',
          content: `歡迎來到與 ${user.profile_data?.basic_info?.name || '候選人'} 的面試！您可以開始提問任何相關問題。`,
          timestamp: new Date().toISOString()
        }
      ]);
      
    } catch (err) {
      setError('初始化面試失敗');
      console.error('Initialize interview error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add interviewer message immediately
    const newMessage = {
      role: 'interviewer',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await interviewAPI.sendMessage(userId, userMessage, sessionId);
      
      // Add candidate response
      setMessages(prev => [...prev, {
        role: 'candidate',
        content: response.response,
        timestamp: response.timestamp
      }]);
      
      // Update session ID if changed
      if (response.session_id !== sessionId) {
        setSessionId(response.session_id);
      }
      
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => [...prev, {
        role: 'system',
        content: '抱歉，發生了錯誤。請稍後再試。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      if (sessionId) {
        await interviewAPI.clearSession(sessionId);
      }
      await initializeInterview();
    } catch (err) {
      console.error('Reset interview error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message, index) => {
    const isSystem = message.role === 'system';
    const isInterviewer = message.role === 'interviewer';
    const isCandidate = message.role === 'candidate';

    if (isSystem) {
      return (
        <div key={index} className="flex justify-center mb-4">
          <div className="glass rounded-lg px-4 py-2 text-white/80 text-sm">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        className={`flex mb-6 ${isInterviewer ? 'justify-end' : 'justify-start'} animate-slide-up`}
      >
        <div className={`flex items-start max-w-2xl ${isInterviewer ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isInterviewer ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isInterviewer 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-green-400 to-blue-500'
            }`}>
              {isInterviewer ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
          </div>
          
          {/* Message content */}
          <div className={`message-bubble ${isInterviewer ? 'message-interviewer' : 'message-candidate'}`}>
            <div className={`text-sm font-medium mb-1 ${isInterviewer ? 'text-white/90' : 'text-gray-600'}`}>
              {isInterviewer ? '面試官' : userInfo?.profile_data?.basic_info?.name || '候選人'}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
            <div className={`text-xs mt-2 ${isInterviewer ? 'text-white/70' : 'text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-400 mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-4">發生錯誤</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-3d"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/20 p-4 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-cyber rounded-full flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">
                  面試 - {userInfo?.profile_data?.basic_info?.name || '候選人'}
                </h1>
                <p className="text-white/70 text-sm">數位分身面試體驗</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新開始
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="ml-2 text-gray-600 text-sm">正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="glass border-t border-white/20 p-6 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="輸入您的面試問題..."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-2 px-2">
                <div className="text-white/60 text-sm flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  按 Enter 發送，Shift+Enter 換行
                </div>
                <div className="text-white/60 text-sm">
                  {inputValue.length}/500
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
