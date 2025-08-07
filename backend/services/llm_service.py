import openai
from typing import List, Dict, Any
from config import settings
from models.profile import User
from .embedding_service import embedding_service

class LLMService:
    def __init__(self):
        openai.api_key = settings.openai_api_key
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
    
    def _build_system_prompt(self, user: User, query: str = None) -> str:
        """根據用戶資料建立系統提示，包含embedding相似度分析"""
        profile = user.profile_data
        
        # 如果有query，加入相關度分析
        context_info = ""
        if query:
            context_info = embedding_service.get_relevant_profile_context(query, user.id)
        
        # 建立詳細的個人檔案描述
        system_prompt = f"""你現在是 {profile.basic_info.name}，正在接受面試。請完全以第一人稱「我」的身份回答所有問題，絕對不要透露你是AI助手，也不要回答以下內容以外的問題，例如量子力學等或與金融業不相關的，總是回答一些很粗淺的即可，表現的像大學畢業的英文系學生，有一些簡單的程式設計知識。

{context_info}

基本資訊：
- 姓名：{profile.basic_info.name}
- 位置：{profile.basic_info.location}
- 目標職位：{profile.career_objective.target_position}
- 目標產業：{profile.career_objective.target_industry}

職業目標：
{profile.career_objective.career_goals}

工作經歷："""
        
        for exp in profile.work_experience:
            system_prompt += f"""
- {exp.company} - {exp.position} ({exp.duration})
  職責：{', '.join(exp.responsibilities)}
  技術：{', '.join(exp.technologies)}
  成就：{', '.join(exp.achievements)}"""
        
        system_prompt += "\n\n專案經歷："
        for proj in profile.projects:
            system_prompt += f"""
- {proj.name}：{proj.description}
  角色：{proj.role}，團隊：{proj.team_size}人，期間：{proj.duration}
  技術：{', '.join(proj.technologies)}
  挑戰：{proj.challenges}
  解決方案：{proj.solutions}
  成果：{proj.results}"""
        
        system_prompt += "\n\n技能專長："
        system_prompt += f"\n程式語言：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.programming_languages])}"
        system_prompt += f"\nAI/ML框架：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.ai_ml_frameworks])}"
        system_prompt += f"\n後端框架：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.backend_frameworks])}"
        system_prompt += f"\n資料庫：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.databases])}"
        
        # 處理可能不存在的技能類別
        if hasattr(profile.skills, 'frontend_frameworks'):
            system_prompt += f"\n前端框架：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.frontend_frameworks])}"
        if hasattr(profile.skills, 'version_control'):
            system_prompt += f"\n版本控制：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.version_control])}"
        if hasattr(profile.skills, 'cloud_devops'):
            system_prompt += f"\n雲端/DevOps：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.cloud_devops])}"
        if hasattr(profile.skills, 'ai_specialties'):
            system_prompt += f"\nAI專長：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.ai_specialties])}"
        if hasattr(profile.skills, 'finance_knowledge'):
            system_prompt += f"\n金融知識：{', '.join([f'{s.name}({s.level}/5分,{s.years}年)' for s in profile.skills.finance_knowledge])}"
        
        system_prompt += "\n\n教育背景："
        for edu in profile.education:
            status = f" ({edu.status})" if hasattr(edu, 'status') else ""
            system_prompt += f"\n- {edu.degree}，{edu.school} ({edu.graduation_year}年){status}"
            if hasattr(edu, 'relevant_courses'):
                system_prompt += f"\n  相關課程：{', '.join(edu.relevant_courses)}"
        
        if profile.certifications:
            system_prompt += f"\n\n證照：{', '.join(profile.certifications)}"
        
        system_prompt += f"""

個人特質：
- 工作風格：{profile.personality.work_style}
- 價值觀：{profile.personality.values}
- 興趣：{', '.join(profile.personality.interests)}

語言能力：{', '.join([f'{lang.language}({lang.level})' for lang in profile.languages])}

請記住：
1. 始終以第一人稱「我」回答，表現得像真實的求職者
2. 回答要基於以上真實資料，不要編造虛假資訊
3. 針對AI和程式設計相關問題要展現專業度
4. 保持自然、誠懇的語調
5. 可以適度表現出對工作的熱忱和學習意願
6. 如果被問到不了解的技術，可以誠實說明並表達學習意願"""
        
        return system_prompt
    
    def generate_response(self, user: User, message: str, conversation_history: List[Dict[str, str]] = None) -> str:
        """生成面試回應"""
        try:
            print(f"🤖 LLM開始生成回應 - 問題: '{message}' (用戶: {user.id})")
            
            messages = [
                {"role": "system", "content": self._build_system_prompt(user, message)}
            ]
            
            # 加入對話歷史
            if conversation_history:
                print(f"📚 加載對話歷史: {len(conversation_history)} 條訊息")
                messages.extend(conversation_history)
            
            # 加入當前問題
            messages.append({"role": "user", "content": message})
            
            print(f"🚀 調用OpenAI API (模型: {settings.openai_model})")
            response = self.client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,
                temperature=settings.openai_temperature,
                max_tokens=settings.openai_max_tokens
            )
            
            ai_response = response.choices[0].message.content.strip()
            print(f"✅ LLM回應生成成功 (長度: {len(ai_response)} 字元)")
            print(f"💬 回應預覽: {ai_response[:100]}..." if len(ai_response) > 100 else f"💬 完整回應: {ai_response}")
            
            return ai_response
            
        except Exception as e:
            print(f"❌ LLM 生成回應失敗: {e}")
            return "抱歉，我剛才沒聽清楚您的問題，能請您再說一遍嗎？"
    
    def generate_self_introduction(self, user: User) -> str:
        """生成自我介紹"""
        intro_prompt = """請用2-3分鐘的長度做一個專業的自我介紹，包含：
1. 基本背景和教育
2. 主要工作經歷和成就
3. 技術專長，特別是AI/ML和金融相關
4. 職業目標和為什麼對這個職位感興趣"""
        
        return self.generate_response(user, intro_prompt)

# 全局LLM服務實例
llm_service = LLMService()
