# 數位分身面試助手 (Digital Twin Interview Assistant)

一個基於 AI 的面試練習系統，使用用戶個人資料創建數位分身，提供個性化的面試問答體驗。

## ✨ 功能特色

- 🤖 **AI 驅動對話**：使用 OpenAI GPT 模型進行智能對話
- 🎯 **個人化回答**：基於用戶個人資料和經歷提供客製化回答
- 🔍 **RAG 技術**：使用檢索增強生成技術提高回答準確性
- 📊 **即時反饋**：提供面試表現分析和改進建議
- 💻 **全端解決方案**：包含前端 UI 和後端 API

## 🏗️ 技術架構

### 後端 (Backend)
- **FastAPI**: 高性能 Python Web 框架
- **OpenAI API**: GPT 模型和 Embedding 服務
- **RAG 系統**: 使用向量相似度檢索相關資料
- **Pydantic**: 數據驗證和序列化

### 前端 (Frontend)
- **React + Vite**: 現代化前端開發環境
- **Tailwind CSS**: 實用優先的 CSS 框架
- **響應式設計**: 支援桌面和行動裝置

## 🚀 快速開始

### 前置需求

- Python 3.8+
- Node.js 16+
- OpenAI API Key
- uv 

### 完整安裝步驟

#### 1. 複製專案
```bash
git clone <your-repo-url>
cd interview
```

#### 2. 後端環境設置

**創建虛擬環境和安裝依賴：**
```bash
cd backend
uv venv                    # 創建虛擬環境
.\venv\Scripts\activate    # Windows 激活環境
# 或 source venv/bin/activate  # Linux/Mac 激活環境
uv sync                    # 安裝所有依賴
```

**設置環境變數：**
```bash
# 從專案根目錄複製環境變數模板
copy .env.example backend\.env    # Windows
# 或 cp .env.example backend/.env  # Linux/Mac

# 編輯 backend/.env 文件，填入你的 OpenAI API Key：
# OPENAI_API_KEY=your_actual_api_key_here
# OPENAI_MODEL=gpt-4.1-mini
```

**準備個人資料（可選）：**
```bash
# 如果要使用自己的資料，編輯以下文件：
# backend/data/users.json - 填入你的個人資料
# 如果使用示例資料，可以跳過此步驟
```

**初始化 Embeddings：**
```bash
python init_embeddings.py
# 成功時會顯示：
# ✓ 用戶 1 的embedding已生成
# 所有用戶的embedding初始化完成！
```

**啟動後端服務：**
```bash
python main.py
# 服務將運行在 http://localhost:8001
# 看到 "正在啟動數位分身面試助手..." 表示啟動成功
```

#### 3. 前端環境設置

**開啟新的終端機，安裝前端依賴：**
```bash
cd frontend
npm install               # 安裝前端依賴
```

**啟動前端服務：**
```bash
npm run dev
# 應用將運行在 http://localhost:5173
# 或 http://localhost:3000（取決於設定）
```

#### 4. 訪問應用

打開瀏覽器訪問 `http://localhost:5173`，開始使用數位分身面試助手！

### 故障排除

**常見問題：**

1. **OpenAI API 錯誤**
   - 確認 `.env` 文件在 `backend/` 目錄中
   - 確認 API Key 正確且有效
   - 檢查 API Key 有足夠的餘額

2. **找不到模組錯誤**
   - 確認已激活虛擬環境
   - 運行 `uv sync` 重新安裝依賴

3. **端口被佔用**
   - 後端預設端口：8001
   - 前端預設端口：5173
   - 如需修改，請編輯對應的配置文件

4. **Embedding 初始化失敗**
   - 確認網路連接正常
   - 確認 OpenAI API Key 有效

## 📝 使用方法

### 1. 自定義個人資料（可選）

如果要使用自己的個人資料而非示例資料：

```bash
# 編輯用戶資料
# backend/data/users.json - 按照示例格式填入你的個人資料

# 重新生成 Embeddings
cd backend
python init_embeddings.py
```

### 2. 開始面試

1. 訪問前端應用 `http://localhost:5173`
2. 選擇用戶（預設為示例用戶）
3. 開始面試對話
4. AI 會根據你的個人資料提供個性化的面試問答

### 3. API 測試

後端 API 文檔可在以下位置訪問：
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## 📁 專案結構

```
interview/
├── backend/                 # 後端 FastAPI 應用
│   ├── main.py             # FastAPI 應用主文件
│   ├── config.py           # 配置設定和環境變數
│   ├── init_embeddings.py  # Embedding 初始化腳本
│   ├── pyproject.toml      # Python 專案配置（uv）
│   ├── uv.lock            # 依賴版本鎖定文件
│   ├── .env               # 環境變數（不會提交到 Git）
│   ├── models/            # Pydantic 資料模型
│   │   ├── __init__.py
│   │   └── profile.py     # 用戶資料模型
│   ├── routers/           # FastAPI 路由
│   │   ├── __init__.py
│   │   ├── users.py       # 用戶相關 API
│   │   └── interview.py   # 面試對話 API
│   ├── services/          # 業務邏輯服務層
│   │   ├── __init__.py
│   │   ├── user_service.py        # 用戶服務
│   │   ├── embedding_service.py   # 向量嵌入服務
│   │   ├── interview_service.py   # 面試邏輯服務
│   │   └── llm_service.py         # LLM 整合服務
│   ├── data/              # 數據文件（不會提交到 Git）
│   │   ├── users.json     # 用戶個人資料
│   │   └── vectors.json   # 用戶資料的向量表示
│   └── venv/              # Python 虛擬環境
├── frontend/              # 前端 React 應用
│   ├── src/
│   │   ├── App.jsx        # 主應用組件
│   │   ├── main.jsx       # 應用入口點
│   │   ├── index.css      # 全域樣式
│   │   ├── components/    # 可重用組件
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── StatusIndicator.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/         # 頁面組件
│   │   │   ├── Home.jsx   # 首頁
│   │   │   ├── Profile.jsx # 個人資料頁面
│   │   │   └── Interview.jsx # 面試頁面
│   │   └── services/      # API 服務
│   │       └── api.js     # API 呼叫邏輯
│   ├── index.html         # HTML 模板
│   ├── package.json       # Node.js 依賴配置
│   ├── vite.config.js     # Vite 建置配置
│   ├── tailwind.config.js # Tailwind CSS 配置
│   ├── postcss.config.js  # PostCSS 配置
│   └── node_modules/      # Node.js 依賴
├── .env.example           # 環境變數範例文件
├── .gitignore            # Git 忽略文件配置
├── README.md             # 專案說明文檔
└── PRD.md                # 產品需求文檔
```

## ⚙️ 配置說明

### 環境變數

在 `backend/.env` 文件中配置以下變數：

| 變數名 | 說明 | 預設值 | 必填 |
|--------|------|--------|------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 | - | ✅ |
| `OPENAI_MODEL` | 使用的 GPT 模型 | `gpt-4.1-mini` | ❌ |
| `OPENAI_TEMPERATURE` | 回答創造性程度 (0.0-2.0) | `0.7` | ❌ |
| `OPENAI_MAX_TOKENS` | 最大回答長度 | `2000` | ❌ |
| `USERS_DATA_FILE` | 用戶資料文件路徑 | `data/users.json` | ❌ |
| `VECTORS_DATA_FILE` | 向量資料文件路徑 | `data/vectors.json` | ❌ |
| `DEFAULT_USER_ID` | 預設用戶 ID | `1` | ❌ |

### 用戶資料格式

用戶資料儲存在 `backend/data/users.json` 中，包含以下主要部分：
- **基本資訊**：姓名、聯繫方式、職位目標
- **工作經歷**：公司名稱、職位、工作內容、時間期間
- **專案經歷**：專案名稱、技術棧、角色、成果
- **技能清單**：程式語言、框架、工具、軟技能
- **教育背景**：學校、科系、學位、時間
- **個人特質**：性格特點、工作風格、價值觀

詳細格式請參考現有的示例資料。

### 技術配置

- **後端端口**：8001 (可在 `main.py` 中修改)
- **前端端口**：5173 (Vite 預設，可在 `vite.config.js` 中修改)
- **CORS 設定**：已設定允許來自前端的跨域請求
- **向量維度**：使用 OpenAI text-embedding-ada-002 模型 (1536 維)

## 🔒 隱私保護

- 個人敏感資料（`users.json`, `vectors.json`）已加入 `.gitignore`
- 個人照片和敏感文件不會被提交
- 建議在部署時使用環境變數管理敏感配置

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

本專案採用 MIT 授權條款。

## 🏆 面試作品說明

這是一個在 1.5 小時內完成的 Vibe Coding 面試作品，展示了：

- **全端開發能力**：獨立完成前後端開發
- **AI 整合經驗**：實作 RAG 系統和 OpenAI API 整合
- **快速原型開發**：短時間內實現完整功能
- **現代化技術棧**：使用當前主流的開發工具和框架

### 技術亮點

1. **RAG 系統實作**：使用向量相似度進行個人資料檢索
2. **模組化架構**：清晰的服務層和路由層分離
3. **類型安全**：使用 Pydantic 進行數據驗證
4. **響應式前端**：現代化的 React + Tailwind CSS 界面
5. **API 設計**：RESTful API 設計規範