from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from volcenginesdkarkruntime import Ark

app = Flask(__name__)
CORS(app)  # 启用CORS

# 设置API密钥
os.environ["ARK_API_KEY"] = "b8630f89-673f-4ebb-ac6f-821b95442cbf"

# 初始化Ark客户端
client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.environ.get("ARK_API_KEY"),
)

@app.route('/api/tarot-reading', methods=['POST'])
def get_tarot_reading():
    try:
        data = request.json
        question = data.get('question')
        card_name = data.get('card_name')
        position = data.get('position')

        if not all([question, card_name, position]):
            return jsonify({'error': 'Missing required parameters'}), 400

        # 构建提示词
        prompt = f"用户问题：{question}\n抽到卡牌：{card_name}（{position}）"
        
        # 发送请求
        completion = client.chat.completions.create(
            model="ep-20250311174845-dzj2f",
            messages=[
                {
                    "role": "system", 
                    "content": "你是一名塔罗牌分析大师，精通各种塔罗牌并且可以根据用户的问题和塔罗牌的信息给出精准的答案"
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            temperature=1,
            top_p=0.7,
            max_tokens=2025,
            frequency_penalty=0
        )
        
        return jsonify({
            'interpretation': completion.choices[0].message.content
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 