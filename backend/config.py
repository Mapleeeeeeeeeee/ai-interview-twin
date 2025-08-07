from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    openai_api_key: str
    database_url: Optional[str] = None
    
    # JSON文件存儲配置
    users_data_file: str = "data/users.json"
    vectors_data_file: str = "data/vectors.json"
    
    # OpenAI 配置
    openai_model: str = "gpt-4.1"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 2000
    
    class Config:
        env_file = "../.env"  # 指向上一層的.env文件
        case_sensitive = False
        extra = "ignore"  # 忽略額外的環境變數

settings = Settings()
