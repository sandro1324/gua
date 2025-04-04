console.log("[DEBUG] 数据库已加载");

// 路径生成函数
export function getCardImagePath(card) {
    if (!card.id && card.id !== 0) {
        console.error("卡牌缺失ID字段:", card);
        return null;
    }

    const base = '/%E5%8D%A6/frontend/assets/tarot/cards';
    const suitDir = card.type === 'major' ? 'major' : card.suit.toLowerCase();
    const filename = `${String(card.id).padStart(2, '0')}-${card.nameEN.replace(/ /g, '%20')}.jpg`;

    console.log('生成路径验证:', { 
        id: card.id,
        name: card.nameEN,
        type: card.type,
        suit: card.suit,
        suitDir, 
        expectedFile: filename,
        actualFile: card.image 
    });

    return `${base}/${suitDir}/${filename}`;
}

// 路径验证函数
export function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功:', path);
            resolve(true);
        };
        img.onerror = () => {
            console.error('图片加载失败:', path);
            // 尝试备用路径
            const fallbackPath = path.replace('/%E5%8D%A6/frontend/', '');
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                console.log('备用路径加载成功:', fallbackPath);
                resolve(true);
            };
            fallbackImg.onerror = () => {
                console.error('备用路径也失败:', fallbackPath);
                reject(new Error('图片加载失败'));
            };
            fallbackImg.src = fallbackPath;
        };
        img.src = path;
    });
}

// 文件名验证函数
export function validateFilenames() {
    console.log('开始验证文件名...');
    
    // 验证大阿卡纳牌
    Object.values(majorArcana).forEach(card => {
        if (!card.id && card.id !== 0) {
            console.error('大阿卡纳牌数据不完整:', card);
            return;
        }
        
        const expected = `${String(card.id).padStart(2, '0')}-${card.nameEN.replace(/ /g, '%20')}.jpg`;
        if (card.image !== expected) {
            console.error(`[CRITICAL] 文件名严重不匹配: ${card.image} → 应重命名为 ${expected}`);
        }
    });
    
    // 验证小阿卡纳牌
    Object.entries(minorArcana).forEach(([suit, cards]) => {
        Object.values(cards).forEach(card => {
            if (!card.id) {
                console.error('小阿卡纳牌数据不完整:', card);
                return;
            }
            
            const expected = `${String(card.id).padStart(2, '0')}-${card.nameEN.replace(/ /g, '%20')}.jpg`;
            if (card.image !== expected) {
                console.error(`[CRITICAL] 文件名严重不匹配: ${card.image} → 应重命名为 ${expected}`);
            }
        });
    });
}

// 大阿卡那牌数据
export const majorArcana = {
    "00": {
        id: 0,
        name: "愚者",
        nameCN: "愚者",
        nameEN: "The-Fool",
        type: "major",
        suit: "major",
        image: "00-The-Fool.jpg",
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
        image: "01-The-Magician.jpg",
        element: "air",
        keywords: ["创造力", "技能", "意志力"],
        keywordsCN: ["创造力", "技能", "意志力"],
        keywordsEN: ["Creativity", "Skill", "Willpower"],
        meanings: {
            upright: "Manifestation, resourcefulness, power, inspiration",
            uprightCN: "显现，足智多谋，力量，灵感",
            reversed: "Manipulation, poor planning, untapped talents",
            reversedCN: "操纵，计划不周，未开发的才能"
        }
    },
    "02": {
        id: 2,
        name: "女祭司",
        nameCN: "女祭司",
        nameEN: "The-High-Priestess",
        type: "major",
        suit: "major",
        image: "02-The-High-Priestess.jpg",
        element: "water",
        keywords: ["直觉", "潜意识", "神秘"],
        keywordsCN: ["直觉", "潜意识", "神秘"],
        keywordsEN: ["Intuition", "Subconscious", "Mystery"],
        meanings: {
            upright: "Intuition, sacred knowledge, divine feminine, unconscious mind",
            uprightCN: "直觉，神圣知识，神圣女性，潜意识",
            reversed: "Secrets, disconnected from intuition, withdrawal, silence",
            reversedCN: "秘密，与直觉脱节，退出，沉默"
        }
    },
    "03": {
        id: 3,
        name: "女皇",
        nameCN: "女皇",
        nameEN: "The-Empress",
        type: "major",
        suit: "major",
        image: "03-The-Empress.jpg",
        element: "earth",
        keywords: ["丰饶", "创造", "母性"],
        keywordsCN: ["丰饶", "创造", "母性"],
        keywordsEN: ["Abundance", "Creation", "Nurturing"],
        meanings: {
            upright: "Femininity, beauty, nature, nurturing, abundance",
            uprightCN: "女性气质，美丽，自然，养育，丰富",
            reversed: "Creative block, dependence on others, emptiness",
            reversedCN: "创造力障碍，依赖他人，空虚"
        }
    },
    "04": {
        id: 4,
        name: "皇帝",
        nameCN: "皇帝",
        nameEN: "The-Emperor",
        type: "major",
        suit: "major",
        image: "04-The-Emperor.jpg",
        element: "fire",
        keywords: ["权威", "结构", "控制"],
        keywordsCN: ["权威", "结构", "控制"],
        keywordsEN: ["Authority", "Structure", "Control"],
        meanings: {
            upright: "Authority, establishment, structure, father figure",
            uprightCN: "权威，建立，结构，父亲形象",
            reversed: "Domination, excessive control, rigidity, inflexibility",
            reversedCN: "支配，过度控制，僵化，缺乏灵活性"
        }
    }
    // ... 继续添加其他大阿卡纳牌
};

// 小阿卡那牌数据
export const minorArcana = {
    wands: {
        "01": {
            id: 1,
            name: "权杖一",
            nameCN: "权杖一",
            nameEN: "Ace-of-Wands",
            type: "minor",
            suit: "wands",
            image: "01-Ace-of-Wands.jpg",
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
        },
        "02": {
            id: 2,
            name: "权杖二",
            nameCN: "权杖二",
            nameEN: "Two-of-Wands",
            type: "minor",
            suit: "wands",
            image: "02-Two-of-Wands.jpg",
            element: "fire",
            keywords: ["计划", "决策", "选择"],
            keywordsCN: ["计划", "决策", "选择"],
            keywordsEN: ["Planning", "Decisions", "Choice"],
            meanings: {
                upright: "Future planning, progress, decisions, discovery",
                uprightCN: "未来计划、进展、决策、发现",
                reversed: "Fear of unknown, lack of planning, bad decisions",
                reversedCN: "对未知的恐惧、缺乏计划、错误决策"
            }
        }
        // ... 继续添加其他权杖牌
    },
    cups: {
        "01": {
            id: 1,
            name: "圣杯一",
            nameCN: "圣杯一",
            nameEN: "Ace-of-Cups",
            type: "minor",
            suit: "cups",
            image: "01-Ace-of-Cups.jpg",
            element: "water",
            keywords: ["情感", "直觉", "新感情"],
            keywordsCN: ["情感", "直觉", "新感情"],
            keywordsEN: ["Emotion", "Intuition", "New relationship"],
            meanings: {
                upright: "New feelings, intuition, intimacy, love",
                uprightCN: "新的感受、直觉、亲密关系、爱",
                reversed: "Emotional loss, blocked creativity, emptiness",
                reversedCN: "情感丢失、创造力受阻、空虚"
            }
        }
        // ... 继续添加其他圣杯牌
    },
    swords: {
        "01": {
            id: 1,
            name: "宝剑一",
            nameCN: "宝剑一",
            nameEN: "Ace-of-Swords",
            type: "minor",
            suit: "swords",
            image: "01-Ace-of-Swords.jpg",
            element: "air",
            keywords: ["清晰", "真理", "突破"],
            keywordsCN: ["清晰", "真理", "突破"],
            keywordsEN: ["Clarity", "Truth", "Breakthrough"],
            meanings: {
                upright: "Breakthrough, clarity, sharp mind, truth",
                uprightCN: "突破、清晰、敏锐的思维、真理",
                reversed: "Confusion, brutality, chaos, cloudiness",
                reversedCN: "混乱、残酷、混沌、思维模糊"
            }
        }
        // ... 继续添加其他宝剑牌
    },
    pentacles: {
        "01": {
            id: 1,
            name: "星币一",
            nameCN: "星币一",
            nameEN: "Ace-of-Pentacles",
            type: "minor",
            suit: "pentacles",
            image: "01-Ace-of-Pentacles.jpg",
            element: "earth",
            keywords: ["机遇", "繁荣", "物质"],
            keywordsCN: ["机遇", "繁荣", "物质"],
            keywordsEN: ["Opportunity", "Prosperity", "Material"],
            meanings: {
                upright: "Opportunity, prosperity, new financial beginning",
                uprightCN: "机遇、繁荣、新的财务开始",
                reversed: "Missed opportunity, scarcity mindset",
                reversedCN: "错失机会、稀缺心态"
            }
        }
        // ... 继续添加其他星币牌
    }
};

// 占卜位置定义
export const spreadPositions = {
    'three-card': [
        { nameEN: 'Past Influence' },
        { nameEN: 'Present Situation' },
        { nameEN: 'Future Potential' }
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

// 牌阵规则定义
export const spreadRules = {
    'celtic-cross': {
        2: { orientation: 'reversed' }, // 第二张牌强制逆位
        5: { suit: 'swords' }           // 第五张仅限宝剑牌组
    },
    'wheel-of-year': {
        1: { type: 'major' },           // 中心主题必须是大阿卡那
        2: { element: 'water' },        // 冬季牌必须是水元素
        3: { element: 'fire' },         // 春季牌必须是火元素
        4: { element: 'fire' },         // 夏季牌必须是火元素
        5: { element: 'earth' }         // 秋季牌必须是土元素
    }
};

// 根据牌阵规则筛选卡牌
export function getFilteredCard(position, spreadType) {
    const rules = spreadRules[spreadType]?.[position];
    if (!rules) return null;

    let filteredCards = [];
    
    // 根据规则筛选卡牌
    if (rules.type) {
        filteredCards = Object.values(majorArcana);
    } else if (rules.suit) {
        filteredCards = Object.values(minorArcana[rules.suit]);
    } else if (rules.element) {
        filteredCards = [
            ...Object.values(majorArcana).filter(card => card.element === rules.element),
            ...Object.values(minorArcana.wands).filter(card => card.element === rules.element),
            ...Object.values(minorArcana.cups).filter(card => card.element === rules.element),
            ...Object.values(minorArcana.swords).filter(card => card.element === rules.element),
            ...Object.values(minorArcana.pentacles).filter(card => card.element === rules.element)
        ];
    }

    // 使用加密安全的随机数生成
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomIndex = array[0] % filteredCards.length;
    
    return {
        ...filteredCards[randomIndex],
        imagePath: getCardImagePath(filteredCards[randomIndex])
    };
}

// 在数据定义完成后验证文件名
validateFilenames(); 