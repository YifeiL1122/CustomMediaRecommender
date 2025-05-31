from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai
import json

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 临时硬编码API密钥用于测试
API_KEY = "d8a61810"
GEMINI_API_KEY = "AIzaSyDX9zdJZ_gjtzsMJVmXpydlWhhLBJqQrEU"

# 配置Gemini API
gemini_key = os.getenv("GEMINI_API_KEY") or GEMINI_API_KEY
if gemini_key:
    genai.configure(api_key=gemini_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    api_key = os.getenv("OMDB_API_KEY") or API_KEY
    
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
        
    try:
        response = requests.get(f"http://www.omdbapi.com/?apikey={api_key}&s={query}")
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/movie/<imdb_id>')
def get_movie(imdb_id):
    api_key = os.getenv("OMDB_API_KEY") or API_KEY
    
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
        
    try:
        response = requests.get(f"http://www.omdbapi.com/?apikey={api_key}&i={imdb_id}")
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_movies():
    try:
        movies = request.json.get('movies', [])
        
        if not movies:
            return jsonify({"error": "No movies provided"}), 400
        
        # 检查Gemini API是否可用
        if not gemini_key:
            # 如果没有Gemini API，返回模拟数据
            return jsonify(get_mock_analysis())
        
        try:
            # 使用Gemini API进行真实分析
            model = genai.GenerativeModel('gemini-pro')
            
            # 构建分析提示
            prompt = f"""
            请分析这些电影的共同特点和风格：{', '.join(movies)}
            
            请返回JSON格式的分析结果，包含：
            1. keywords: 关键词数组，每个包含name(名称), value(1-100的权重), category(分类：Genre/Element/Style)
            2. commonPoints: 这些电影的共同点分析(中文，100字以内)
            3. recommendations: 推荐电影数组，每个包含title(标题)和reason(推荐理由)
            
            请确保返回有效的JSON格式。
            """
            
            response = model.generate_content(prompt)
            
            # 尝试解析Gemini的响应为JSON
            try:
                # 清理响应文本，提取JSON部分
                response_text = response.text
                if '```json' in response_text:
                    json_start = response_text.find('```json') + 7
                    json_end = response_text.find('```', json_start)
                    response_text = response_text[json_start:json_end]
                elif '{' in response_text:
                    json_start = response_text.find('{')
                    json_end = response_text.rfind('}') + 1
                    response_text = response_text[json_start:json_end]
                
                analysis_result = json.loads(response_text)
                return jsonify(analysis_result)
            except json.JSONDecodeError:
                # 如果JSON解析失败，返回模拟数据
                print(f"Gemini JSON parse error: {response.text}")
                return jsonify(get_mock_analysis())
                
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            # Gemini API失败时，返回模拟数据
            return jsonify(get_mock_analysis())
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_mock_analysis():
    """返回模拟的分析数据"""
    return {
        "keywords": [
            {"name": "Drama", "value": 90, "category": "Genre"},
            {"name": "Crime", "value": 80, "category": "Genre"},
            {"name": "Suspense", "value": 70, "category": "Element"},
            {"name": "Action", "value": 65, "category": "Genre"},
            {"name": "Character-driven", "value": 85, "category": "Style"},
            {"name": "Plot twists", "value": 75, "category": "Element"},
            {"name": "Visual style", "value": 60, "category": "Element"},
            {"name": "Soundtrack", "value": 55, "category": "Element"},
            {"name": "Dialogue", "value": 80, "category": "Element"},
            {"name": "Themes", "value": 85, "category": "Element"}
        ],
        "commonPoints": "这些电影共享令人难忘的角色、强烈的叙事和扣人心弦的情节发展。它们都展示了复杂的主题和精湛的电影制作工艺，创造出引人入胜的观影体验。",
        "recommendations": [
            {
                "title": "The Departed",
                "reason": "类似的犯罪和戏剧元素，人物复杂"
            },
            {
                "title": "Inception",
                "reason": "令人难以置信的叙事，情感深度"
            },
            {
                "title": "No Country for Old Men",
                "reason": "犯罪环境中的紧张感和道德模糊性"
            }
        ]
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 