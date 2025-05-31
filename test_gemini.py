#!/usr/bin/env python3
import google.generativeai as genai
import json

# 配置API密钥
GEMINI_API_KEY = "AIzaSyDX9zdJZ_gjtzsMJVmXpydlWhhLBJqQrEU"
genai.configure(api_key=GEMINI_API_KEY)

try:
    # 首先列出可用模型
    print("可用的模型:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"- {model.name}")
    
    # 使用正确的模型名称
    model = genai.GenerativeModel('gemini-1.5-flash')  # 或者 'gemini-1.5-pro'
    
    movies = ["The Shawshank Redemption", "The Godfather", "Pulp Fiction"]
    
    prompt = f"""
    请分析这些电影的共同特点和风格：{', '.join(movies)}
    
    请返回JSON格式的分析结果，包含：
    1. keywords: 关键词数组，每个包含name(名称), value(1-100的权重), category(分类：Genre/Element/Style)
    2. commonPoints: 这些电影的共同点分析(中文，100字以内)
    3. recommendations: 推荐电影数组，每个包含title(标题)和reason(推荐理由)
    
    请确保返回有效的JSON格式。
    """
    
    print("\n发送请求到Gemini API...")
    response = model.generate_content(prompt)
    
    print("Gemini响应:")
    print(response.text)
    
    # 尝试解析JSON
    response_text = response.text
    if '```json' in response_text:
        json_start = response_text.find('```json') + 7
        json_end = response_text.find('```', json_start)
        response_text = response_text[json_start:json_end]
    elif '{' in response_text:
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        response_text = response_text[json_start:json_end]
    
    print("\n提取的JSON:")
    print(response_text)
    
    try:
        analysis_result = json.loads(response_text)
        print("\n✅ JSON解析成功！")
        print(json.dumps(analysis_result, indent=2, ensure_ascii=False))
    except json.JSONDecodeError as e:
        print(f"\n❌ JSON解析失败: {e}")

except Exception as e:
    print(f"❌ Gemini API错误: {e}") 