from typing import Dict, List, Optional
from datetime import datetime
import uuid
from models.profile import InterviewSession, InterviewMessage
from services.user_service import user_service
from services.llm_service import llm_service

class InterviewService:
    def __init__(self):
        # 使用記憶體存儲對話session (不持久化)
        self.sessions: Dict[str, InterviewSession] = {}
    
    def start_interview(self, user_id: str) -> str:
        """開始面試，返回session_id"""
        user = user_service.get_user(user_id)
        if not user:
            raise ValueError(f"用戶 {user_id} 不存在")
        
        session_id = str(uuid.uuid4())
        session = InterviewSession(
            session_id=session_id,
            user_id=user_id,
            messages=[],
            started_at=datetime.now()
        )
        
        self.sessions[session_id] = session
        return session_id
    
    def get_session(self, session_id: str) -> Optional[InterviewSession]:
        """獲取面試session"""
        return self.sessions.get(session_id)
    
    def add_message(self, session_id: str, role: str, content: str) -> bool:
        """加入訊息到session"""
        session = self.sessions.get(session_id)
        if not session:
            return False
        
        message = InterviewMessage(
            role=role,
            content=content,
            timestamp=datetime.now()
        )
        session.messages.append(message)
        return True
    
    def generate_interview_response(self, user_id: str, message: str, session_id: Optional[str] = None) -> Dict:
        """生成面試回應"""
        # 獲取用戶資料
        user = user_service.get_user(user_id)
        if not user:
            raise ValueError(f"用戶 {user_id} 不存在")
        
        # 處理session
        if not session_id:
            session_id = self.start_interview(user_id)
        
        session = self.get_session(session_id)
        if not session:
            session_id = self.start_interview(user_id)
            session = self.get_session(session_id)
        
        # 加入面試官問題
        self.add_message(session_id, "interviewer", message)
        
        # 準備對話歷史給LLM
        conversation_history = []
        for msg in session.messages[:-1]:  # 排除剛加入的當前問題
            role = "user" if msg.role == "interviewer" else "assistant"
            conversation_history.append({
                "role": role,
                "content": msg.content
            })
        
        # 生成回應
        response = llm_service.generate_response(
            user=user,
            message=message,
            conversation_history=conversation_history
        )
        
        # 加入AI回應
        self.add_message(session_id, "candidate", response)
        
        return {
            "response": response,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_conversation_history(self, session_id: str) -> List[Dict]:
        """獲取對話歷史"""
        session = self.get_session(session_id)
        if not session:
            return []
        
        return [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in session.messages
        ]
    
    def clear_session(self, session_id: str) -> bool:
        """清除面試session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False

# 全局面試服務實例
interview_service = InterviewService()
