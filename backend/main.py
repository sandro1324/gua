from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DivinationRequest(BaseModel):
    hexagram: str
    question: str
    method: str

@app.post("/interpret")
async def interpret_hexagram(req: DivinationRequest):
    try:
        # 这里使用模拟数据，实际应该调用ARK API
        result = f"""
【本卦】乾为天
【变卦】坤为地
【卦辞】天行健，君子以自强不息
【运势分析】根据您的问题"{req.question}"，使用{req.method}法得到的卦象显示：
当前运势较为平稳，建议保持积极进取的态度。
事业方面会有新的机遇，但需要脚踏实地。
感情方面需要多沟通，避免误会。
健康方面注意作息规律，保持良好心态。
"""
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 