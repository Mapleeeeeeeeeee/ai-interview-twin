from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, interview
from config import settings

app = FastAPI(
    title="數位分身面試助手",
    description="Digital Twin Interview Assistant API",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite 默認端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊路由
app.include_router(users.router)
app.include_router(interview.router)

@app.get("/")
async def root():
    return {
        "message": "數位分身面試助手 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "interview-api"}

if __name__ == "__main__":
    import uvicorn
    print("正在啟動數位分身面試助手...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
