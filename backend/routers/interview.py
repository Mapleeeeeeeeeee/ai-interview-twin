from fastapi import APIRouter, HTTPException
from models.profile import ChatRequest, ChatResponse
from services.interview_service import interview_service

router = APIRouter(prefix="/api/interview", tags=["interview"])

@router.post("/chat/{user_id}", response_model=ChatResponse)
async def chat_with_candidate(user_id: str, request: ChatRequest):
    """與候選人進行面試對話"""
    try:
        result = interview_service.generate_interview_response(
            user_id=user_id,
            message=request.message,
            session_id=request.session_id
        )
        
        return ChatResponse(
            response=result["response"],
            session_id=result["session_id"],
            timestamp=result["timestamp"]
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"面試對話失敗: {str(e)}")

@router.get("/session/{session_id}/history")
async def get_conversation_history(session_id: str):
    """獲取對話歷史"""
    try:
        history = interview_service.get_conversation_history(session_id)
        if not history:
            raise HTTPException(status_code=404, detail=f"Session {session_id} 不存在")
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"獲取對話歷史失敗: {str(e)}")

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """清除面試session"""
    try:
        success = interview_service.clear_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Session {session_id} 不存在")
        return {"message": "Session已清除"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"清除session失敗: {str(e)}")

@router.post("/start/{user_id}")
async def start_interview(user_id: str):
    """開始面試，返回session_id"""
    try:
        session_id = interview_service.start_interview(user_id)
        return {"session_id": session_id, "message": f"已為用戶 {user_id} 開始面試"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"開始面試失敗: {str(e)}")
