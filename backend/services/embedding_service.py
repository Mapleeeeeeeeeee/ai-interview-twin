import openai
import json
import os
import numpy as np
from typing import List, Dict, Any, Tuple
from sklearn.metrics.pairwise import cosine_similarity
from config import settings
from models.profile import User

class EmbeddingService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.embedding_model = "text-embedding-3-small"
        self.vectors_file = settings.vectors_data_file
        
    def get_embedding(self, text: str) -> List[float]:
        """獲取文本的embedding向量"""
        try:
            response = self.client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"獲取embedding失敗: {e}")
            return []
    
    def extract_user_profile_text(self, user: User) -> str:
        """將用戶資料轉換為文本用於embedding"""
        profile = user.profile_data
        
        # 組合所有相關文本
        text_parts = []
        
        # 基本資訊
        text_parts.append(f"姓名：{profile.basic_info.name}")
        text_parts.append(f"位置：{profile.basic_info.location}")
        
        # 職業目標
        text_parts.append(f"目標職位：{profile.career_objective.target_position}")
        text_parts.append(f"目標產業：{profile.career_objective.target_industry}")
        text_parts.append(f"職業目標：{profile.career_objective.career_goals}")
        text_parts.append(f"目標角色類型：{', '.join(profile.career_objective.target_role_types)}")
        
        # 工作經歷
        for exp in profile.work_experience:
            text_parts.append(f"工作經歷：{exp.company} {exp.position}")
            text_parts.append(f"職責：{' '.join(exp.responsibilities)}")
            text_parts.append(f"技術：{' '.join(exp.technologies)}")
            text_parts.append(f"成就：{' '.join(exp.achievements)}")
        
        # 專案經歷
        for proj in profile.projects:
            text_parts.append(f"專案：{proj.name}")
            text_parts.append(f"專案描述：{proj.description}")
            text_parts.append(f"角色：{proj.role}")
            text_parts.append(f"技術：{' '.join(proj.technologies)}")
            text_parts.append(f"挑戰：{proj.challenges}")
            text_parts.append(f"解決方案：{proj.solutions}")
            text_parts.append(f"成果：{proj.results}")
        
        # 技能
        all_skills = []
        for skill_category in [
            profile.skills.programming_languages,
            profile.skills.ai_ml_frameworks,
            profile.skills.backend_frameworks,
            profile.skills.databases
        ]:
            for skill in skill_category:
                all_skills.append(f"{skill.name} {skill.level}級 {skill.years}年經驗")
        
        # 檢查是否有frontend_frameworks
        if hasattr(profile.skills, 'frontend_frameworks'):
            for skill in profile.skills.frontend_frameworks:
                all_skills.append(f"{skill.name} {skill.level}級 {skill.years}年經驗")
        
        # 檢查是否有version_control
        if hasattr(profile.skills, 'version_control'):
            for skill in profile.skills.version_control:
                all_skills.append(f"{skill.name} {skill.level}級 {skill.years}年經驗")
        
        # 檢查是否有ai_specialties
        if hasattr(profile.skills, 'ai_specialties'):
            for skill in profile.skills.ai_specialties:
                all_skills.append(f"{skill.name} {skill.level}級 {skill.years}年經驗")
        
        text_parts.append(f"技能：{' '.join(all_skills)}")
        
        # 教育背景
        for edu in profile.education:
            text_parts.append(f"教育：{edu.degree} {edu.school}")
            if hasattr(edu, 'relevant_courses'):
                text_parts.append(f"相關課程：{' '.join(edu.relevant_courses)}")
        
        # 證照
        if profile.certifications:
            text_parts.append(f"證照：{' '.join(profile.certifications)}")
        
        # 個人特質
        text_parts.append(f"工作風格：{profile.personality.work_style}")
        text_parts.append(f"價值觀：{profile.personality.values}")
        text_parts.append(f"興趣：{' '.join(profile.personality.interests)}")
        
        # 語言能力
        text_parts.append(f"語言：{' '.join([f'{lang.language} {lang.level}' for lang in profile.languages])}")
        
        return " ".join(text_parts)
    
    def create_user_embedding(self, user: User) -> Dict[str, Any]:
        """為用戶創建embedding"""
        profile_text = self.extract_user_profile_text(user)
        embedding = self.get_embedding(profile_text)
        
        return {
            "user_id": user.id,
            "profile_text": profile_text,
            "embedding": embedding,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    
    def save_embeddings(self, embeddings: Dict[str, Any]):
        """保存embeddings到檔案"""
        try:
            os.makedirs(os.path.dirname(self.vectors_file), exist_ok=True)
            with open(self.vectors_file, 'w', encoding='utf-8') as f:
                json.dump(embeddings, f, ensure_ascii=False, indent=2, default=str)
        except Exception as e:
            print(f"保存embeddings失敗: {e}")
    
    def load_embeddings(self) -> Dict[str, Any]:
        """從檔案載入embeddings"""
        try:
            if os.path.exists(self.vectors_file):
                with open(self.vectors_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"載入embeddings失敗: {e}")
        return {}
    
    def update_user_embedding(self, user: User):
        """更新用戶的embedding"""
        embeddings = self.load_embeddings()
        user_embedding = self.create_user_embedding(user)
        embeddings[user.id] = user_embedding
        self.save_embeddings(embeddings)
    
    def calculate_similarity(self, query: str, user_id: str) -> Tuple[float, str]:
        """計算query與用戶資料的相似度"""
        try:
            # 獲取query的embedding
            query_embedding = self.get_embedding(query)
            if not query_embedding:
                return 0.0, ""
            
            # 載入用戶embeddings
            embeddings = self.load_embeddings()
            if user_id not in embeddings:
                return 0.0, ""
            
            user_embedding = embeddings[user_id]["embedding"]
            if not user_embedding:
                return 0.0, ""
            
            # 計算cosine similarity
            query_vec = np.array(query_embedding).reshape(1, -1)
            user_vec = np.array(user_embedding).reshape(1, -1)
            similarity = cosine_similarity(query_vec, user_vec)[0][0]
            
            # 獲取相關的profile文本
            relevant_profile = embeddings[user_id]["profile_text"]
            
            return similarity, relevant_profile
            
        except Exception as e:
            print(f"計算相似度失敗: {e}")
            return 0.0, ""
    
    def get_relevant_profile_context(self, query: str, user_id: str, threshold: float = 0.3) -> str:
        """根據query獲取相關的profile context"""
        print(f"🔍 RAG檢索開始 - 問題: '{query}' (用戶: {user_id})")
        
        similarity, profile_text = self.calculate_similarity(query, user_id)
        
        print(f"📊 相似度計算結果: {similarity:.3f}")
        
        if similarity > threshold:
            print(f"✅ 相似度超過閾值 ({threshold})，使用RAG增強")
            print(f"📄 檢索到的相關內容預覽: {profile_text[:200]}..." if len(profile_text) > 200 else f"📄 檢索到的完整內容: {profile_text}")
            
            return f"""
基於問題相關度分析（相似度: {similarity:.3f}），以下是最相關的個人資料：

{profile_text}

---
"""
        else:
            print(f"⚠️ 相似度低於閾值 ({threshold})，使用通用回答模式")
            return f"""
問題相關度分析（相似度: {similarity:.3f}）：此問題與現有資料關聯較低，將基於一般資料回答。

---
"""

# 全局embedding服務實例
embedding_service = EmbeddingService()
