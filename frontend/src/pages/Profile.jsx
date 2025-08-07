import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Save, Edit3 } from 'lucide-react';
import { userAPI } from '../services/api';
import Toast from '../components/Toast';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (userId && userId !== 'new') {
      fetchUserInfo();
    } else {
      setLoading(false);
      setEditMode(true);
      // 初始化空的用戶資料結構
      setUserInfo({
        profile_data: {
          basic_info: {
            name: '',
            email: '',
            phone: '',
            location: '台北市'
          },
          career_objective: {
            target_position: '',
            target_industry: '金融科技',
            career_goals: ''
          },
          personality: {
            work_style: '',
            values: '',
            interests: []
          }
        }
      });
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const user = await userAPI.getUser(userId);
      setUserInfo(user);
    } catch (err) {
      setToast({ type: 'error', message: '無法載入用戶資料' });
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (userId === 'new') {
        const newUser = await userAPI.createUser(userInfo.profile_data);
        setToast({ type: 'success', message: '候選人資料已成功創建！' });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        await userAPI.updateUser(userId, userInfo.profile_data);
        setEditMode(false);
        setToast({ type: 'success', message: '資料已成功更新！' });
      }
      
    } catch (err) {
      setToast({ type: 'error', message: '保存失敗，請稍後再試' });
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    setUserInfo(prev => {
      const newInfo = { ...prev };
      const keys = path.split('.');
      let current = newInfo;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newInfo;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="apple-card">
          <div className="flex items-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
            <span className="text-body">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  const basicInfo = userInfo?.profile_data?.basic_info || {};
  const careerObjective = userInfo?.profile_data?.career_objective || {};
  const personality = userInfo?.profile_data?.personality || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Toast 訊息 */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* 標題區域 */}
        <div className="apple-card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus-ring"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-headline">
                    {userId === 'new' ? '新增候選人' : '編輯資料'}
                  </h1>
                  <p className="text-body">管理候選人基本資訊</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!editMode && userId !== 'new' && (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-secondary flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  編輯
                </button>
              )}
              
              {editMode && (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn-secondary"
                    disabled={saving}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '保存中...' : '保存'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 表單內容 */}
        <div className="space-y-6">
          
          {/* 基本資訊 */}
          <div className="apple-card">
            <h2 className="text-title mb-6">基本資訊</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-caption font-medium mb-2">姓名 *</label>
                {editMode ? (
                  <input
                    type="text"
                    value={basicInfo.name || ''}
                    onChange={(e) => updateField('profile_data.basic_info.name', e.target.value)}
                    className="input-field"
                    placeholder="請輸入姓名"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {basicInfo.name || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">Email *</label>
                {editMode ? (
                  <input
                    type="email"
                    value={basicInfo.email || ''}
                    onChange={(e) => updateField('profile_data.basic_info.email', e.target.value)}
                    className="input-field"
                    placeholder="example@email.com"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {basicInfo.email || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">電話</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={basicInfo.phone || ''}
                    onChange={(e) => updateField('profile_data.basic_info.phone', e.target.value)}
                    className="input-field"
                    placeholder="+886 912 345 678"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {basicInfo.phone || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">地點</label>
                {editMode ? (
                  <input
                    type="text"
                    value={basicInfo.location || ''}
                    onChange={(e) => updateField('profile_data.basic_info.location', e.target.value)}
                    className="input-field"
                    placeholder="台北市"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {basicInfo.location || '未設定'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 職涯目標 */}
          <div className="apple-card">
            <h2 className="text-title mb-6">職涯目標</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-caption font-medium mb-2">目標職位</label>
                {editMode ? (
                  <input
                    type="text"
                    value={careerObjective.target_position || ''}
                    onChange={(e) => updateField('profile_data.career_objective.target_position', e.target.value)}
                    className="input-field"
                    placeholder="例：Senior AI Engineer"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {careerObjective.target_position || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">目標產業</label>
                {editMode ? (
                  <input
                    type="text"
                    value={careerObjective.target_industry || ''}
                    onChange={(e) => updateField('profile_data.career_objective.target_industry', e.target.value)}
                    className="input-field"
                    placeholder="例：金融科技"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {careerObjective.target_industry || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">職涯目標</label>
                {editMode ? (
                  <textarea
                    value={careerObjective.career_goals || ''}
                    onChange={(e) => updateField('profile_data.career_objective.career_goals', e.target.value)}
                    rows="4"
                    className="input-field resize-none"
                    placeholder="描述您的職涯目標和期望..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                    {careerObjective.career_goals || '未設定'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 個人特質 */}
          <div className="apple-card">
            <h2 className="text-title mb-6">個人特質</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-caption font-medium mb-2">工作風格</label>
                {editMode ? (
                  <textarea
                    value={personality.work_style || ''}
                    onChange={(e) => updateField('profile_data.personality.work_style', e.target.value)}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="描述您的工作風格和方式..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                    {personality.work_style || '未設定'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-caption font-medium mb-2">價值觀</label>
                {editMode ? (
                  <textarea
                    value={personality.values || ''}
                    onChange={(e) => updateField('profile_data.personality.values', e.target.value)}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="描述您的價值觀和信念..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                    {personality.values || '未設定'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-center space-x-4 pt-6">
            {!editMode && userId !== 'new' && (
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                開始面試
              </button>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
