from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# 基礎資料模型
class ContactInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    phone: str = Field(..., min_length=10, max_length=20)
    linkedin: Optional[str] = Field(None, pattern=r'^https://(www\.)?linkedin\.com/.+')  # 支援 www.linkedin.com
    github: Optional[str] = Field(None, pattern=r'^https://github\.com/.+')
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
    """多用戶容器"""
    users: Dict[str, User] = {}

# 面試對話相關
class InterviewMessage(BaseModel):
    role: str = Field(..., pattern=r'^(interviewer|candidate)$')
    content: str = Field(..., min_length=1)
    timestamp: datetime = Field(default_factory=datetime.now)

class InterviewSession(BaseModel):
    session_id: str
    user_id: str
    messages: List[InterviewMessage] = []
    started_at: datetime = Field(default_factory=datetime.now)

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
