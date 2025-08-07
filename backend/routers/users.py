from fastapi import APIRouter, HTTPException
from typing import List
from models.profile import UserListResponse, CompleteProfile, CreateUserRequest, UpdateUserRequest
from services.user_service import user_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/", response_model=UserListResponse)
async def get_all_users():
    """獲取所有用戶列表"""
    try:
        users = user_service.get_all_users()
        return UserListResponse(users=users)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"獲取用戶列表失敗: {str(e)}")

@router.get("/{user_id}")
async def get_user(user_id: str):
    """獲取特定用戶詳細資料"""
    try:
        user = user_service.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"用戶 {user_id} 不存在")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"獲取用戶資料失敗: {str(e)}")

@router.post("/")
async def create_user(request: CreateUserRequest):
    """創建新用戶"""
    try:
        new_user = user_service.create_user(request.profile_data)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"創建用戶失敗: {str(e)}")

@router.put("/{user_id}")
async def update_user(user_id: str, request: UpdateUserRequest):
    """更新用戶資料"""
    try:
        updated_user = user_service.update_user(user_id, request.profile_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail=f"用戶 {user_id} 不存在")
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新用戶資料失敗: {str(e)}")
