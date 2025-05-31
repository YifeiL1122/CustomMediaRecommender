from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../static')

# 简单的测试路由
@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Template error: {str(e)}"

@app.route('/test')
def test():
    return jsonify({"status": "Flask is working!", "env_test": os.getenv("OMDB_API_KEY", "Not found")})

@app.route('/analysis')
def analysis():
    try:
        return render_template('analysis.html')
    except Exception as e:
        return f"Template error: {str(e)}"

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    api_key = os.getenv("OMDB_API_KEY")
    
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
        
    try:
        response = requests.get(f"http://www.omdbapi.com/?apikey={api_key}&s={query}")
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/movie/<imdb_id>')
def get_movie(imdb_id):
    api_key = os.getenv("OMDB_API_KEY")
    
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
        
        analysis_result = {
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
        
        return jsonify(analysis_result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel需要这个
if __name__ == '__main__':
    app.run(debug=True) 