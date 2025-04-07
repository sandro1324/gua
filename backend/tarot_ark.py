from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import os
import requests
import json

# 配置API密钥
os.environ["ARK_API_KEY"] = "b8630f89-673f-4ebb-ac6f-821b95442cbf"  # 替换成实际密钥

app = Flask(__name__)
CORS(app)

def call_volcengine_api(system_prompt: str, user_prompt: str):
    """调用火山引擎API的核心函数"""
    try:
        url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('ARK_API_KEY')}"
        }
        payload = {
            "model": "ep-20250311174845-dzj2f",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 1,
            "top_p": 0.7,
            "max_tokens": 2025
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    
    except Exception as e:
        return str(e), 500

@app.route('/api/tarot', methods=['POST'])
def tarot_reading():
    """塔罗牌标准解读"""
    try:
        data = request.get_json()
        question = data.get('question')
        card_name = data.get('card_name')
        position = data.get('position')

        if not all([question, card_name, position]):
            return jsonify({"error": "Missing required fields"}), 400

        system_prompt = """# Role: Master Tarot Analyst
You are an expert Tarot card reader with deep knowledge of both traditional and modern Tarot interpretations.

## Core Skills:
1. Tarot Card Analysis
   - Deep understanding of card meanings
   - Ability to interpret both upright and reversed positions
   - Knowledge of card combinations and spreads
2. Psychological Insight
   - Understanding of human psychology
   - Ability to provide meaningful guidance
   - Sensitivity to emotional states
3. Communication
   - Clear and compassionate delivery
   - Ability to explain complex concepts simply
   - Professional and respectful tone

## Response Format:
[Card Meaning]
Brief explanation of the card's traditional meaning.

[Current Situation]
Analysis of how the card relates to the querent's question.

[Guidance]
Practical advice and insights based on the card's message.

## Rules:
1. Always maintain a professional and respectful tone
2. Focus on providing constructive guidance
3. Be specific and relevant to the querent's question
4. Consider both the card's traditional meaning and its position
5. Provide actionable insights when possible"""

        user_prompt = f"用户问题：{question}\n抽到卡牌：{card_name}（{position}）"
        
        interpretation = call_volcengine_api(system_prompt, user_prompt)
        
        return jsonify({
            "card_name": card_name,
            "position": position,
            "interpretation": interpretation
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tarot/stream', methods=['GET'])
def tarot_stream():
    """塔罗牌流式解读"""
    try:
        question = request.args.get('question')
        card_name = request.args.get('card_name')
        position = request.args.get('position')

        if not all([question, card_name, position]):
            return jsonify({"error": "Missing required fields"}), 400

        def generate():
            url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
            headers = {
                "Authorization": f"Bearer {os.environ.get('ARK_API_KEY')}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "ep-20250311174845-dzj2f",
                "messages": [
                    {
                        "role": "system",
                        "content": """# Role: Master Tarot Analyst
You are an expert Tarot card reader with deep knowledge of both traditional and modern Tarot interpretations.

## Core Skills:
1. Tarot Card Analysis
   - Deep understanding of card meanings
   - Ability to interpret both upright and reversed positions
   - Knowledge of card combinations and spreads
2. Psychological Insight
   - Understanding of human psychology
   - Ability to provide meaningful guidance
   - Sensitivity to emotional states
3. Communication
   - Clear and compassionate delivery
   - Ability to explain complex concepts simply
   - Professional and respectful tone

## Response Format:
[Card Meaning]
Brief explanation of the card's traditional meaning.

[Current Situation]
Analysis of how the card relates to the querent's question.

[Guidance]
Practical advice and insights based on the card's message.

## Rules:
1. Always maintain a professional and respectful tone
2. Focus on providing constructive guidance
3. Be specific and relevant to the querent's question
4. Consider both the card's traditional meaning and its position
5. Provide actionable insights when possible"""
                    },
                    {
                        "role": "user",
                        "content": f"用户问题：{question}\n抽到卡牌：{card_name}（{position}）"
                    }
                ],
                "stream": True,
                "temperature": 1,
                "top_p": 0.7,
                "max_tokens": 2025
            }
            
            with requests.post(url, headers=headers, json=payload, stream=True) as r:
                for chunk in r.iter_content():
                    if chunk:
                        yield f"data: {json.dumps({'interpretation': chunk.decode('utf-8')})}\n\n"

        return Response(stream_with_context(generate()), mimetype='text/event-stream')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) 