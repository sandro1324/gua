export default async (req, res) => {
  // 请求方法验证
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // 验证请求体
  if (!req.body || !req.body.question || !req.body.cards) {
    return res.status(400).json({ error: '无效的请求数据' });
  }

  try {
    // 从环境变量获取敏感信息
    const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
    const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

    if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
      throw new Error('环境变量未正确配置');
    }

    // 1. 获取现有数据
    const currentRes = await fetch(
      `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
      { 
        headers: { 
          'X-Master-Key': JSONBIN_API_KEY,
          'X-Bin-Meta': false
        }
      }
    );

    if (!currentRes.ok) {
      throw new Error('获取现有数据失败');
    }

    const currentData = await currentRes.json();

    // 2. 构建新数据
    const newData = {
      readings: [
        ...(currentData.readings || []),
        {
          timestamp: new Date().toISOString(),
          question: req.body.question,
          cards: req.body.cards
        }
      ]
    };

    // 3. 更新到 JSONBin.io
    const updateRes = await fetch(
      `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY,
          'X-Bin-Versioning': false
        },
        body: JSON.stringify(newData)
      }
    );

    if (!updateRes.ok) {
      throw new Error('更新数据失败');
    }

    // 4. 返回处理结果
    const result = await updateRes.json();
    res.status(200).json({ 
      success: true, 
      message: '记录保存成功',
      data: result 
    });
    
  } catch (error) {
    console.error('代理接口错误:', error);
    res.status(500).json({ 
      error: '保存失败', 
      message: error.message 
    });
  }
}; 