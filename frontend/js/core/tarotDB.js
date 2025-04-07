// 路径生成函数
export function getCardImagePath(card) {
    if (!card) return null;
    
    let subDir;
    if (card.type === 'major') {
        subDir = 'major';
    } else {
        // 小阿卡那牌根据花色确定子目录
        subDir = card.suit.toLowerCase();
    }
    
    return `/cards/${subDir}/${card.image}`;
}

// 路径验证函数
export function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            // 尝试备用路径
            const fallbackPath = path.replace('/cards/', '/');
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve(true);
            fallbackImg.onerror = () => reject(new Error(`Image not found: ${path}`));
            fallbackImg.src = fallbackPath;
        };
        img.src = path;
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

// 占卜位置定义
export const spreadPositions = {
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

// 确保所有导出都在文件末尾再次声明
export { 
    getCardImagePath,
    validateCardPath,
    majorArcana,
    minorArcana,
    spreadPositions
}; 