# 數位分身面試助手 - 產品需求文檔 (PRD)

## 1. 產品概述

### 1.1 產品名稱
數位分身面試助手 (Digital Twin Interview Assistant)

### 1.2 產品願景
建立一個智能的LLM服務，能夠代表使用者回答面試問題，就像使用者的數位孿生一樣，展現個人特色和專業能力。

### 1.3 目標用戶
- **主要用戶**: 面試官
- **使用場景**: 面試官與求職者的數位分身進行面試對話

### 1.4 核心價值
- **數位分身體驗**: LLM 完全扮演求職者本人，以第一人稱回答問題
- **真實面試模擬**: 針對金融業IT、生成式AI應用相關職位的專業面試
- **個人化回應**: 基於真實履歷資料，提供準確的個人經歷回答
- **面試效率**: 讓面試官能夠快速了解候選人背景和能力

## 2. 技術架構

### 2.1 技術棧選擇

#### 前端
- **框架**: React 18+ (Vite)
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks + Context API
- **HTTP客戶端**: Axios
- **路由**: React Router
- **開發工具**: Vite (快速開發)

#### 後端
- **框架**: FastAPI (Python)
- **套件管理**: uv (現代 Python 套件管理工具)
- **AI/LLM**: OpenAI GPT-4 或本地LLM
- **資料存儲**: JSON 檔案 (簡化開發，適合 MVP)
- **Schema**: Pydantic models
- **設定管理**: pydantic-settings
- **API文檔**: FastAPI 自動生成

#### 資料庫方案選擇
**方案A: 純 JSON 檔案** (推薦給 MVP)
- 開發速度快，無需 Docker 設定
- 適合單一用戶場景
- RAG 功能使用 sentence-transformers + 記憶體向量搜索

**方案B: PostgreSQL + Docker** (完整版)
- 支援多用戶
- pgvector 提供更好的向量搜索
- 適合生產環境

#### RAG 系統 (推薦實現)
- **向量嵌入**: OpenAI Embeddings 或 Sentence Transformers
- **向量存儲**: PostgreSQL + pgvector
- **檢索策略**: 語義相似度搜索

### 2.2 系統架構圖

**方案A: JSON 檔案架構 (MVP 推薦)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  前端 (Vite)     │◄──►│ 後端 (FastAPI)   │◄──►│ JSON 檔案        │
│  React+Tailwind │    │   + Pydantic    │    │ + 記憶體向量     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   LLM Service   │
                       │ (OpenAI/Local)  │
                       └─────────────────┘
```

**方案B: PostgreSQL 架構 (完整版)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  前端 (Vite)     │◄──►│ 後端 (FastAPI)   │◄──►│ PostgreSQL      │
│  React+Tailwind │    │   + Pydantic    │    │ + pgvector      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   LLM Service   │
                       │ (OpenAI/Local)  │
                       └─────────────────┘
```

### 2.3 數位分身設計重點
- **完全角色扮演**: LLM 必須完全以求職者身份回答，不能透露自己是 AI
- **專業領域聚焦**: 針對金融業IT、生成式AI應用開發的專業問題
- **真實履歷基礎**: 所有回答必須基於預先輸入的真實履歷資料
- **個性一致性**: 維持回答風格和個人特質的一致性

## 3. 功能需求

### 3.1 核心功能

#### 3.1.1 履歷資料建立 (Dialog 式互動)
- **互動式履歷建立**
  - 透過對話方式逐步收集履歷資訊
  - 系統引導用戶完善個人資料
  - 支援修改和更新
  
- **完整履歷結構**
  - **基本資訊**: 姓名、聯絡方式、LinkedIn、個人網站
  - **職涯目標**: 期望職位、產業偏好、薪資期望
  - **工作經歷**: 
    - 公司名稱、職位、任職期間
    - 主要職責和成就 (量化指標)
    - 使用的技術棧和工具
  - **專案經歷**:
    - 專案名稱、規模、團隊大小
    - 個人角色和貢獻
    - 技術細節和解決方案
    - 專案成果和學習收穫
  - **技能清單**:
    - 程式語言 (Python, JavaScript, Java 等)
    - 框架和函式庫 (React, FastAPI, TensorFlow 等)
    - 資料庫技術 (PostgreSQL, MongoDB, Redis 等)
    - 雲端服務 (AWS, GCP, Azure)
    - AI/ML 相關 (LLM, RAG, Fine-tuning 等)
  - **教育背景**: 學歷、學校、主修、畢業年份、重要課程
  - **證照與認證**: 相關技術認證、語言能力
  - **個人特質**: 工作風格、價值觀、興趣愛好
  - **金融業相關**: 金融知識、法規了解、相關經驗

#### 3.1.2 面試聊天系統 (數位分身模式)
- **沉浸式面試體驗**
  - LLM 完全扮演求職者，以「我」的身份回答
  - 面試官開始對話即進入面試模式
  - 回答基於真實履歷資料，不編造虛假資訊
  
- **專業領域聚焦**
  - 金融業IT相關問題 (支付系統、風控系統、交易系統等)
  - 生成式AI應用開發 (LLM整合、RAG系統、提示工程等)
  - 技術深度問題 (系統設計、架構選擇、性能優化等)
  
- **智能對話管理**
  - 支援追問和深度探討
  - 維持對話連貫性
  - 適當的停頓和思考時間模擬

#### 3.1.3 面試問題管理
- **預設問題庫**
  - 基礎問題 (自我介紹、動機等)
  - 技術問題 (程式語言、架構設計等)
  - 行為問題 (團隊合作、問題解決等)
  
- **動態問題生成**
  - 基於個人檔案生成相關問題
  - 追問機制

### 3.2 進階功能

#### 3.2.1 RAG 增強回應
- **知識庫建立**
  - 個人經歷向量化
  - 技術知識庫
  - 行業標準回答範本
  
- **智能檢索**
  - 根據問題檢索相關個人經歷
  - 增強回應的準確性和個人化程度

#### 3.2.2 面試分析
- **回應品質評估**
  - 回答完整度
  - 技術準確性
  - 表達清晰度
  
- **改進建議**
  - 指出回答不足之處
  - 提供改進方向

#### 3.2.3 面試模式
- **練習模式**
  - 無壓力環境
  - 即時反饋
  
- **模擬模式**
  - 真實面試流程
  - 時間限制
  - 完整評估報告

## 4. 資料存儲設計

### 4.1 方案A: JSON 檔案存儲 (MVP 推薦)

```python
```python
# 履歷資料結構 (profile.json) - 基於郭懷德真實履歷
{
  "basic_info": {
    "name": "郭懷德",
    "email": "hwai-de.kuo@example.com",
    "phone": "+886-xxx-xxx-xxx",
    "linkedin": "https://linkedin.com/in/hwai-de-kuo",
    "github": "https://github.com/hwai-de-kuo",
    "location": "台北市"
  },
  "career_objective": {
    "target_position": "Senior AI/ML Engineer",
    "target_industry": "金融科技 / FinTech",
    "target_role_types": ["AI工程師", "機器學習工程師", "資料科學家"],
    "preferred_location": "台北市",
    "career_goals": "專注於金融業AI應用開發，特別是生成式AI和機器學習解決方案"
  },
  "work_experience": [
    {
      "company": "現任公司",
      "position": "AI/ML Engineer",
      "duration": "2023.XX - 現在",
      "responsibilities": [
        "開發金融業客服聊天機器人系統",
        "建置RAG系統處理複雜金融法規查詢",
        "優化機器學習模型效能和準確率"
      ],
      "technologies": ["Python", "TensorFlow", "PyTorch", "FastAPI", "Docker"],
      "achievements": [
        "提升客戶查詢回應準確率至95%",
        "減少人工處理時間60%"
      ]
    }
  ],
  "projects": [
    {
      "name": "金融智能客服系統",
      "description": "整合GPT-4的多輪對話客服系統",
      "role": "主要開發者",
      "team_size": 3,
      "duration": "6個月",
      "technologies": ["Python", "OpenAI API", "FastAPI", "PostgreSQL", "Redis"],
      "challenges": "處理複雜的金融產品查詢和合規要求",
      "solutions": "實作RAG架構結合知識圖譜",
      "results": "客戶滿意度提升40%，查詢解決率達90%"
    }
  ],
  "skills": {
    "programming_languages": [
      {"name": "Python", "level": 5, "years": 4},
      {"name": "JavaScript", "level": 4, "years": 3},
      {"name": "SQL", "level": 4, "years": 3}
    ],
    "ai_ml_frameworks": [
      {"name": "TensorFlow", "level": 4, "years": 2},
      {"name": "PyTorch", "level": 4, "years": 2},
      {"name": "scikit-learn", "level": 5, "years": 3},
      {"name": "OpenAI API", "level": 5, "years": 1.5}
    ],
    "backend_frameworks": [
      {"name": "FastAPI", "level": 5, "years": 2},
      {"name": "Django", "level": 4, "years": 2},
      {"name": "Flask", "level": 4, "years": 1.5}
    ],
    "databases": [
      {"name": "PostgreSQL", "level": 4, "years": 3},
      {"name": "Redis", "level": 4, "years": 2},
      {"name": "MongoDB", "level": 3, "years": 1}
    ],
    "cloud_devops": [
      {"name": "Docker", "level": 4, "years": 2},
      {"name": "AWS", "level": 3, "years": 1},
      {"name": "Kubernetes", "level": 3, "years": 1}
    ],
    "ai_specialties": [
      {"name": "RAG系統", "level": 5, "years": 1.5},
      {"name": "LLM Fine-tuning", "level": 4, "years": 1},
      {"name": "自然語言處理", "level": 4, "years": 2},
      {"name": "推薦系統", "level": 4, "years": 2}
    ],
    "finance_knowledge": [
      {"name": "金融產品知識", "level": 3, "years": 1},
      {"name": "風險控制", "level": 3, "years": 1},
      {"name": "法規遵循", "level": 3, "years": 1}
    ]
  },
  "education": [
    {
      "degree": "資訊工程學士/碩士",
      "school": "台灣知名大學",
      "graduation_year": 2021,
      "relevant_courses": ["機器學習", "深度學習", "資料結構與演算法", "軟體工程"]
    }
  ],
  "certifications": [
    "AWS Certified Developer",
    "Google Cloud Professional ML Engineer",
    "Microsoft Azure AI Engineer"
  ],
  "personality": {
    "work_style": "注重程式碼品質，遵循SOLID原則，喜歡團隊協作和知識分享",
    "values": "持續學習新技術，追求技術卓越，注重系統穩定性和可維護性",
    "interests": ["開源專案貢獻", "技術寫作", "AI研究", "金融科技趨勢"]
  },
  "languages": [
    {"language": "中文", "level": "母語"},
    {"language": "英文", "level": "商務溝通"}
  ]
}

# 多用戶支援結構 (profiles.json)
{
  "user_1": {
    "id": "1",
    "profile_data": { /* 郭懷德的完整履歷資料 */ },
    "created_at": "2025-08-07T10:00:00Z",
    "updated_at": "2025-08-07T10:00:00Z"
  },
  "user_2": {
    "id": "2", 
    "profile_data": { /* 其他用戶履歷資料 */ },
    "created_at": "2025-08-07T10:00:00Z",
    "updated_at": "2025-08-07T10:00:00Z"
  },
  "user_3": {
    "id": "3",
    "profile_data": { /* 其他用戶履歷資料 */ },
    "created_at": "2025-08-07T10:00:00Z", 
    "updated_at": "2025-08-07T10:00:00Z"
  }
}
```
  },
  "work_experience": [
    {
      "company": "現任公司",
      "position": "AI/ML Engineer",
      "duration": "2023.XX - 現在",
      "responsibilities": [
        "開發金融業客服聊天機器人系統",
        "建置RAG系統處理複雜金融法規查詢",
        "優化機器學習模型效能和準確率"
      ],
      "technologies": ["Python", "TensorFlow", "PyTorch", "FastAPI", "Docker"],
      "achievements": [
        "提升客戶查詢回應準確率至95%",
        "減少人工處理時間60%"
      ]
    }
  ],
  "projects": [
    {
      "name": "智能風控系統",
      "description": "使用機器學習偵測異常交易",
      "role": "主要開發者",
      "team_size": 4,
      "duration": "6個月",
      "technologies": ["Python", "scikit-learn", "Redis", "Docker"],
      "challenges": "處理即時大量交易數據",
      "solutions": "實作事件流處理和快取機制",
      "results": "偵測準確率提升25%"
    }
  ],
  "skills": {
    "programming_languages": [
      {"name": "Python", "level": 5, "years": 4},
      {"name": "JavaScript", "level": 4, "years": 3}
    ],
    "frameworks": [
      {"name": "FastAPI", "level": 5, "years": 2},
      {"name": "React", "level": 4, "years": 2}
    ],
    "ai_ml": [
      {"name": "OpenAI API", "level": 5, "years": 1},
      {"name": "RAG系統", "level": 4, "years": 1},
      {"name": "Fine-tuning", "level": 3, "years": 0.5}
    ],
    "finance_knowledge": [
      {"name": "支付系統", "level": 4, "years": 2},
      {"name": "風控概念", "level": 3, "years": 1}
    ]
  },
  "education": [
    {
      "degree": "資訊工程碩士",
      "school": "台灣大學",
      "graduation_year": 2020,
      "relevant_courses": ["機器學習", "資料庫系統", "軟體工程"]
    }
  ],
  "certifications": [
    "AWS Certified Developer",
    "TOEIC 900"
  ],
  "personality": {
    "work_style": "注重細節，喜歡團隊協作",
    "values": "持續學習，技術創新",
    "interests": ["開源專案", "技術部落格", "程式競賽"]
  }
}

# 對話記錄 (現存於記憶體，不持久化)
# 每次對話session都是獨立的，面試結束後即清除
```

### 4.2 RAG 功能實現 (JSON 版本)

```python
# 使用 sentence-transformers 進行向量化
# 將履歷內容分段並建立向量索引

# 向量資料結構 (vectors.json)
{
  "embeddings": [
    {
      "id": "exp_001",
      "content": "在XX銀行開發客服聊天機器人，使用Python和OpenAI API",
      "content_type": "work_experience",
      "embedding": [0.1, 0.2, ...], # 384維向量
      "source": "work_experience[0]"
    },
    {
      "id": "proj_001", 
      "content": "智能風控系統專案，使用機器學習偵測異常交易",
      "content_type": "project",
      "embedding": [0.3, 0.4, ...],
      "source": "projects[0]"
    }
  ]
}
```

## 5. API 設計 (簡化版)

### 5.1 個人檔案 API

```python
# 創建/更新個人檔案
POST /api/profile
{
    "name": "張小明",
    "profile_data": {
        "position_target": "Full Stack Developer",
        "summary": "3年全端開發經驗...",
        "skills": [...],
        "projects": [...],
        "work_style": "...",
        "values": "..."
    }
}

# 獲取個人檔案
GET /api/profile/{profile_id}
```

### 5.2 面試對話 API

```python
# 開始面試對話 (簡化版)
POST /api/interview/chat/{user_id}
{
    "message": "請先自我介紹一下"
}

# 繼續對話 (使用session管理)
POST /api/interview/chat/{user_id}
{
    "message": "你在金融業有什麼相關經驗？",
    "session_id": "session_abc123"  # optional, 維持對話上下文
}
```

### 5.3 用戶管理 API

```python
# 列出所有用戶
GET /api/users

# 獲取特定用戶資料
GET /api/users/{user_id}

# 更新用戶履歷資料  
PUT /api/users/{user_id}
{
    "profile_data": { /* 更新的履歷資料 */ }
}

# 創建新用戶 (user_id 自動遞增)
POST /api/users
{
    "profile_data": { /* 完整履歷資料 */ }
}
```

### 5.4 Pydantic Models (簡化設計)

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# 基礎資料模型
class ContactInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    phone: str = Field(..., min_length=10, max_length=20)
    linkedin: Optional[str] = Field(None, regex=r'^https://linkedin\.com/in/.+')
    github: Optional[str] = Field(None, regex=r'^https://github\.com/.+')
    location: str

class CareerObjective(BaseModel):
    target_position: str
    target_industry: str
    target_role_types: List[str]
    preferred_location: str
    career_goals: str

class Skill(BaseModel):
    name: str = Field(..., min_length=1)
    level: int = Field(..., ge=1, le=5)
    years: float = Field(..., ge=0)

class SkillCategory(BaseModel):
    """技能分類 - 易於擴展新技能類別"""
    programming_languages: List[Skill] = []
    ai_ml_frameworks: List[Skill] = []
    backend_frameworks: List[Skill] = []
    databases: List[Skill] = []
    cloud_devops: List[Skill] = []
    ai_specialties: List[Skill] = []
    finance_knowledge: List[Skill] = []

class WorkExperience(BaseModel):
    company: str
    position: str
    duration: str
    responsibilities: List[str]
    technologies: List[str]
    achievements: List[str]

class Project(BaseModel):
    name: str
    description: str
    role: str
    team_size: int = Field(..., ge=1)
    duration: str
    technologies: List[str]
    challenges: str
    solutions: str
    results: str

class Education(BaseModel):
    degree: str
    school: str
    graduation_year: int = Field(..., ge=1950, le=2030)
    relevant_courses: List[str]

class Language(BaseModel):
    language: str
    level: str

class Personality(BaseModel):
    work_style: str
    values: str
    interests: List[str]

# 聚合履歷資料
class CompleteProfile(BaseModel):
    """完整履歷檔案"""
    basic_info: ContactInfo
    career_objective: CareerObjective
    work_experience: List[WorkExperience]
    projects: List[Project]
    skills: SkillCategory
    education: List[Education]
    certifications: List[str]
    personality: Personality
    languages: List[Language]

class User(BaseModel):
    """用戶實體"""
    id: str = Field(..., min_length=1)
    profile_data: CompleteProfile
    created_at: datetime
    updated_at: datetime

class UserContainer(BaseModel):
    """多用戶容器 - 字典格式便於直接存取"""
    users: Dict[str, User] = {}  # key: user_id, value: User

# 面試對話相關
class InterviewMessage(BaseModel):
    role: str = Field(..., regex=r'^(interviewer|candidate)$')
    content: str = Field(..., min_length=1)
    timestamp: datetime = Field(default_factory=datetime.now)

class InterviewSession(BaseModel):
    session_id: str
    user_id: str
    messages: List[InterviewMessage] = []
    started_at: datetime = Field(default_factory=datetime.now)

# RAG 系統相關
class VectorEmbedding(BaseModel):
    id: str
    content: str
    content_type: str
    embedding: List[float]
    source: str
    metadata: Dict[str, Any] = {}

# API 請求/回應模型
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.now)

class UserListResponse(BaseModel):
    users: List[Dict[str, str]]  # [{"id": "1", "name": "郭懷德"}, ...]

class CreateUserRequest(BaseModel):
    profile_data: CompleteProfile

class UpdateUserRequest(BaseModel):
    profile_data: CompleteProfile
```

## 6. 前端頁面設計

### 6.1 頁面結構

```
/                     # 首頁 - 用戶選擇器
/profile/{user_id}    # 個人檔案管理 (user_id: 1, 2, 3...)
/interview/{user_id}  # 面試聊天介面
```

### 6.2 主要組件設計

#### 6.2.1 用戶選擇組件
```jsx
// UserSelector.jsx
const UserSelector = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data.users);
  };
  
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">選擇用戶進行面試</h2>
      <div className="space-y-2">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user.id)}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50"
          >
            <div className="font-semibold">用戶 {user.id}</div>
            <div className="text-gray-600">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### 6.2.2 聊天介面組件
```jsx
// InterviewChat.jsx - 簡化版
const InterviewChat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/interview/chat/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });
      
      const data = await response.json();
      
      // 添加面試官和候選人的訊息
      setMessages(prev => [
        ...prev,
        { role: 'interviewer', content: inputValue, timestamp: new Date() },
        { role: 'candidate', content: data.response, timestamp: new Date() }
      ]);
      
      setInputValue('');
    } catch (error) {
      console.error('發送訊息失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-xl font-semibold">面試用戶 {userId}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'interviewer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.role === 'interviewer' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white border-t p-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="輸入面試問題..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '...' : '發送'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 7. 實現計劃

### 7.1 MVP (最小可行產品) - 60分鐘

**第一階段 (20分鐘) - 環境建置**
- [x] 建立基本專案結構
- [ ] 設定 Docker PostgreSQL
- [ ] 建立 FastAPI 後端基礎
- [ ] 建立 Vite React 前端
- [ ] 設定 Pydantic models

**第二階段 (20分鐘) - 核心功能**
- [ ] 實現個人檔案 CRUD API
- [ ] 建立簡單的檔案輸入表單 (前端)
- [ ] 實現基本的聊天 API
- [ ] 整合 OpenAI API 調用

**第三階段 (20分鐘) - 整合測試**
- [ ] 前後端聯調
- [ ] 實現個人化回應邏輯
- [ ] 基本功能測試
- [ ] 準備 demo

### 7.2 完整版本 - 90分鐘

**第四階段 (15分鐘) - RAG 增強**
- [ ] 實現向量化存儲
- [ ] 加入 pgvector 檢索
- [ ] 優化 AI 回應品質

**第五階段 (15分鐘) - 最終優化**
- [ ] 美化前端 UI
- [ ] 加入錯誤處理
- [ ] 性能優化
- [ ] 最終測試與展示

### 7.3 專案結構建議

```
interview/
├── backend/
│   ├── main.py                    # FastAPI 主程式
│   ├── models.py                  # Pydantic models
│   ├── services/
│   │   ├── user_service.py        # 用戶管理
│   │   ├── interview_service.py   # 面試對話邏輯
│   │   ├── llm_service.py         # LLM 整合 (OpenAI)
│   │   └── rag_service.py         # RAG 向量搜索
│   ├── routers/
│   │   ├── users.py               # 用戶相關 API
│   │   └── interview.py           # 面試相關 API
│   ├── data/
│   │   ├── users.json             # 用戶履歷資料
│   │   └── vectors.json           # 向量資料
│   ├── .env                       # 環境變數
│   ├── pyproject.toml             # uv 專案設定
│   └── uv.lock                    # 鎖定版本
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserSelector.jsx   # 用戶選擇器
│   │   │   ├── ProfileForm.jsx    # 履歷表單
│   │   │   ├── InterviewChat.jsx  # 面試聊天介面
│   │   │   └── MessageBubble.jsx  # 訊息氣泡
│   │   ├── pages/
│   │   │   ├── Home.jsx           # 首頁 - 用戶選擇
│   │   │   ├── Profile.jsx        # 履歷管理頁面
│   │   │   └── Interview.jsx      # 面試頁面
│   │   ├── services/
│   │   │   └── api.js             # API 調用
│   │   ├── hooks/
│   │   │   └── useUser.js         # 用戶狀態管理
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── PRD.md
└── README.md
```

### 7.4 uv 套件管理指令

```bash
# 初始化專案
cd backend
uv init

# 新增主要套件
uv add fastapi uvicorn
uv add openai
uv add pydantic pydantic-settings
uv add sentence-transformers  # for RAG
uv add numpy scikit-learn     # for vector operations

# 執行專案
uv run uvicorn main:app --reload
```

## 8. 技術風險與應對 (簡化版)

### 8.1 主要風險
1. **時間限制** - 90分鐘內完成所有功能
2. **LLM回應一致性** - 確保AI以第一人稱回答
3. **Docker 環境** - PostgreSQL + pgvector 設定
4. **前後端整合** - API 串接問題

### 8.2 應對策略
1. **優先順序明確** - 先實現核心功能，再加強功能
2. **簡化設計** - 使用 JSONB 減少複雜關聯
3. **Docker Compose** - 一鍵啟動資料庫環境
4. **預先測試** - 確保 OpenAI API 可用

### 8.3 開發環境需求

```bash
# 後端環境 (uv 管理)
- Python 3.11+
- uv (Python 套件管理工具)
- FastAPI + uvicorn
- OpenAI API
- sentence-transformers (for RAG)
- pydantic + pydantic-settings

# 前端環境  
- Node.js 18+
- Vite
- React 18
- Tailwind CSS
- Axios

# JSON 檔案存儲
- 無需 Docker 或資料庫設定
- 本地檔案系統即可
- 支援 RAG 功能 (記憶體向量搜索)
```

### 8.4 JSON vs PostgreSQL 比較

| 功能 | JSON 檔案 | PostgreSQL |
|------|-----------|------------|
| 開發速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 設定複雜度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| RAG 支援 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 多用戶支援 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 查詢效能 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 適用場景 | MVP/Demo | 生產環境 |

**建議**: 先用 JSON 檔案快速實現 MVP，後續可升級到 PostgreSQL

## 9. 成功指標

### 9.1 技術指標
- API回應時間 < 2秒
- 系統可用性 > 99%
- 回應準確率 > 85%

### 9.2 用戶體驗指標
- 對話流暢度評分 > 4/5
- 個人化程度評分 > 4/5
- 整體滿意度 > 4/5

## 10. 未來擴展

### 10.1 短期規劃
- 語音輸入/輸出功能
- 多語言支援
- 面試視頻分析

### 10.2 長期規劃
- 企業版本 (支援多候選人管理)
- AI面試官功能
- 深度學習個人化模型

---

**文檔版本**: v1.0
**最後更新**: 2025-08-07
**負責人**: GitHub Copilot
