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
    "01": {
        id: 1,
        name: "魔术师",
        nameCN: "魔术师",
        nameEN: "The-Magician",
        type: "major",
        suit: "major",
        image: "01-the-magician.jpg",
        element: "air",
        keywords: ["意志力", "专注", "技能"],
        keywordsCN: ["意志力", "专注", "技能"],
        keywordsEN: ["Willpower", "Focus", "Skill"],
        meanings: {
            upright: "Manifestation, resourcefulness, power, inspired action",
            uprightCN: "显化、足智多谋、力量、受启发的行动",
            reversed: "Manipulation, poor planning, untapped talents",
            reversedCN: "操纵、计划不周、未开发的才能"
        }
    },
    "02": {
        id: 2,
        name: "女祭司",
        nameCN: "女祭司",
        nameEN: "The-High-Priestess",
        type: "major",
        suit: "major",
        image: "02-the-high-priestess.jpg",
        element: "water",
        keywords: ["直觉", "神秘", "潜意识"],
        keywordsCN: ["直觉", "神秘", "潜意识"],
        keywordsEN: ["Intuition", "Mystery", "Subconscious"],
        meanings: {
            upright: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
            uprightCN: "直觉、神圣知识、神圣女性、潜意识",
            reversed: "Secrets, disconnected from intuition, withdrawal and silence",
            reversedCN: "秘密、与直觉断开、退缩和沉默"
        }
    },
    "03": {
        id: 3,
        name: "女皇",
        nameCN: "女皇",
        nameEN: "The-Empress",
        type: "major",
        suit: "major",
        image: "03-the-empress.jpg",
        element: "earth",
        keywords: ["丰饶", "母性", "创造力"],
        keywordsCN: ["丰饶", "母性", "创造力"],
        keywordsEN: ["Abundance", "Motherhood", "Creativity"],
        meanings: {
            upright: "Feminine power, beauty, nature, nurturing, abundance",
            uprightCN: "女性力量、美丽、自然、滋养、丰饶",
            reversed: "Creative block, dependence on others",
            reversedCN: "创造力受阻、依赖他人"
        }
    },
    "04": {
        id: 4,
        name: "皇帝",
        nameCN: "皇帝",
        nameEN: "The-Emperor",
        type: "major",
        suit: "major",
        image: "04-the-emperor.jpg",
        element: "fire",
        keywords: ["权威", "结构", "控制"],
        keywordsCN: ["权威", "结构", "控制"],
        keywordsEN: ["Authority", "Structure", "Control"],
        meanings: {
            upright: "Authority, establishment, structure, a father figure",
            uprightCN: "权威、建立、结构、父亲形象",
            reversed: "Tyranny, rigidity, coldness",
            reversedCN: "暴政、僵化、冷漠"
        }
    },
    "05": {
        id: 5,
        name: "教皇",
        nameCN: "教皇",
        nameEN: "The-Hierophant",
        type: "major",
        suit: "major",
        image: "05-the-hierophant.jpg",
        element: "earth",
        keywords: ["传统", "信仰", "教育"],
        keywordsCN: ["传统", "信仰", "教育"],
        keywordsEN: ["Tradition", "Faith", "Education"],
        meanings: {
            upright: "Conventional wisdom, education, spiritual guidance",
            uprightCN: "传统智慧、教育、精神指导",
            reversed: "Personal beliefs, freedom, challenging the status quo",
            reversedCN: "个人信仰、自由、挑战现状"
        }
    },
    "06": {
        id: 6,
        name: "恋人",
        nameCN: "恋人",
        nameEN: "The-Lovers",
        type: "major",
        suit: "major",
        image: "06-the-lovers.jpg",
        element: "air",
        keywords: ["选择", "关系", "和谐"],
        keywordsCN: ["选择", "关系", "和谐"],
        keywordsEN: ["Choice", "Relationships", "Harmony"],
        meanings: {
            upright: "Love, harmony, relationships, values alignment",
            uprightCN: "爱情、和谐、关系、价值观一致",
            reversed: "Self-love, disharmony, imbalance, misalignment of values",
            reversedCN: "自我关爱、不和谐、失衡、价值观不一致"
        }
    },
    "07": {
        id: 7,
        name: "战车",
        nameCN: "战车",
        nameEN: "The-Chariot",
        type: "major",
        suit: "major",
        image: "07-the-chariot.jpg",
        element: "water",
        keywords: ["胜利", "意志力", "前进"],
        keywordsCN: ["胜利", "意志力", "前进"],
        keywordsEN: ["Victory", "Willpower", "Advancement"],
        meanings: {
            upright: "Control, willpower, success, action, determination",
            uprightCN: "控制、意志力、成功、行动、决心",
            reversed: "Self-discipline, opposition, lack of direction",
            reversedCN: "自律、对立、缺乏方向"
        }
    },
    "08": {
        id: 8,
        name: "力量",
        nameCN: "力量",
        nameEN: "Strength",
        type: "major",
        suit: "major",
        image: "08-strength.jpg",
        element: "fire",
        keywords: ["勇气", "耐心", "控制"],
        keywordsCN: ["勇气", "耐心", "控制"],
        keywordsEN: ["Courage", "Patience", "Control"],
        meanings: {
            upright: "Inner strength, bravery, compassion, focus",
            uprightCN: "内在力量、勇敢、同情、专注",
            reversed: "Self-doubt, weakness, insecurity",
            reversedCN: "自我怀疑、软弱、不安全感"
        }
    },
    "09": {
        id: 9,
        name: "隐士",
        nameCN: "隐士",
        nameEN: "The-Hermit",
        type: "major",
        suit: "major",
        image: "09-the-hermit.jpg",
        element: "earth",
        keywords: ["内省", "孤独", "智慧"],
        keywordsCN: ["内省", "孤独", "智慧"],
        keywordsEN: ["Introspection", "Solitude", "Wisdom"],
        meanings: {
            upright: "Soul-searching, introspection, being alone, inner guidance",
            uprightCN: "灵魂探索、内省、独处、内在指引",
            reversed: "Isolation, loneliness, withdrawal",
            reversedCN: "孤立、孤独、退缩"
        }
    },
    "10": {
        id: 10,
        name: "命运之轮",
        nameCN: "命运之轮",
        nameEN: "Wheel-of-Fortune",
        type: "major",
        suit: "major",
        image: "10-wheel-of-fortune.jpg",
        element: "fire",
        keywords: ["变化", "命运", "机遇"],
        keywordsCN: ["变化", "命运", "机遇"],
        keywordsEN: ["Change", "Fate", "Opportunity"],
        meanings: {
            upright: "Change, cycles, inevitable fate, turning points",
            uprightCN: "变化、循环、不可避免的命运、转折点",
            reversed: "No control, clinging to control, bad luck",
            reversedCN: "无法控制、试图控制、厄运"
        }
    },
    "11": {
        id: 11,
        name: "正义",
        nameCN: "正义",
        nameEN: "Justice",
        type: "major",
        suit: "major",
        image: "11-justice.jpg",
        element: "air",
        keywords: ["公正", "因果", "平衡"],
        keywordsCN: ["公正", "因果", "平衡"],
        keywordsEN: ["Justice", "Karma", "Balance"],
        meanings: {
            upright: "Justice, fairness, truth, cause and effect",
            uprightCN: "正义、公平、真相、因果",
            reversed: "Unfairness, lack of accountability, dishonesty",
            reversedCN: "不公、缺乏责任感、不诚实"
        }
    },
    "12": {
        id: 12,
        name: "倒吊人",
        nameCN: "倒吊人",
        nameEN: "The-Hanged-Man",
        type: "major",
        suit: "major",
        image: "12-the-hanged-man.jpg",
        element: "water",
        keywords: ["牺牲", "等待", "新视角"],
        keywordsCN: ["牺牲", "等待", "新视角"],
        keywordsEN: ["Sacrifice", "Waiting", "New Perspective"],
        meanings: {
            upright: "Pause, surrender, letting go, new perspectives",
            uprightCN: "暂停、屈服、放手、新视角",
            reversed: "Delays, resistance, stalling, indecision",
            reversedCN: "延迟、抗拒、拖延、犹豫不决"
        }
    },
    "13": {
        id: 13,
        name: "死神",
        nameCN: "死神",
        nameEN: "Death",
        type: "major",
        suit: "major",
        image: "13-death.jpg",
        element: "water",
        keywords: ["结束", "转变", "重生"],
        keywordsCN: ["结束", "转变", "重生"],
        keywordsEN: ["Endings", "Change", "Rebirth"],
        meanings: {
            upright: "Endings, beginnings, change, transformation",
            uprightCN: "结束、开始、变化、转变",
            reversed: "Fear of change, holding on, stagnation",
            reversedCN: "害怕改变、执着、停滞"
        }
    },
    "14": {
        id: 14,
        name: "节制",
        nameCN: "节制",
        nameEN: "Temperance",
        type: "major",
        suit: "major",
        image: "14-temperance.jpg",
        element: "fire",
        keywords: ["平衡", "调和", "耐心"],
        keywordsCN: ["平衡", "调和", "耐心"],
        keywordsEN: ["Balance", "Moderation", "Patience"],
        meanings: {
            upright: "Balance, moderation, patience, purpose",
            uprightCN: "平衡、节制、耐心、目标",
            reversed: "Imbalance, excess, lack of long-term vision",
            reversedCN: "失衡、过度、缺乏长远眼光"
        }
    },
    "15": {
        id: 15,
        name: "恶魔",
        nameCN: "恶魔",
        nameEN: "The-Devil",
        type: "major",
        suit: "major",
        image: "15-the-devil.jpg",
        element: "earth",
        keywords: ["束缚", "物质", "欲望"],
        keywordsCN: ["束缚", "物质", "欲望"],
        keywordsEN: ["Bondage", "Materialism", "Desire"],
        meanings: {
            upright: "Addiction, materialism, playfulness",
            uprightCN: "成瘾、物质主义、玩乐",
            reversed: "Freedom, release, restoring control",
            reversedCN: "自由、释放、重获控制"
        }
    },
    "16": {
        id: 16,
        name: "高塔",
        nameCN: "高塔",
        nameEN: "The-Tower",
        type: "major",
        suit: "major",
        image: "16-the-tower.jpg",
        element: "fire",
        keywords: ["突变", "破坏", "启示"],
        keywordsCN: ["突变", "破坏", "启示"],
        keywordsEN: ["Sudden Change", "Disruption", "Revelation"],
        meanings: {
            upright: "Sudden change, upheaval, chaos, revelation",
            uprightCN: "突然的变化、剧变、混乱、启示",
            reversed: "Personal transformation, fear of change, averting disaster",
            reversedCN: "个人转变、害怕改变、避免灾难"
        }
    },
    "17": {
        id: 17,
        name: "星星",
        nameCN: "星星",
        nameEN: "The-Star",
        type: "major",
        suit: "major",
        image: "17-the-star.jpg",
        element: "air",
        keywords: ["希望", "灵感", "平静"],
        keywordsCN: ["希望", "灵感", "平静"],
        keywordsEN: ["Hope", "Inspiration", "Peace"],
        meanings: {
            upright: "Hope, faith, purpose, renewal",
            uprightCN: "希望、信念、目标、更新",
            reversed: "Faithlessness, discouragement, insecurity",
            reversedCN: "缺乏信念、气馁、不安全感"
        }
    },
    "18": {
        id: 18,
        name: "月亮",
        nameCN: "月亮",
        nameEN: "The-Moon",
        type: "major",
        suit: "major",
        image: "18-the-moon.jpg",
        element: "water",
        keywords: ["幻觉", "潜意识", "不安"],
        keywordsCN: ["幻觉", "潜意识", "不安"],
        keywordsEN: ["Illusion", "Subconscious", "Anxiety"],
        meanings: {
            upright: "Illusion, fear, anxiety, subconscious",
            uprightCN: "幻觉、恐惧、焦虑、潜意识",
            reversed: "Release of fear, repressed emotion, inner confusion",
            reversedCN: "释放恐惧、压抑的情绪、内心混乱"
        }
    },
    "19": {
        id: 19,
        name: "太阳",
        nameCN: "太阳",
        nameEN: "The-Sun",
        type: "major",
        suit: "major",
        image: "19-the-sun.jpg",
        element: "fire",
        keywords: ["快乐", "成功", "活力"],
        keywordsCN: ["快乐", "成功", "活力"],
        keywordsEN: ["Joy", "Success", "Vitality"],
        meanings: {
            upright: "Joy, success, celebration, positivity",
            uprightCN: "快乐、成功、庆祝、积极",
            reversed: "Inner child, feeling down, overly optimistic",
            reversedCN: "内在小孩、情绪低落、过度乐观"
        }
    },
    "20": {
        id: 20,
        name: "审判",
        nameCN: "审判",
        nameEN: "Judgement",
        type: "major",
        suit: "major",
        image: "20-judgement.jpg",
        element: "fire",
        keywords: ["觉醒", "重生", "决定"],
        keywordsCN: ["觉醒", "重生", "决定"],
        keywordsEN: ["Awakening", "Rebirth", "Decision"],
        meanings: {
            upright: "Reflection, reckoning, awakening",
            uprightCN: "反思、清算、觉醒",
            reversed: "Lack of self awareness, doubt, self-loathing",
            reversedCN: "缺乏自我意识、怀疑、自我厌恶"
        }
    },
    "21": {
        id: 21,
        name: "世界",
        nameCN: "世界",
        nameEN: "The-World",
        type: "major",
        suit: "major",
        image: "21-the-world.jpg",
        element: "earth",
        keywords: ["完成", "成就", "圆满"],
        keywordsCN: ["完成", "成就", "圆满"],
        keywordsEN: ["Completion", "Achievement", "Fulfillment"],
        meanings: {
            upright: "Completion, integration, accomplishment, travel",
            uprightCN: "完成、整合、成就、旅行",
            reversed: "Seeking personal closure, short-cuts, delays",
            reversedCN: "寻求个人完结、捷径、延迟"
        }
    }
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
        subDir = card.suit;
    }
    
    // 构建完整的图片路径
    return `./cards/${subDir}/${card.image}`;
}

// 路径验证函数
function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        console.log('验证图片路径:', path);
        
        // 尝试的路径列表
        const pathsToTry = [
            path,  // 原始路径
            path.replace('./cards/', './cards/cups/'), // 尝试cups子目录
            path.replace(/^\.\/cards\//, './') // 尝试相对于根目录
        ];
        
        // 检查是否为圣杯牌，可能直接放在cards目录下
        if (path.includes('Cups')) {
            const cupCardFilename = path.split('/').pop();
            pathsToTry.push(`./cards/${cupCardFilename}`);
        }
        
        // 记录当前尝试的路径索引
        let currentPathIndex = 0;
        
        // 尝试加载图片
        function tryLoadImage() {
            if (currentPathIndex >= pathsToTry.length) {
                // 所有路径都尝试失败
                reject(new Error(`所有图片路径尝试失败: ${path}`));
                return;
            }
            
            const currentPath = pathsToTry[currentPathIndex];
            console.log(`尝试加载图片 (${currentPathIndex + 1}/${pathsToTry.length}): ${currentPath}`);
            
            const img = new Image();
            img.onload = () => {
                console.log('图片加载成功:', currentPath);
                resolve(true);
            };
            
            img.onerror = () => {
                console.warn(`路径 ${currentPathIndex + 1} 加载失败:`, currentPath);
                currentPathIndex++;
                tryLoadImage(); // 尝试下一个路径
            };
            
            img.src = currentPath;
        }
        
        // 开始尝试加载
        tryLoadImage();
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

// 随机洗牌函数
function shuffleDeck(deck) {
    // 创建牌组的副本
    const shuffledDeck = [...deck];
    
    // Fisher-Yates 洗牌算法
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    
    return shuffledDeck;
}

// 获取随机牌组
function getRandomDeck(numCards) {
    // 获取所有卡牌
    const allCards = [
        ...Object.values(majorArcanaData),
        ...Object.values(minorArcanaData.wands),
        ...Object.values(minorArcanaData.cups),
        ...Object.values(minorArcanaData.swords),
        ...Object.values(minorArcanaData.pentacles)
    ];
    
    // 洗牌
    const shuffledDeck = shuffleDeck(allCards);
    
    // 返回指定数量的卡牌
    return shuffledDeck.slice(0, numCards).map(card => ({
        ...card,
        reversed: Math.random() < 0.2 // 20%的概率逆位
    }));
}

// 统一导出
// 不再使用export语句，而是定义为全局变量
window.majorArcana = majorArcanaData;
window.minorArcana = minorArcanaData;
window.spreadPositions = spreadPositionsConfig;
window.getCardImagePath = getCardImagePath;
window.validateCardPath = validateCardPath;
window.generateTarotReading = generateTarotReading;
window.getRandomDeck = getRandomDeck; 