/**
 * 塔罗牌解读系统
 * 负责生成牌阵解读、元素分析和多维度解释
 */

// 导入塔罗数据库
import { majorArcana, minorArcana, spreadPositions } from './tarotDB.js';

/**
 * 塔罗解读器
 */
export const tarotInterpreter = {
  /**
   * 基于卡牌和位置生成解读
   * @param {Array} cards - 选中的卡牌
   * @param {string} spreadType - 牌阵类型
   * @param {string} language - 语言 ('cn' 或 'en')
   * @return {Object} 解读结果
   */
  generateReading(cards, spreadType, language = 'cn') {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return { error: language === 'cn' ? '没有提供卡牌数据' : 'No card data provided' };
    }
    
    // 获取牌阵位置信息
    const spread = spreadPositions[spreadType] || spreadPositions.threeCard;
    
    // 扩展卡牌数据，添加位置意义
    const readingCards = cards.map((card, index) => {
      // 确保不超出牌阵位置定义
      const position = index < spread.positions.length ? 
                       spread.positions[index] : 
                       { name: `Position ${index + 1}`, nameEn: `Position ${index + 1}` };
      
      return {
        ...card,
        position: language === 'cn' ? position.name : position.nameEn,
        positionMeaning: language === 'cn' ? position.meaning : position.meaningEn
      };
    });
    
    // 生成整体解读
    const overallReading = this.generateOverallReading(readingCards, language);
    
    // 生成每张卡牌的详细解读
    const cardReadings = readingCards.map(card => 
      this.generateCardReading(card, language)
    );
    
    // 构建完整解读结果
    return {
      type: spreadType,
      title: language === 'cn' ? spread.name : spread.nameEn,
      description: language === 'cn' ? spread.description : spread.descriptionEn,
      overallReading,
      cards: readingCards,
      cardReadings
    };
  },
  
  /**
   * 生成整体牌阵解读
   * @param {Array} cards - 卡牌数据
   * @param {string} language - 语言
   * @return {string} 整体解读
   */
  generateOverallReading(cards, language) {
    // 计算主要元素分布
    const elements = this.analyzeElementalDistribution(cards);
    const dominantElement = Object.entries(elements)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // 检查重复牌
    const repeatedSuits = this.findRepeatedSuits(cards);
    const repeatedNumbers = this.findRepeatedNumbers(cards);
    
    // 检查主要主题
    const majorThemes = this.identifyMajorThemes(cards, language);
    
    // 生成基于上述分析的整体解读
    let reading = '';
    
    if (language === 'cn') {
      reading += `这个塔罗牌阵呈现出${dominantElement}能量的主导，`;
      
      if (repeatedSuits.length > 0) {
        reading += `多张${repeatedSuits.join('和')}牌的出现表明`;
        reading += this.getSuitThemeMessage(repeatedSuits[0], language) + '。';
      }
      
      if (repeatedNumbers.length > 0) {
        reading += `数字${repeatedNumbers.join('和')}的重复出现强调了`;
        reading += this.getNumberThemeMessage(repeatedNumbers[0], language) + '。';
      }
      
      reading += `整体上，这个牌阵揭示了关于${majorThemes.join('、')}的重要信息。`;
    } else {
      reading += `This tarot spread reveals a dominant ${this.translateElementToEn(dominantElement)} energy. `;
      
      if (repeatedSuits.length > 0) {
        reading += `The presence of multiple ${this.translateSuitToEn(repeatedSuits[0])} cards suggests `;
        reading += this.getSuitThemeMessage(repeatedSuits[0], language) + '. ';
      }
      
      if (repeatedNumbers.length > 0) {
        reading += `The repetition of number ${repeatedNumbers.join(' and ')} emphasizes `;
        reading += this.getNumberThemeMessage(repeatedNumbers[0], language) + '. ';
      }
      
      reading += `Overall, this spread reveals important information about ${majorThemes.join(', ')}.`;
    }
    
    return reading;
  },
  
  /**
   * 生成单张卡牌解读
   * @param {Object} card - 卡牌数据
   * @param {string} language - 语言
   * @return {Object} 卡牌解读
   */
  generateCardReading(card, language) {
    const isReversed = card.reversed;
    const meanings = isReversed ? card.meaningsRev : card.meanings;
    const meaningsEn = isReversed ? card.meaningsRevEn : card.meaningsEn;
    
    // 基本解读
    const basicReading = language === 'cn' 
      ? `${card.name}在${card.position}位置上表示${isReversed ? '逆位' : '正位'}，意味着${this.getRandomItem(meanings)}`
      : `The ${card.nameEn} in the ${card.position} position appears ${isReversed ? 'reversed' : 'upright'}, meaning ${this.getRandomItem(meaningsEn)}`;
    
    // 元素分析
    const elementalAnalysis = this.generateElementalAnalysis(card, language);
    
    // 精神指引
    const spiritualGuidance = this.generateSpiritualGuidance(card, language);
    
    // 历史背景
    const historicalContext = this.generateHistoricalContext(card, language);
    
    return {
      id: card.id,
      name: language === 'cn' ? card.name : card.nameEn,
      isReversed,
      position: card.position,
      positionMeaning: card.positionMeaning,
      basicReading,
      elementalAnalysis,
      spiritualGuidance,
      historicalContext
    };
  },
  
  /**
   * 生成元素分析
   * @param {Object} card - 卡牌数据
   * @param {string} language - 语言
   * @return {string} 元素分析
   */
  generateElementalAnalysis(card, language) {
    const element = card.element || this.getSuitElement(card.suit);
    
    if (language === 'cn') {
      return `这张牌与${element}元素相关联，代表${this.getElementDescription(element, language)}。
      在当前情境下，这种能量${card.reversed ? '可能受阻或内向' : '流动自如'}，
      建议您${this.getElementAdvice(element, card.reversed, language)}。`;
    } else {
      const enElement = this.translateElementToEn(element);
      return `This card is associated with the element of ${enElement}, representing ${this.getElementDescription(element, language)}.
      In the current context, this energy is ${card.reversed ? 'possibly blocked or internalized' : 'flowing freely'}.
      It is recommended that you ${this.getElementAdvice(element, card.reversed, language)}.`;
    }
  },
  
  /**
   * 生成精神指引
   * @param {Object} card - 卡牌数据
   * @param {string} language - 语言
   * @return {string} 精神指引
   */
  generateSpiritualGuidance(card, language) {
    const keywords = language === 'cn' ? card.keywords : card.keywordsEn;
    const selectedKeyword = this.getRandomItem(keywords);
    
    if (language === 'cn') {
      return `从精神层面看，${card.name}提醒您关注"${selectedKeyword}"的能量。
      尝试通过冥想、反思或日记来探索这一主题在您生活中的意义。
      ${card.reversed ? '注意内在阻碍和自我限制的模式。' : '保持开放的心态，接纳这种能量的指引。'}`;
    } else {
      return `From a spiritual perspective, the ${card.nameEn} reminds you to focus on the energy of "${selectedKeyword}".
      Try exploring the significance of this theme in your life through meditation, reflection, or journaling.
      ${card.reversed ? 'Pay attention to patterns of inner resistance and self-limitation.' : 'Maintain an open mind and embrace the guidance of this energy.'}`;
    }
  },
  
  /**
   * 生成历史背景
   * @param {Object} card - 卡牌数据
   * @param {string} language - 语言
   * @return {string} 历史背景
   */
  generateHistoricalContext(card, language) {
    // 根据卡牌生成历史背景信息
    if (language === 'cn') {
      if (card.arcana === 'major') {
        return `${card.name}是主牌阵中的第${card.number}张牌，在塔罗历史中代表着重要的原型象征。
        这张牌的形象可追溯到中世纪欧洲，象征着${this.getMajorArcanaSymbolism(card.number, language)}。
        历史上，这张牌常被用于${this.getMajorArcanaHistoricalUse(card.number, language)}。`;
      } else {
        return `作为小牌阵中${card.suit}组的一部分，这张牌反映了日常生活中的${this.getSuitMeaning(card.suit, language)}。
        在传统塔罗解读中，它与${this.getMinorArcanaAssociations(card.suit, card.value, language)}有关。
        不同文化对这张牌有着不同的诠释，但核心象征保持一致。`;
      }
    } else {
      if (card.arcana === 'major') {
        return `The ${card.nameEn} is the ${card.number}th card in the Major Arcana, representing an important archetypal symbol in tarot history.
        The imagery of this card can be traced back to medieval Europe, symbolizing ${this.getMajorArcanaSymbolism(card.number, language)}.
        Historically, this card was often used for ${this.getMajorArcanaHistoricalUse(card.number, language)}.`;
      } else {
        const suitEn = this.translateSuitToEn(card.suit);
        return `As part of the ${suitEn} suit in the Minor Arcana, this card reflects ${this.getSuitMeaning(card.suit, language)} in everyday life.
        In traditional tarot interpretation, it is associated with ${this.getMinorArcanaAssociations(card.suit, card.value, language)}.
        Different cultures have varied interpretations of this card, but the core symbolism remains consistent.`;
      }
    }
  },
  
  /**
   * 分析卡牌元素分布
   * @param {Array} cards - 卡牌数据
   * @return {Object} 元素分布
   */
  analyzeElementalDistribution(cards) {
    const elements = {
      '火': 0,
      '水': 0,
      '风': 0,
      '土': 0,
      '精神': 0
    };
    
    cards.forEach(card => {
      let element = card.element;
      
      // 如果没有直接元素标记，通过花色推断
      if (!element && card.suit) {
        element = this.getSuitElement(card.suit);
      }
      
      // 大阿卡纳默认为精神元素，除非另有说明
      if (!element && card.arcana === 'major') {
        element = '精神';
      }
      
      // 如果确定了元素，增加计数
      if (element && elements[element] !== undefined) {
        elements[element]++;
      }
    });
    
    return elements;
  },
  
  /**
   * 查找重复花色
   * @param {Array} cards - 卡牌数据
   * @return {Array} 重复花色列表
   */
  findRepeatedSuits(cards) {
    const suitCounts = {};
    
    // 统计每种花色的出现次数
    cards.forEach(card => {
      if (card.suit) {
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
      }
    });
    
    // 找出出现多次的花色
    return Object.entries(suitCounts)
      .filter(([_, count]) => count > 1)
      .map(([suit, _]) => suit);
  },
  
  /**
   * 查找重复数字
   * @param {Array} cards - 卡牌数据
   * @return {Array} 重复数字列表
   */
  findRepeatedNumbers(cards) {
    const numberCounts = {};
    
    // 统计每个数字的出现次数
    cards.forEach(card => {
      if (card.value) {
        numberCounts[card.value] = (numberCounts[card.value] || 0) + 1;
      }
    });
    
    // 找出出现多次的数字
    return Object.entries(numberCounts)
      .filter(([_, count]) => count > 1)
      .map(([number, _]) => number);
  },
  
  /**
   * 识别主要主题
   * @param {Array} cards - 卡牌数据
   * @param {string} language - 语言
   * @return {Array} 主题列表
   */
  identifyMajorThemes(cards, language) {
    // 分析所有卡牌关键词，找出最常见的主题
    const keywordCounts = {};
    
    cards.forEach(card => {
      const keywords = language === 'cn' ? card.keywords : card.keywordsEn;
      
      if (keywords && Array.isArray(keywords)) {
        keywords.forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      }
    });
    
    // 找出出现最多的3个关键词作为主题
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keyword, _]) => keyword);
  },
  
  /**
   * 获取花色对应元素
   * @param {string} suit - 花色
   * @return {string} 元素
   */
  getSuitElement(suit) {
    const suitElements = {
      '权杖': '火',
      '圣杯': '水',
      '宝剑': '风',
      '星币': '土'
    };
    
    return suitElements[suit] || '精神';
  },
  
  /**
   * 获取花色主题信息
   * @param {string} suit - 花色
   * @param {string} language - 语言
   * @return {string} 主题信息
   */
  getSuitThemeMessage(suit, language) {
    const themes = {
      '权杖': {
        cn: '您的生活中充满激情和创造力的能量',
        en: 'passionate and creative energy in your life'
      },
      '圣杯': {
        cn: '情感和关系方面的重要发展',
        en: 'significant developments in emotions and relationships'
      },
      '宝剑': {
        cn: '思维和沟通方面的挑战或突破',
        en: 'challenges or breakthroughs in thought and communication'
      },
      '星币': {
        cn: '物质和实际问题的稳定性和成长',
        en: 'stability and growth in material and practical matters'
      }
    };
    
    const theme = themes[suit] || { cn: '多方面的能量平衡', en: 'a balance of energies in multiple areas' };
    return language === 'cn' ? theme.cn : theme.en;
  },
  
  /**
   * 获取数字主题信息
   * @param {string} number - 数字
   * @param {string} language - 语言
   * @return {string} 主题信息
   */
  getNumberThemeMessage(number, language) {
    const themes = {
      '1': {
        cn: '新的开始和机会',
        en: 'new beginnings and opportunities'
      },
      '2': {
        cn: '平衡、合作与决策',
        en: 'balance, cooperation, and decision-making'
      },
      '3': {
        cn: '创造力和社交表达',
        en: 'creativity and social expression'
      },
      '4': {
        cn: '稳定性和建立基础',
        en: 'stability and foundation building'
      },
      '5': {
        cn: '变化和适应性挑战',
        en: 'change and adaptive challenges'
      },
      '6': {
        cn: '和谐、责任与滋养',
        en: 'harmony, responsibility, and nurturing'
      },
      '7': {
        cn: '内省、分析与精神探索',
        en: 'introspection, analysis, and spiritual exploration'
      },
      '8': {
        cn: '力量、成就与物质成功',
        en: 'strength, achievement, and material success'
      },
      '9': {
        cn: '完成、整合与智慧',
        en: 'completion, integration, and wisdom'
      },
      '10': {
        cn: '周期的完成和新周期的开始',
        en: 'completion of cycles and beginning of new ones'
      }
    };
    
    const theme = themes[number] || { cn: '重要的生命周期', en: 'significant life cycles' };
    return language === 'cn' ? theme.cn : theme.en;
  },
  
  /**
   * 获取元素描述
   * @param {string} element - 元素
   * @param {string} language - 语言
   * @return {string} 元素描述
   */
  getElementDescription(element, language) {
    const descriptions = {
      '火': {
        cn: '热情、活力、创造力和转变',
        en: 'passion, vitality, creativity, and transformation'
      },
      '水': {
        cn: '情感、直觉、流动性和潜意识',
        en: 'emotions, intuition, fluidity, and the subconscious'
      },
      '风': {
        cn: '思想、沟通、清晰度和变化',
        en: 'thought, communication, clarity, and change'
      },
      '土': {
        cn: '物质、稳定性、实用性和持久性',
        en: 'materiality, stability, practicality, and persistence'
      },
      '精神': {
        cn: '超越普通层面的灵性力量和指引',
        en: 'spiritual forces and guidance beyond the ordinary plane'
      }
    };
    
    const description = descriptions[element] || { cn: '多元力量的融合', en: 'a fusion of multiple forces' };
    return language === 'cn' ? description.cn : description.en;
  },
  
  /**
   * 获取元素建议
   * @param {string} element - 元素
   * @param {boolean} isReversed - 是否逆位
   * @param {string} language - 语言
   * @return {string} 建议
   */
  getElementAdvice(element, isReversed, language) {
    const advice = {
      '火': {
        normal: {
          cn: '跟随您的激情，积极采取行动，但避免鲁莽',
          en: 'follow your passion, take active steps, but avoid being reckless'
        },
        reversed: {
          cn: '寻找内在动力，避免怠惰，重新点燃您的热情',
          en: 'search for inner motivation, avoid lethargy, and reignite your passion'
        }
      },
      '水': {
        normal: {
          cn: '信任您的直觉，探索情感，保持流动性',
          en: 'trust your intuition, explore emotions, and maintain fluidity'
        },
        reversed: {
          cn: '面对被压抑的情感，寻求情感上的清晰度',
          en: 'face repressed emotions and seek emotional clarity'
        }
      },
      '风': {
        normal: {
          cn: '保持思路清晰，寻求真相，有效沟通',
          en: 'maintain clear thinking, seek truth, and communicate effectively'
        },
        reversed: {
          cn: '降低心智噪音，避免过度分析，寻找内在真相',
          en: 'reduce mental noise, avoid over-analysis, and find inner truth'
        }
      },
      '土': {
        normal: {
          cn: '建立实际基础，踏实行动，耐心等待成果',
          en: 'build practical foundations, take grounded action, and patiently await results'
        },
        reversed: {
          cn: '评估物质障碍，重新构建稳定性，回归基本需求',
          en: 'evaluate material obstacles, rebuild stability, and return to basic needs'
        }
      },
      '精神': {
        normal: {
          cn: '关注更高层次的指引，寻求灵性连接，信任宇宙计划',
          en: 'pay attention to higher guidance, seek spiritual connection, and trust the cosmic plan'
        },
        reversed: {
          cn: '审视灵性阻碍，重新连接内在指南针，打破自我限制',
          en: 'examine spiritual blockages, reconnect with your inner compass, and break self-limitations'
        }
      }
    };
    
    const elementAdvice = advice[element] || advice['精神'];
    const state = isReversed ? 'reversed' : 'normal';
    
    return language === 'cn' ? elementAdvice[state].cn : elementAdvice[state].en;
  },
  
  /**
   * 获取大阿卡纳象征意义
   * @param {number} number - 卡牌编号
   * @param {string} language - 语言
   * @return {string} 象征意义
   */
  getMajorArcanaSymbolism(number, language) {
    // 简化版，实际应用中可以扩展为完整的大阿卡纳牌象征
    const symbolisms = {
      0: { cn: '新的旅程和无限可能', en: 'new journeys and infinite possibilities' },
      1: { cn: '意识和创造力的开始', en: 'the beginning of consciousness and creativity' },
      2: { cn: '直觉和隐藏的知识', en: 'intuition and hidden knowledge' },
      // 更多卡牌象征可以在这里添加
    };
    
    const defaultSymbolism = { cn: '重要的生命原型和转变', en: 'important life archetypes and transformations' };
    const symbolism = symbolisms[number] || defaultSymbolism;
    
    return language === 'cn' ? symbolism.cn : symbolism.en;
  },
  
  /**
   * 获取大阿卡纳历史用途
   * @param {number} number - 卡牌编号
   * @param {string} language - 语言
   * @return {string} 历史用途
   */
  getMajorArcanaHistoricalUse(number, language) {
    // 简化版，实际应用中可以添加更具体的历史内容
    const uses = {
      cn: [
        '指引精神旅程',
        '预测重大生活转变',
        '作为冥想和内省的焦点',
        '代表宇宙和灵魂的演化阶段'
      ],
      en: [
        'guiding spiritual journeys',
        'forecasting major life transitions',
        'serving as a focus for meditation and introspection',
        'representing stages in cosmic and soul evolution'
      ]
    };
    
    // 随机选择一个用途，在实际应用中可以根据卡牌编号选择特定的历史用途
    const useList = language === 'cn' ? uses.cn : uses.en;
    return this.getRandomItem(useList);
  },
  
  /**
   * 获取小阿卡纳花色意义
   * @param {string} suit - 花色
   * @param {string} language - 语言
   * @return {string} 意义
   */
  getSuitMeaning(suit, language) {
    const meanings = {
      '权杖': {
        cn: '热情、行动、创意与能量',
        en: 'passion, action, creativity, and energy'
      },
      '圣杯': {
        cn: '情感、关系、直觉与爱',
        en: 'emotions, relationships, intuition, and love'
      },
      '宝剑': {
        cn: '思想、挑战、清晰度与沟通',
        en: 'thoughts, challenges, clarity, and communication'
      },
      '星币': {
        cn: '物质、财务、实用性与稳定',
        en: 'material matters, finances, practicality, and stability'
      }
    };
    
    const meaning = meanings[suit] || { cn: '多元素质的结合', en: 'a combination of various qualities' };
    return language === 'cn' ? meaning.cn : meaning.en;
  },
  
  /**
   * 获取小阿卡纳关联
   * @param {string} suit - 花色
   * @param {string} value - 数值
   * @param {string} language - 语言
   * @return {string} 关联
   */
  getMinorArcanaAssociations(suit, value, language) {
    // 简化版，实际应用中可以添加更具体的关联
    const associations = {
      cn: [
        '日常生活的实际体验',
        '生命周期的特定阶段',
        '内在和外在世界的互动',
        '人类共同的情感体验',
        '生活中的挑战和成长机会'
      ],
      en: [
        'practical experiences in daily life',
        'specific stages in life cycles',
        'interactions between inner and outer worlds',
        'common emotional experiences of humanity',
        'challenges and growth opportunities in life'
      ]
    };
    
    // 随机选择一个关联，在实际应用中可以根据花色和数值选择特定的关联
    const associationList = language === 'cn' ? associations.cn : associations.en;
    return this.getRandomItem(associationList);
  },
  
  /**
   * 将元素翻译为英文
   * @param {string} element - 中文元素
   * @return {string} 英文元素
   */
  translateElementToEn(element) {
    const translations = {
      '火': 'Fire',
      '水': 'Water',
      '风': 'Air',
      '土': 'Earth',
      '精神': 'Spirit'
    };
    
    return translations[element] || 'Mixed Energy';
  },
  
  /**
   * 将花色翻译为英文
   * @param {string} suit - 中文花色
   * @return {string} 英文花色
   */
  translateSuitToEn(suit) {
    const translations = {
      '权杖': 'Wands',
      '圣杯': 'Cups',
      '宝剑': 'Swords',
      '星币': 'Pentacles'
    };
    
    return translations[suit] || suit;
  },
  
  /**
   * 从数组中随机获取一个元素
   * @param {Array} arr - 数组
   * @return {*} 随机元素
   */
  getRandomItem(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return '';
    }
    
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}; 