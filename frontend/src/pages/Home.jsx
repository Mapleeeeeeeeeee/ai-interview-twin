import React, { useState, useEffect, useRef } from 'react';
import { User, Bot, Send, MessageCircle, Code, Briefcase, GraduationCap, MapPin, Mail, Phone, Star } from 'lucide-react';
import { userAPI, interviewAPI } from '../services/api';
import StatusIndicator from '../components/StatusIndicator';

const Home = () => {
  // 默認使用第一個用戶（可以根據需要修改）
  const defaultUserId = "1";
  
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      
      // 獲取用戶資料
      const user = await userAPI.getUser(defaultUserId);
      setUserInfo(user);
      
      // 開始面試session
      const session = await interviewAPI.startInterview(defaultUserId);
      setSessionId(session.session_id);
      
      // 添加歡迎訊息
      setMessages([
        {
          role: 'assistant',
          content: `你好！我是 ${user.profile_data?.basic_info?.name || '候選人'}，很高興與您進行這次面試交流。請隨時提問任何您想了解的問題！`,
          timestamp: new Date().toISOString()
        }
      ]);
      
    } catch (error) {
      console.error('初始化錯誤:', error);
      setMessages([
        {
          role: 'system',
          content: '抱歉，初始化時發生錯誤。請重新整理頁面再試。',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 立即添加用戶訊息
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await interviewAPI.sendMessage(defaultUserId, userMessage, sessionId);
      
      // 添加AI回覆
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp
      }]);
      
    } catch (error) {
      console.error('發送訊息錯誤:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: '抱歉，發生了錯誤。請稍後再試。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem) {
      return (
        <div key={index} className="flex justify-center mb-4">
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-800 text-sm">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} fade-in`}>
        <div className={`flex items-start max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 頭像 */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              {isUser ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
          
          {/* 訊息內容 */}
          <div className={`message-bubble ${isUser ? 'message-sent' : 'message-received'}`}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
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

  // 快捷問題
  const quickQuestions = [
    "請先自我介紹一下",
    "您的技術專長是什麼？", 
    "可以分享一個具體的專案經驗嗎？",
    "您對這個職位的期望是什麼？"
  ];

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="apple-card">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
            <span className="text-body">正在初始化面試環境...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-3rem)]">
          
          {/* 左側：個人資訊卡片 */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 主要資訊卡片 */}
            <div className="apple-card">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-headline mb-2">
                  {userInfo?.profile_data?.basic_info?.name || '候選人'}
                </h1>
                <p className="text-body">
                  {userInfo?.profile_data?.career_objective?.target_position || 'AI/ML 工程師'}
                </p>
              </div>

              {/* 聯絡資訊 */}
              <div className="space-y-3 mb-6">
                {userInfo?.profile_data?.basic_info?.email && (
                  <div className="flex items-center text-caption">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {userInfo.profile_data.basic_info.email}
                  </div>
                )}
                {userInfo?.profile_data?.basic_info?.phone && (
                  <div className="flex items-center text-caption">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {userInfo.profile_data.basic_info.phone}
                  </div>
                )}
                {userInfo?.profile_data?.basic_info?.location && (
                  <div className="flex items-center text-caption">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {userInfo.profile_data.basic_info.location}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t divider">
                <div className="flex items-center justify-center">
                  <StatusIndicator status="online" showText={true} />
                </div>
              </div>
            </div>

            {/* 技能卡片 */}
            <div className="apple-card">
              <h3 className="text-title mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-500" />
                核心技能
              </h3>
              <div className="space-y-3">
                {userInfo?.profile_data?.skills?.programming_languages?.slice(0, 3).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-body">{skill.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < skill.level ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 經驗卡片 */}
            <div className="apple-card">
              <h3 className="text-title mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-500" />
                工作經驗
              </h3>
              {userInfo?.profile_data?.work_experience?.[0] && (
                <div>
                  <div className="font-medium text-gray-900">
                    {userInfo.profile_data.work_experience[0].position}
                  </div>
                  <div className="text-caption mb-2">
                    {userInfo.profile_data.work_experience[0].company}
                  </div>
                  <div className="text-caption">
                    {userInfo.profile_data.work_experience[0].duration}
                  </div>
                </div>
              )}
            </div>

            {/* 教育背景 */}
            <div className="apple-card">
              <h3 className="text-title mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-500" />
                教育背景
              </h3>
              {userInfo?.profile_data?.education?.[0] && (
                <div>
                  <div className="font-medium text-gray-900">
                    {userInfo.profile_data.education[0].degree}
                  </div>
                  <div className="text-caption mb-2">
                    {userInfo.profile_data.education[0].school}
                  </div>
                  <div className="text-caption">
                    {userInfo.profile_data.education[0].graduation_year}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側：對話介面 */}
          <div className="lg:col-span-2 flex flex-col">
            
            {/* 對話標題 */}
            <div className="apple-card mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  <h2 className="text-title">面試對話</h2>
                </div>
                <div className="text-caption">
                  Session: {sessionId?.slice(0, 8)}...
                </div>
              </div>
            </div>

            {/* 對話區域 */}
            <div className="apple-card flex-1 flex flex-col">
              
              {/* 訊息列表 */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-1">
                {messages.map((message, index) => renderMessage(message, index))}
                
                {/* 載入指示器 */}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* 快捷問題 */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <div className="text-caption mb-2">建議問題：</div>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 輸入區域 */}
              <div className="border-t divider pt-4">
                <div className="flex space-x-3">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="輸入您的問題..."
                    rows="2"
                    className="input-field resize-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="btn-primary flex items-center justify-center w-12 h-12 rounded-full p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-caption">
                    按 Enter 發送，Shift+Enter 換行
                  </div>
                  <div className="text-caption">
                    {inputValue.length}/500
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
