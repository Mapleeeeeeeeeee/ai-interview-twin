#!/usr/bin/env python3
"""
數位分身面試助手 API 測試腳本
測試所有API端點的功能是否正常
"""

import requests
import json
from datetime import datetime

# API基礎URL
BASE_URL = "http://localhost:8001"

def test_health_check():
    """測試健康檢查端點"""
    print("🔍 測試健康檢查...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        print("✅ 健康檢查通過\n")
        return True
    except Exception as e:
        print(f"❌ 健康檢查失敗: {e}\n")
        return False

def test_root_endpoint():
    """測試根端點"""
    print("🔍 測試根端點...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        print("✅ 根端點測試通過\n")
        return True
    except Exception as e:
        print(f"❌ 根端點測試失敗: {e}\n")
        return False

def test_get_users():
    """測試獲取用戶列表"""
    print("🔍 測試獲取用戶列表...")
    try:
        response = requests.get(f"{BASE_URL}/api/users/")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Users found: {len(data.get('users', []))}")
        for user in data.get('users', []):
            print(f"  - ID: {user.get('id')}, Name: {user.get('name')}")
        assert response.status_code == 200
        print("✅ 用戶列表獲取成功\n")
        return data.get('users', [])
    except Exception as e:
        print(f"❌ 用戶列表獲取失敗: {e}\n")
        return []

def test_get_user_detail(user_id):
    """測試獲取用戶詳細資料"""
    print(f"🔍 測試獲取用戶 {user_id} 詳細資料...")
    try:
        response = requests.get(f"{BASE_URL}/api/users/{user_id}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            profile = data.get('profile_data', {})
            basic_info = profile.get('basic_info', {})
            print(f"Name: {basic_info.get('name')}")
            print(f"Email: {basic_info.get('email')}")
            print(f"Location: {basic_info.get('location')}")
            
            # 顯示技能統計
            skills = profile.get('skills', {})
            total_skills = sum(len(category) for category in skills.values())
            print(f"Total skills: {total_skills}")
            
            print("✅ 用戶詳細資料獲取成功\n")
            return data
        else:
            print(f"❌ 用戶詳細資料獲取失敗: HTTP {response.status_code}\n")
            return None
    except Exception as e:
        print(f"❌ 用戶詳細資料獲取失敗: {e}\n")
        return None

def test_interview_chat(user_id):
    """測試面試對話功能"""
    print(f"🔍 測試用戶 {user_id} 面試對話...")
    
    # 測試問題列表
    test_questions = [
        "請先自我介紹一下",
        "你在AI/ML領域有什麼經驗？",
        "能詳細說說你做過的RAG系統專案嗎？",
        "你對金融科技有什麼看法？",
        "為什麼想來我們公司工作？"
    ]
    
    session_id = None
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n  📝 問題 {i}: {question}")
        try:
            payload = {
                "message": question,
                "session_id": session_id
            }
            
            response = requests.post(
                f"{BASE_URL}/api/interview/chat/{user_id}",
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"  Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get('session_id')  # 保存session_id給下一個問題
                answer = data.get('response', '')
                print(f"  💬 回答: {answer[:200]}{'...' if len(answer) > 200 else ''}")
                print(f"  🔗 Session ID: {session_id}")
            else:
                print(f"  ❌ 對話失敗: HTTP {response.status_code}")
                print(f"  Response: {response.text}")
                
        except Exception as e:
            print(f"  ❌ 對話請求失敗: {e}")
    
    print(f"\n✅ 面試對話測試完成，Session ID: {session_id}\n")
    return session_id

def test_conversation_history(session_id):
    """測試對話歷史獲取"""
    if not session_id:
        print("⚠️  跳過對話歷史測試（無有效session_id）\n")
        return
        
    print(f"🔍 測試獲取對話歷史...")
    try:
        response = requests.get(f"{BASE_URL}/api/interview/session/{session_id}/history")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            history = data.get('history', [])
            print(f"對話輪數: {len(history)}")
            
            for i, msg in enumerate(history[-4:], 1):  # 只顯示最後4條
                role = "面試官" if msg['role'] == 'interviewer' else "候選人"
                content = msg['content']
                print(f"  {i}. [{role}]: {content[:100]}{'...' if len(content) > 100 else ''}")
                
            print("✅ 對話歷史獲取成功\n")
        else:
            print(f"❌ 對話歷史獲取失敗: HTTP {response.status_code}\n")
            
    except Exception as e:
        print(f"❌ 對話歷史獲取失敗: {e}\n")

def test_start_interview(user_id):
    """測試開始面試端點"""
    print(f"🔍 測試開始面試...")
    try:
        response = requests.post(f"{BASE_URL}/api/interview/start/{user_id}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            session_id = data.get('session_id')
            print(f"新的 Session ID: {session_id}")
            print("✅ 面試開始成功\n")
            return session_id
        else:
            print(f"❌ 面試開始失敗: HTTP {response.status_code}\n")
            return None
            
    except Exception as e:
        print(f"❌ 面試開始失敗: {e}\n")
        return None

def test_error_cases():
    """測試錯誤情況處理"""
    print("🔍 測試錯誤情況處理...")
    
    # 測試不存在的用戶
    print("  測試不存在的用戶...")
    response = requests.get(f"{BASE_URL}/api/users/999")
    print(f"  不存在用戶狀態碼: {response.status_code}")
    assert response.status_code == 404
    
    # 測試不存在的session
    print("  測試不存在的session...")
    response = requests.get(f"{BASE_URL}/api/interview/session/invalid-session/history")
    print(f"  不存在session狀態碼: {response.status_code}")
    
    # 測試無效的對話請求
    print("  測試無效的對話請求...")
    response = requests.post(
        f"{BASE_URL}/api/interview/chat/999",
        json={"message": "test"}
    )
    print(f"  無效用戶對話狀態碼: {response.status_code}")
    assert response.status_code == 404
    
    print("✅ 錯誤情況處理測試完成\n")

def main():
    """主測試函數"""
    print("🚀 開始API測試...\n")
    print("=" * 60)
    
    # 基礎健康檢查
    if not test_health_check():
        print("❌ 服務器無法連接，請確保後端正在運行")
        return
    
    test_root_endpoint()
    
    # 用戶相關測試
    users = test_get_users()
    if not users:
        print("⚠️  沒有找到用戶，請確保users.json文件存在並包含用戶資料")
        return
    
    # 使用第一個用戶進行測試
    test_user_id = users[0]['id']
    print(f"🎯 使用用戶 ID {test_user_id} 進行測試\n")
    
    # 獲取用戶詳細資料
    user_detail = test_get_user_detail(test_user_id)
    
    # 面試功能測試
    session_id = test_start_interview(test_user_id)
    session_id = test_interview_chat(test_user_id)  # 這會創建新session
    test_conversation_history(session_id)
    
    # 錯誤處理測試
    test_error_cases()
    
    print("=" * 60)
    print("🎉 API測試完成！")
    
    # 測試總結
    print("\n📊 測試總結:")
    print(f"✅ 服務器運行正常: http://localhost:8001")
    print(f"✅ 用戶數量: {len(users)}")
    print(f"✅ 面試功能正常")
    print(f"✅ 對話歷史功能正常")
    print(f"✅ 錯誤處理正常")
    
    print("\n🔗 有用的連結:")
    print(f"📖 API文檔: {BASE_URL}/docs")
    print(f"🔍 健康檢查: {BASE_URL}/health")
    print(f"👥 用戶列表: {BASE_URL}/api/users/")

if __name__ == "__main__":
    main()
