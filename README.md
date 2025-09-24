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

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <your-repo-url>
   cd interview
   ```

2. **設定環境變數**
   ```bash
   cp .env.example .env
   # 編輯 .env 文件，填入你的 OpenAI API Key
   ```

3. **後端設定**
   ```bash
   cd backend
   # 安裝依賴 (建議使用 uv)
   uv install
   
   # 或使用 pip
   pip install -r requirements.txt
   ```

4. **前端設定**
   ```bash
   cd frontend
   npm install
   ```

### 運行應用程式

1. **啟動後端服務**
   ```bash
   cd backend
   uv run main.py
   # 服務將運行在 http://localhost:8001
   ```

2. **啟動前端服務**
   ```bash
   cd frontend
   npm run dev
   # 應用將運行在 http://localhost:5173
   ```

## 📝 使用方法

### 1. 創建用戶資料

複製示例文件並自定義：
```bash
cp backend/data/users.example.json backend/data/users.json
cp backend/data/vectors.example.json backend/data/vectors.json
```

編輯 `backend/data/users.json` 填入你的個人資料。

### 2. 初始化 Embedding

為用戶資料生成向量表示：
```bash
cd backend
python init_embeddings.py
```

### 3. 開始面試

訪問前端應用，選擇用戶並開始面試對話。

## 📁 專案結構

```
interview/
├── backend/
│   ├── main.py              # FastAPI 應用主文件
│   ├── config.py            # 配置設定
│   ├── init_embeddings.py   # Embedding 初始化腳本
│   ├── models/              # Pydantic 模型
│   ├── routers/             # API 路由
│   ├── services/            # 業務邏輯服務
│   └── data/                # 數據文件 (不會提交到 Git)
├── frontend/
│   ├── src/
│   │   ├── components/      # React 組件
│   │   ├── pages/           # 頁面組件
│   │   └── services/        # API 服務
│   ├── index.html
│   └── vite.config.js
├── .env.example             # 環境變數示例
├── .gitignore
└── README.md
```

## ⚙️ 配置說明

### 環境變數

| 變數名 | 說明 | 必填 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 | ✅ |
| `OPENAI_MODEL` | 使用的 GPT 模型 | ❌ (預設: gpt-4) |
| `OPENAI_TEMPERATURE` | 回答創造性程度 | ❌ (預設: 0.7) |
| `OPENAI_MAX_TOKENS` | 最大回答長度 | ❌ (預設: 2000) |

### 用戶資料格式

用戶資料包含以下主要部分：
- 基本資訊（姓名、聯繫方式）
- 職業目標
- 工作經歷
- 專案經歷
- 技能清單
- 教育背景
- 個人特質

詳細格式請參考 `backend/data/users.example.json`。

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