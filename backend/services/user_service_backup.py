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
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        except Exception as e:
            print(f"儲存用戶資料失敗: {e}")
from typing import Dict, List, Optional
from models.profile import User, CompleteProfile, UserContainer

class DateTimeEncoder(json.JSONEncoder):
    """自定義JSON編碼器處理datetime對象"""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

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
                        if "created_at" in user_data:
                            user_data["created_at"] = datetime.fromisoformat(user_data["created_at"])
                        if "updated_at" in user_data:
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
                json.dump(self.users_container.model_dump(), f, ensure_ascii=False, indent=2, cls=DateTimeEncoder)
        except Exception as e:
            print(f"儲存用戶資料失敗: {e}")
    
    def _create_demo_user(self):
        """建立示範用戶資料"""
        from models.profile import (
            ContactInfo, CareerObjective, WorkExperience, Project, 
            SkillCategory, Skill, Education, Language, Personality
        )
        
        demo_profile = CompleteProfile(
            basic_info=ContactInfo(
                name="郭懷德",
                email="hwai-de.kuo@example.com",
                phone="+886-912-345-678",
                linkedin="https://linkedin.com/in/hwai-de-kuo",
                github="https://github.com/hwai-de-kuo",
                location="台北市"
            ),
            career_objective=CareerObjective(
                target_position="Senior AI/ML Engineer",
                target_industry="金融科技 / FinTech",
                target_role_types=["AI工程師", "機器學習工程師", "資料科學家"],
                preferred_location="台北市",
                career_goals="專注於金融業AI應用開發，特別是生成式AI和機器學習解決方案"
            ),
            work_experience=[
                WorkExperience(
                    company="現任公司",
                    position="AI/ML Engineer",
                    duration="2023.XX - 現在",
                    responsibilities=[
                        "開發金融業客服聊天機器人系統",
                        "建置RAG系統處理複雜金融法規查詢",
                        "優化機器學習模型效能和準確率"
                    ],
                    technologies=["Python", "TensorFlow", "PyTorch", "FastAPI", "Docker"],
                    achievements=[
                        "提升客戶查詢回應準確率至95%",
                        "減少人工處理時間60%"
                    ]
                )
            ],
            projects=[
                Project(
                    name="金融智能客服系統",
                    description="整合GPT-4的多輪對話客服系統",
                    role="主要開發者",
                    team_size=3,
                    duration="6個月",
                    technologies=["Python", "OpenAI API", "FastAPI", "PostgreSQL", "Redis"],
                    challenges="處理複雜的金融產品查詢和合規要求",
                    solutions="實作RAG架構結合知識圖譜",
                    results="客戶滿意度提升40%，查詢解決率達90%"
                )
            ],
            skills=SkillCategory(
                programming_languages=[
                    Skill(name="Python", level=5, years=4),
                    Skill(name="JavaScript", level=4, years=3),
                    Skill(name="SQL", level=4, years=3)
                ],
                ai_ml_frameworks=[
                    Skill(name="TensorFlow", level=4, years=2),
                    Skill(name="PyTorch", level=4, years=2),
                    Skill(name="scikit-learn", level=5, years=3),
                    Skill(name="OpenAI API", level=5, years=1.5)
                ],
                backend_frameworks=[
                    Skill(name="FastAPI", level=5, years=2),
                    Skill(name="Django", level=4, years=2),
                    Skill(name="Flask", level=4, years=1.5)
                ],
                databases=[
                    Skill(name="PostgreSQL", level=4, years=3),
                    Skill(name="Redis", level=4, years=2),
                    Skill(name="MongoDB", level=3, years=1)
                ],
                cloud_devops=[
                    Skill(name="Docker", level=4, years=2),
                    Skill(name="AWS", level=3, years=1),
                    Skill(name="Kubernetes", level=3, years=1)
                ],
                ai_specialties=[
                    Skill(name="RAG系統", level=5, years=1.5),
                    Skill(name="LLM Fine-tuning", level=4, years=1),
                    Skill(name="自然語言處理", level=4, years=2),
                    Skill(name="推薦系統", level=4, years=2)
                ],
                finance_knowledge=[
                    Skill(name="金融產品知識", level=3, years=1),
                    Skill(name="風險控制", level=3, years=1),
                    Skill(name="法規遵循", level=3, years=1)
                ]
            ),
            education=[
                Education(
                    degree="資訊工程學士/碩士",
                    school="台灣知名大學",
                    graduation_year=2021,
                    relevant_courses=["機器學習", "深度學習", "資料結構與演算法", "軟體工程"]
                )
            ],
            certifications=[
                "AWS Certified Developer",
                "Google Cloud Professional ML Engineer",
                "Microsoft Azure AI Engineer"
            ],
            personality=Personality(
                work_style="注重程式碼品質，遵循SOLID原則，喜歡團隊協作和知識分享",
                values="持續學習新技術，追求技術卓越，注重系統穩定性和可維護性",
                interests=["開源專案貢獻", "技術寫作", "AI研究", "金融科技趨勢"]
            ),
            languages=[
                Language(language="中文", level="母語"),
                Language(language="英文", level="商務溝通")
            ]
        )
        
        demo_user = User(
            id="1",
            profile_data=demo_profile,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.users_container.users["1"] = demo_user
        self._save_users()
    
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
