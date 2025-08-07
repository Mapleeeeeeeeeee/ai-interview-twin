import React, { useState, useEffect, useRef } from 'react';
import { User, Bot, Send, MessageCircle, Code, Briefcase, GraduationCap, MapPin, Mail, Phone, Star, Github, Linkedin, ExternalLink } from 'lucide-react';
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
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'} fade-in`}>
        <div className={`flex items-start max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 頭像 */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            } shadow-lg`}>
              {isUser ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          
          {/* 訊息內容 */}
          <div className={isUser ? 'message-user' : 'message-assistant'}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
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
        <div className="modern-card">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-3 border-blue-400/30 border-t-blue-400 rounded-full mr-4"></div>
            <span className="text-body text-white">正在初始化面試環境...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-3rem)]">
          
          {/* 左側：個人資訊卡片 */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 主要資訊卡片 */}
            <div className="modern-card slide-up">
              <div className="text-center mb-8">
                <div className="avatar-gradient mb-6 float">
                  <User className="w-14 h-14 text-white" />
                </div>
                <h1 className="text-headline mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {userInfo?.profile_data?.basic_info?.name || '候選人'}
                </h1>
                <p className="text-body text-lg font-medium">
                  {userInfo?.profile_data?.career_objective?.target_position || 'AI/ML 工程師'}
                </p>
                
                {/* 社交媒體連結 */}
                <div className="flex justify-center space-x-4 mt-6">
                  {userInfo?.profile_data?.basic_info?.linkedin && (
                    <a 
                      href={userInfo.profile_data.basic_info.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-blue-600 hover:text-blue-700"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {userInfo?.profile_data?.basic_info?.github && (
                    <a 
                      href={userInfo.profile_data.basic_info.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-gray-800 hover:text-gray-900"
                      title="GitHub Profile"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {userInfo?.profile_data?.basic_info?.website && (
                    <a 
                      href={userInfo.profile_data.basic_info.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-gray-600 hover:text-gray-700"
                      title="Personal Website"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  )}
                  
                  {/* 如果沒有社交媒體連結，顯示預設圖標 */}
                  {!userInfo?.profile_data?.basic_info?.linkedin && !userInfo?.profile_data?.basic_info?.github && !userInfo?.profile_data?.basic_info?.website && (
                    <>
                      <div className="social-icon text-blue-600/50" title="LinkedIn (未設定)">
                        <Linkedin className="w-6 h-6" />
                      </div>
                      <div className="social-icon text-gray-800/50" title="GitHub (未設定)">
                        <Github className="w-6 h-6" />
                      </div>
                      <div className="social-icon text-gray-600/50" title="個人網站 (未設定)">
                        <ExternalLink className="w-6 h-6" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 聯絡資訊 */}
              <div className="space-y-4 mb-8">
                {userInfo?.profile_data?.basic_info?.email && (
                  <div className="flex items-center text-caption bg-gray-50/50 rounded-xl p-3">
                    <Mail className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="text-gray-700">{userInfo.profile_data.basic_info.email}</span>
                  </div>
                )}
                {userInfo?.profile_data?.basic_info?.phone && (
                  <div className="flex items-center text-caption bg-gray-50/50 rounded-xl p-3">
                    <Phone className="w-5 h-5 mr-3 text-green-500" />
                    <span className="text-gray-700">{userInfo.profile_data.basic_info.phone}</span>
                  </div>
                )}
                {userInfo?.profile_data?.basic_info?.location && (
                  <div className="flex items-center text-caption bg-gray-50/50 rounded-xl p-3">
                    <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    <span className="text-gray-700">{userInfo.profile_data.basic_info.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center">
                  <StatusIndicator status="online" showText={true} />
                </div>
              </div>
            </div>

            {/* 技能卡片 */}
            <div className="modern-card">
              <h3 className="text-title mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Code className="w-4 h-4 text-white" />
                </div>
                核心技能
              </h3>
              <div className="space-y-4">
                {userInfo?.profile_data?.skills?.programming_languages?.slice(0, 3).map((skill, index) => (
                  <div key={index} className="bg-gray-50/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body font-medium">{skill.name}</span>
                      <span className="text-caption bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                        {skill.years}年
                      </span>
                    </div>
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

            {/* 專案經驗卡片 */}
            <div className="modern-card">
              <h3 className="text-title mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                專案經驗
              </h3>
              {userInfo?.profile_data?.projects?.[0] && (
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="font-semibold text-gray-900 mb-2">
                    {userInfo.profile_data.projects[0].name}
                  </div>
                  <div className="text-caption text-gray-600 mb-3">
                    {userInfo.profile_data.projects[0].description}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userInfo.profile_data.projects[0].technologies?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="skill-pill text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 教育背景 */}
            <div className="modern-card">
              <h3 className="text-title mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                教育背景
              </h3>
              {userInfo?.profile_data?.education?.[0] && (
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    {userInfo.profile_data.education[0].degree}
                  </div>
                  <div className="text-caption text-gray-600 mb-2">
                    {userInfo.profile_data.education[0].school}
                  </div>
                  <div className="text-caption text-blue-600 font-medium">
                    {userInfo.profile_data.education[0].graduation_year}年
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側：對話介面 */}
          <div className="lg:col-span-2 flex flex-col">
            
            {/* 對話標題 */}
            <div className="modern-card mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-title">面試對話</h2>
                    <p className="text-caption">與AI數位分身互動</p>
                  </div>
                </div>
                <div className="text-caption bg-gray-100 px-3 py-1 rounded-lg">
                  Session: {sessionId?.slice(0, 8)}...
                </div>
              </div>
            </div>

            {/* 對話區域 */}
            <div className="modern-card flex-1 flex flex-col">
              
              {/* 訊息列表 */}
              <div className="flex-1 overflow-y-auto mb-6 space-y-1 pr-2">
                {messages.map((message, index) => renderMessage(message, index))}
                
                {/* 載入指示器 */}
                {isLoading && (
                  <div className="flex justify-start mb-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="message-assistant">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* 快捷問題 */}
              {messages.length <= 1 && (
                <div className="mb-6">
                  <div className="text-caption mb-3 text-gray-600">建議問題：</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-2xl text-sm text-gray-700 hover:text-blue-700 transition-all duration-300 border border-gray-200 hover:border-blue-200 text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 輸入區域 */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex space-x-4">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="輸入您的問題..."
                    rows="3"
                    className="modern-input resize-none flex-1"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="btn-primary-modern flex items-center justify-center w-14 h-14 rounded-2xl p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-caption text-gray-500">
                    按 Enter 發送，Shift+Enter 換行
                  </div>
                  <div className="text-caption text-gray-500">
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
