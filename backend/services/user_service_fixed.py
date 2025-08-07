import json
import os
from datetime import datetime
from typing import Dict, List, Optional
from models.profile import User, CompleteProfile, UserContainer

class UserService:
    def __init__(self, users_file: str = "data/users.json"):
        self.users_file = users_file
        self._ensure_data_dir()
        self._load_users()
    
    def _ensure_data_dir(self):
        """確保data目錄存在"""
        os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
    
    def _load_users(self):
        """從JSON文件載入用戶資料"""
        try:
            if os.path.exists(self.users_file):
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # 手動處理datetime字符串轉換
                    for user_id, user_data in data.get("users", {}).items():
                        if "created_at" in user_data and isinstance(user_data["created_at"], str):
                            user_data["created_at"] = datetime.fromisoformat(user_data["created_at"])
                        if "updated_at" in user_data and isinstance(user_data["updated_at"], str):
                            user_data["updated_at"] = datetime.fromisoformat(user_data["updated_at"])
                    self.users_container = UserContainer(**data)
            else:
                self.users_container = UserContainer()
                self._create_demo_user()
        except Exception as e:
            print(f"載入用戶資料失敗: {e}")
            self.users_container = UserContainer()
            self._create_demo_user()
    
    def _save_users(self):
        """儲存用戶資料到JSON文件"""
        try:
            with open(self.users_file, 'w', encoding='utf-8') as f:
                # 使用model_dump()來處理datetime序列化
                data = self.users_container.model_dump(mode='json')
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"儲存用戶資料失敗: {e}")
    
    def _create_demo_user(self):
        """建立示範用戶資料 - 如果需要的話"""
        # 由於已經有手動建立的users.json，這裡可以留空
        # 或者在沒有users.json時創建一個基本用戶
        pass
    
    def get_all_users(self) -> List[Dict[str, str]]:
        """獲取所有用戶列表"""
        return [
            {"id": user_id, "name": user.profile_data.basic_info.name}
            for user_id, user in self.users_container.users.items()
        ]
    
    def get_user(self, user_id: str) -> Optional[User]:
        """獲取特定用戶"""
        return self.users_container.users.get(user_id)
    
    def create_user(self, profile_data: CompleteProfile) -> User:
        """創建新用戶"""
        # 生成新的用戶ID
        max_id = max([int(uid) for uid in self.users_container.users.keys()], default=0)
        new_id = str(max_id + 1)
        
        new_user = User(
            id=new_id,
            profile_data=profile_data,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.users_container.users[new_id] = new_user
        self._save_users()
        return new_user
    
    def update_user(self, user_id: str, profile_data: CompleteProfile) -> Optional[User]:
        """更新用戶資料"""
        if user_id not in self.users_container.users:
            return None
        
        user = self.users_container.users[user_id]
        user.profile_data = profile_data
        user.updated_at = datetime.now()
        
        self._save_users()
        return user

# 全局用戶服務實例
user_service = UserService()
