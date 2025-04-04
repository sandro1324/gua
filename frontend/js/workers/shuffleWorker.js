/**
 * 塔罗洗牌工作线程
 * 负责在后台线程中执行复杂的洗牌算法
 */

// 接收主线程消息
self.onmessage = function(e) {
  const { deck, iterations, spreadSize, reversalChance } = e.data;
  
  if (!deck || !Array.isArray(deck)) {
    self.postMessage({ error: '没有提供有效的牌组' });
    return;
  }
  
  try {
    // 执行洗牌
    const result = performShuffle(deck, iterations, spreadSize, reversalChance);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

/**
 * 执行洗牌算法
 * @param {Array} deck - 完整牌组
 * @param {number} iterations - 洗牌次数
 * @param {number} spreadSize - 需要抽取的卡牌数量
 * @param {number} reversalChance - 逆位概率 (0-1)
 * @return {Array} 选中的卡牌
 */
function performShuffle(deck, iterations = 7, spreadSize = 3, reversalChance = 0.3) {
  // 复制牌组以避免修改原始数据
  let shuffledDeck = [...deck];
  
  // 多次洗牌以增加随机性
  for (let i = 0; i < iterations; i++) {
    // 菲舍尔-耶茨洗牌算法
    for (let j = shuffledDeck.length - 1; j > 0; j--) {
      const randomIndex = Math.floor(Math.random() * (j + 1));
      [shuffledDeck[j], shuffledDeck[randomIndex]] = [shuffledDeck[randomIndex], shuffledDeck[j]];
    }
    
    // 随机分割牌组，模拟真实洗牌
    const cutPoint = Math.floor(Math.random() * shuffledDeck.length);
    shuffledDeck = [...shuffledDeck.slice(cutPoint), ...shuffledDeck.slice(0, cutPoint)];
  }
  
  // 抽取所需数量的卡牌
  const selectedCards = shuffledDeck.slice(0, spreadSize);
  
  // 为每张卡牌分配正逆位
  return selectedCards.map(card => {
    // 深拷贝卡牌数据
    const cardCopy = JSON.parse(JSON.stringify(card));
    
    // 根据概率决定是否逆位
    cardCopy.reversed = Math.random() < reversalChance;
    
    return cardCopy;
  });
}

/**
 * 生成元素相关卡牌
 * @param {Array} deck - 完整牌组
 * @param {string} element - 元素类型 (fire, water, air, earth)
 * @param {number} count - 需要抽取的卡牌数量
 * @param {number} reversalChance - 逆位概率 (0-1)
 * @return {Array} 选中的卡牌
 */
function generateElementalReading(deck, element, count = 3, reversalChance = 0.3) {
  if (!element) return performShuffle(deck, 7, count, reversalChance);
  
  // 根据元素筛选相关卡牌
  const elementalCards = deck.filter(card => {
    // 检查卡牌元素属性
    if (card.element && card.element.toLowerCase() === element.toLowerCase()) {
      return true;
    }
    
    // 检查卡牌与元素的其他关联
    if (card.keywords && card.keywords.some(keyword => 
      keyword.toLowerCase().includes(element.toLowerCase())
    )) {
      return true;
    }
    
    return false;
  });
  
  // 如果相关卡牌不足，添加一些随机卡牌
  let selectedPool = elementalCards;
  if (elementalCards.length < count * 2) {
    // 取出非元素相关的卡牌
    const otherCards = deck.filter(card => !elementalCards.includes(card));
    // 随机选择一些非元素相关的卡牌添加到池中
    const additionalCards = performShuffle(otherCards, 3, count * 2).slice(0, count * 2 - elementalCards.length);
    selectedPool = [...elementalCards, ...additionalCards];
  }
  
  // 洗牌并选择指定数量的卡牌
  return performShuffle(selectedPool, 5, count, reversalChance);
}

/**
 * 基于问题类型选择合适的卡牌
 * @param {Array} deck - 完整牌组
 * @param {string} questionType - 问题类型 (love, career, spiritual, general)
 * @param {number} count - 需要抽取的卡牌数量
 * @param {number} reversalChance - 逆位概率 (0-1)
 * @return {Array} 选中的卡牌
 */
function generateQuestionBasedReading(deck, questionType, count = 3, reversalChance = 0.3) {
  // 问题类型与相关关键词映射
  const questionKeywords = {
    love: ['love', 'relationship', 'emotion', 'heart', 'passion', 'partner', 'romance', 
           '爱情', '感情', '伴侣', '浪漫', '心灵'],
    career: ['work', 'career', 'job', 'business', 'success', 'achievement', 'ambition', 
             '工作', '职业', '事业', '成就', '野心', '成功'],
    spiritual: ['spirit', 'soul', 'growth', 'purpose', 'path', 'meaning', 'enlightenment', 
                '灵魂', '成长', '意义', '启迪', '精神', '道路'],
    wealth: ['money', 'wealth', 'abundance', 'prosperity', 'fortune', 'resources',
             '财富', '繁荣', '资源', '金钱', '财运'],
    health: ['health', 'wellness', 'healing', 'body', 'energy', 'vitality',
             '健康', '康复', '能量', '活力', '身体']
  };
  
  // 获取问题类型对应的关键词
  const keywords = questionKeywords[questionType] || [];
  
  if (keywords.length === 0) {
    // 如果没有匹配的问题类型，执行普通洗牌
    return performShuffle(deck, 7, count, reversalChance);
  }
  
  // 根据问题关键词筛选相关卡牌
  const relevantCards = deck.filter(card => {
    if (!card.keywords) return false;
    
    return card.keywords.some(cardKeyword => 
      keywords.some(keyword => 
        cardKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  });
  
  // 如果相关卡牌不足，添加一些随机卡牌
  let selectedPool = relevantCards;
  if (relevantCards.length < count * 2) {
    // The logic is similar to generateElementalReading
    const otherCards = deck.filter(card => !relevantCards.includes(card));
    const additionalCards = performShuffle(otherCards, 3, count * 2).slice(0, count * 2 - relevantCards.length);
    selectedPool = [...relevantCards, ...additionalCards];
  }
  
  // 洗牌并选择指定数量的卡牌
  return performShuffle(selectedPool, 5, count, reversalChance);
} 