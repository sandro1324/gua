console.log("[DEBUG] 数据库已加载");

// 定义塔罗牌数据
const majorArcanaData = {
    "00": {
        id: 0,
        name: "愚者",
        nameCN: "愚者",
        nameEN: "The-Fool",
        type: "major",
        suit: "major",
        image: "00-the-fool.jpg",
        element: "air",
        keywords: ["新开始", "冒险", "纯真"],
        keywordsCN: ["新开始", "冒险", "纯真"],
        keywordsEN: ["New beginnings", "Adventure", "Innocence"],
        meanings: {
            upright: "New beginnings, innocence, spontaneity, free spirit",
            uprightCN: "新的开始、纯真、自发性、自由精神",
            reversed: "Recklessness, risk-taking, naivety, foolishness",
            reversedCN: "鲁莽、冒险、天真、愚蠢"
        }
    },
    // ... 其他大阿卡纳牌
};

const minorArcanaData = {
    wands: {
        "01": {
            id: 1,
            name: "权杖一",
            nameCN: "权杖一",
            nameEN: "Ace-of-Wands",
            type: "minor",
            suit: "wands",
            image: "01-ace-of-wands.jpg",
            element: "fire",
            keywords: ["灵感", "新机会", "创造力"],
            keywordsCN: ["灵感", "新机会", "创造力"],
            keywordsEN: ["Inspiration", "New opportunity", "Creativity"],
            meanings: {
                upright: "Creation, willpower, inspiration, desire",
                uprightCN: "新行动、创造力、灵感、开始",
                reversed: "Lack of energy, lack of passion, delays",
                reversedCN: "拖延、动力不足、激情缺乏"
            }
        }
        // ... 其他权杖牌
    },
    cups: {
        // ... 圣杯牌数据
    },
    swords: {
        // ... 宝剑牌数据
    },
    pentacles: {
        // ... 星币牌数据
    }
};

// 定义牌阵位置配置
const spreadPositionsConfig = {
    'three-card': [
        { nameEN: 'Past', nameCN: '过去' },
        { nameEN: 'Present', nameCN: '现在' },
        { nameEN: 'Future', nameCN: '未来' }
    ],
    'celtic-cross': [
        { nameEN: 'Current Situation' },
        { nameEN: 'Challenge' },
        { nameEN: 'Past' },
        { nameEN: 'Future' },
        { nameEN: 'Above' },
        { nameEN: 'Below' },
        { nameEN: 'Advice' },
        { nameEN: 'External Influences' },
        { nameEN: 'Fears' },
        { nameEN: 'Outcome' }
    ],
    'wheel-of-year': [
        { nameEN: 'January' },
        { nameEN: 'February' },
        { nameEN: 'March' },
        { nameEN: 'April' },
        { nameEN: 'May' },
        { nameEN: 'June' },
        { nameEN: 'July' },
        { nameEN: 'August' },
        { nameEN: 'September' },
        { nameEN: 'October' },
        { nameEN: 'November' },
        { nameEN: 'December' }
    ]
};

// 路径生成函数
function getCardImagePath(card) {
    // 根据卡牌类型确定子目录
    let subDir = '';
    if (card.type === 'major') {
        subDir = 'major';
    } else if (card.type === 'minor') {
        switch (card.suit) {
            case 'cups':
                subDir = 'cups';
                break;
            case 'pentacles':
                subDir = 'pentacles';
                break;
            case 'swords':
                subDir = 'swords';
                break;
            case 'wands':
                subDir = 'wands';
                break;
        }
    }

    // 构建完整的图片路径 (使用相对路径)
    return `./cards/${subDir}/${card.image}`;
}

// 路径验证函数
function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功:', path);
            resolve(true);
        };
        img.onerror = () => {
            console.error('图片加载失败:', path);
            // 尝试备用路径
            const fallbackPath = path.replace('./cards/', '/cards/');
            console.log('尝试备用路径:', fallbackPath);
            
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                console.log('备用路径加载成功:', fallbackPath);
                resolve(true);
            };
            fallbackImg.onerror = (error) => {
                console.error('备用路径也失败:', fallbackPath, error);
                reject(new Error(`图片加载失败: ${path}`));
            };
            fallbackImg.src = fallbackPath;
        };
        img.src = path;
    });
}

// 前端生成塔罗牌解读
function generateTarotReading(question, cardName, position) {
    // 从卡牌数据库获取卡牌信息
    const card = findCardByName(cardName);
    if (!card) {
        return `无法找到卡牌: ${cardName}`;
    }
    
    // 构建基础解读
    let reading = `${card.nameEN} (${card.nameCN}) 在 ${position} 位置的解读:\n\n`;
    reading += `关键词: ${(card.keywordsCN || []).join('、')}\n\n`;
    reading += `正位含义: ${card.meanings.uprightCN}\n\n`;
    
    if (card.meanings.reversedCN) {
        reading += `逆位含义: ${card.meanings.reversedCN}\n\n`;
    }
    
    // 针对问题的个性化解读
    reading += `关于您的问题 "${question}":\n`;
    reading += generatePersonalizedReading(card, position, question);
    
    return reading;
}

// 辅助函数：根据名称查找卡牌
function findCardByName(name) {
    // 搜索大阿卡纳
    for (const id in majorArcanaData) {
        if (majorArcanaData[id].name === name || majorArcanaData[id].nameCN === name) {
            return majorArcanaData[id];
        }
    }
    
    // 搜索小阿卡纳
    for (const suit in minorArcanaData) {
        for (const id in minorArcanaData[suit]) {
            if (minorArcanaData[suit][id].name === name || minorArcanaData[suit][id].nameCN === name) {
                return minorArcanaData[suit][id];
            }
        }
    }
    
    return null;
}

// 生成个性化解读
function generatePersonalizedReading(card, position, question) {
    // 根据卡牌和位置生成基础解读
    const basicReadings = {
        'Past Influence': `这张牌代表了影响您现在处境的过去因素。`,
        'Present Situation': `这张牌反映了您当前所处的状态和面临的挑战。`,
        'Future Potential': `这张牌揭示了可能的未来发展方向。`,
        'Current Situation': `这张牌代表您目前的核心问题。`,
        'Challenge': `这张牌显示了您需要克服的障碍。`,
        'Advice': `这张牌为您提供了应对当前情况的建议。`,
        'Outcome': `这张牌揭示了如果继续当前路径，最可能的结果。`
    };
    
    // 根据卡牌类型添加具体解读
    let reading = basicReadings[position] || `这张牌在${position}位置上。`;
    
    // 针对问题类型进行调整
    if (question.includes('爱情') || question.includes('感情') || question.includes('关系')) {
        reading += getRelationshipReading(card);
    } else if (question.includes('工作') || question.includes('事业') || question.includes('职业')) {
        reading += getCareerReading(card);
    } else if (question.includes('健康') || question.includes('身体')) {
        reading += getHealthReading(card);
    } else if (question.includes('财富') || question.includes('金钱') || question.includes('财务')) {
        reading += getFinanceReading(card);
    } else {
        reading += getGeneralReading(card);
    }
    
    return reading;
}

// 不同主题的解读生成函数
function getRelationshipReading(card) {
    const readings = {
        // 大阿卡纳牌
        "愚者": "您的感情可能正处于一个新的开始阶段，保持开放的心态和对未知的勇气很重要。",
        "魔术师": "您有能力创造理想的关系，但需要明确自己想要什么，并采取行动。",
        "女祭司": "倾听您的直觉，可能有些事情尚未揭示。关系中的神秘元素需要时间来理解。",
        "女皇": "关系中的滋养和情感连接将带来丰富的回报，关注感情的成长和培养。",
        "皇帝": "关系中可能需要更多的结构和清晰的边界，考虑如何建立稳固的基础。",
        
        // 小阿卡纳牌 - 权杖
        "权杖一": "一段充满激情和可能性的新关系正在开始，或现有关系中有新的火花。",
        "权杖二": "您正在为关系做出重要决定，权衡不同选择对未来的影响。",
        
        // 小阿卡纳牌 - 圣杯
        "圣杯一": "新的情感连接或现有关系的更深层次情感正在形成，保持开放的心态。",
        
        // 小阿卡纳牌 - 宝剑
        "宝剑一": "关系中的沟通需要清晰和诚实，避免误解和冲突。",
        
        // 小阿卡纳牌 - 星币
        "星币一": "一段稳定、实际且有潜力长期发展的关系正在形成。"
    };
    
    return readings[card.name] || "这张牌显示您的感情生活正在经历变化，保持开放和适应性很重要。";
}

function getCareerReading(card) {
    const readings = {
        "愚者": "职业上可能有新的开始或机会，不要害怕尝试新的道路。",
        "魔术师": "您拥有实现职业目标所需的技能和资源，现在是采取行动的时候。",
        "女祭司": "在职业决策中，信任您的直觉和内在智慧，可能有些信息尚未显现。",
        "女皇": "创造力和培养项目的能力将带来职业成功，关注成长和发展。",
        "皇帝": "职业中的结构、规划和权威将带来稳定，考虑如何建立坚实的基础。"
    };
    
    return readings[card.name] || "这张牌表明您的职业道路正在发展，保持专注和决心将帮助您实现目标。";
}

function getHealthReading(card) {
    const readings = {
        "愚者": "保持积极的态度对健康有益，尝试新的健康习惯可能带来好处。",
        "魔术师": "您有能力改善健康状况，关注整体健康和生活方式的调整。",
        "女祭司": "倾听身体的信号，可能有些健康问题需要更深入的了解。",
        "女皇": "关注身体和精神的平衡，自然疗法和整体健康方法可能有益。",
        "皇帝": "建立健康的常规和结构将带来长期好处，考虑制定明确的健康计划。"
    };
    
    return readings[card.name] || "这张牌提醒您关注身心平衡，建立健康的习惯将带来长期益处。";
}

function getFinanceReading(card) {
    const readings = {
        "愚者": "财务上可能有新的机会，但也需要谨慎规划和考虑风险。",
        "魔术师": "您有能力创造财务丰裕，关注如何充分利用现有资源。",
        "女祭司": "财务决策需要深思熟虑，可能有些因素尚未完全显现。",
        "女皇": "财务增长和丰裕正在形成，关注可持续的财务发展。",
        "皇帝": "建立稳固的财务结构和计划将带来长期安全，考虑长期投资。"
    };
    
    return readings[card.name] || "这张牌表明您的财务状况正在变化，保持平衡和计划将帮助您实现目标。";
}

function getGeneralReading(card) {
    const readings = {
        "愚者": "您正处于生活的新阶段，保持开放的心态和对未知的勇气将带来成长。",
        "魔术师": "您拥有实现目标所需的所有工具和资源，相信自己的能力。",
        "女祭司": "倾听内在的声音和直觉，深层次的智慧正在引导您。",
        "女皇": "创造力和丰饶正在您的生活中成长，关注滋养和培养。",
        "皇帝": "建立秩序和结构将帮助您实现目标，关注领导力和坚定的决策。"
    };
    
    return readings[card.name] || "这张牌表明您正处于重要的转变期，保持平衡和适应性将帮助您导航变化。";
}

// 统一导出
// 不再使用export语句，而是定义为全局变量
window.majorArcana = majorArcanaData;
window.minorArcana = minorArcanaData;
window.spreadPositions = spreadPositionsConfig;
window.getCardImagePath = getCardImagePath;
window.validateCardPath = validateCardPath;
window.generateTarotReading = generateTarotReading; 