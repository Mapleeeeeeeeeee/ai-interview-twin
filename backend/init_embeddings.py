#!/usr/bin/env python3
"""
初始化embedding的腳本
為users.json中的所有用戶生成embedding向量
"""

import sys
import os
import json
from pathlib import Path

# 添加父目錄到路徑以便導入模組
sys.path.append(str(Path(__file__).parent))

from services.embedding_service import embedding_service
from services.user_service import user_service

def initialize_embeddings():
    """為所有用戶初始化embedding"""
    print("開始初始化用戶embeddings...")
    
    try:
        # 獲取所有用戶
        users = user_service.get_all_users()
        
        if not users:
            print("沒有找到用戶資料")
            return
        
        print(f"找到 {len(users)} 個用戶")
        
        # 為每個用戶生成embedding
        for user_id, user in users.items():
            print(f"正在為用戶 {user.id} ({user.profile_data.basic_info.name}) 生成embedding...")
            
            try:
                embedding_service.update_user_embedding(user)
                print(f"✓ 用戶 {user.id} 的embedding已生成")
            except Exception as e:
                print(f"✗ 用戶 {user.id} 的embedding生成失敗: {e}")
        
        print("所有用戶的embedding初始化完成！")
        
        # 測試相似度計算
        test_query = "請介紹你的AI相關經驗"
        first_user_id = list(users.keys())[0]
        similarity, profile_text = embedding_service.calculate_similarity(test_query, first_user_id)
        print(f"\n測試查詢: '{test_query}'")
        print(f"與用戶 {first_user_id} 的相似度: {similarity:.3f}")
        
    except Exception as e:
        print(f"初始化過程中發生錯誤: {e}")

if __name__ == "__main__":
    initialize_embeddings()
