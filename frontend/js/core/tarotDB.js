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
            keywords: ["计划", "决定", "进步"],
            keywordsCN: ["计划", "决定", "进步"],
            keywordsEN: ["Planning", "Decisions", "Progress"],
            meanings: {
                upright: "Future planning, progress, decisions, discovery",
                uprightCN: "未来计划、进步、决策、发现",
                reversed: "Fear of unknown, lack of planning",
                reversedCN: "对未知的恐惧、缺乏计划"
            }
        },
        "03": {
            id: 3,
            name: "权杖三",
            nameCN: "权杖三",
            nameEN: "Three-of-Wands",
            type: "minor",
            suit: "wands",
            image: "03-Three-of-Wands.jpg",
            element: "fire",
            keywords: ["扩展", "远见", "机会"],
            keywordsCN: ["扩展", "远见", "机会"],
            keywordsEN: ["Expansion", "Foresight", "Opportunities"],
            meanings: {
                upright: "Progress, expansion, foresight, overseas opportunities",
                uprightCN: "进步、扩展、远见、海外机会",
                reversed: "Lack of foresight, delays, obstacles to long-term goals",
                reversedCN: "缺乏远见、延迟、长期目标的障碍"
            }
        },
        "04": {
            id: 4,
            name: "权杖四",
            nameCN: "权杖四",
            nameEN: "Four-of-Wands",
            type: "minor",
            suit: "wands",
            image: "04-Four-of-Wands.jpg",
            element: "fire",
            keywords: ["庆祝", "和谐", "家庭"],
            keywordsCN: ["庆祝", "和谐", "家庭"],
            keywordsEN: ["Celebration", "Harmony", "Home"],
            meanings: {
                upright: "Celebration, harmony, marriage, home, community",
                uprightCN: "庆祝、和谐、婚姻、家庭、社区",
                reversed: "Personal celebration, inner harmony, conflict with others",
                reversedCN: "个人庆祝、内在和谐、与他人冲突"
            }
        },
        "05": {
            id: 5,
            name: "权杖五",
            nameCN: "权杖五",
            nameEN: "Five-of-Wands",
            type: "minor",
            suit: "wands",
            image: "05-Five-of-Wands.jpg",
            element: "fire",
            keywords: ["冲突", "竞争", "挑战"],
            keywordsCN: ["冲突", "竞争", "挑战"],
            keywordsEN: ["Conflict", "Competition", "Challenge"],
            meanings: {
                upright: "Conflict, disagreements, competition, tension, diversity",
                uprightCN: "冲突、分歧、竞争、紧张、多样性",
                reversed: "Avoiding conflict, respecting differences",
                reversedCN: "避免冲突、尊重差异"
            }
        },
        "06": {
            id: 6,
            name: "权杖六",
            nameCN: "权杖六",
            nameEN: "Six-of-Wands",
            type: "minor",
            suit: "wands",
            image: "06-Six-of-Wands.jpg",
            element: "fire",
            keywords: ["胜利", "成功", "认可"],
            keywordsCN: ["胜利", "成功", "认可"],
            keywordsEN: ["Victory", "Success", "Recognition"],
            meanings: {
                upright: "Success, public recognition, progress, self-confidence",
                uprightCN: "成功、公众认可、进步、自信",
                reversed: "Private achievement, personal definition of success",
                reversedCN: "私人成就、个人成功定义"
            }
        },
        "07": {
            id: 7,
            name: "权杖七",
            nameCN: "权杖七",
            nameEN: "Seven-of-Wands",
            type: "minor",
            suit: "wands",
            image: "07-Seven-of-Wands.jpg",
            element: "fire",
            keywords: ["防御", "挑战", "坚持"],
            keywordsCN: ["防御", "挑战", "坚持"],
            keywordsEN: ["Defense", "Challenge", "Perseverance"],
            meanings: {
                upright: "Challenge, competition, protection, perseverance",
                uprightCN: "挑战、竞争、保护、坚持",
                reversed: "Exhaustion, giving up, overwhelmed",
                reversedCN: "疲惫、放弃、不堪重负"
            }
        },
        "08": {
            id: 8,
            name: "权杖八",
            nameCN: "权杖八",
            nameEN: "Eight-of-Wands",
            type: "minor",
            suit: "wands",
            image: "08-Eight-of-Wands.jpg",
            element: "fire",
            keywords: ["速度", "运动", "进展"],
            keywordsCN: ["速度", "运动", "进展"],
            keywordsEN: ["Speed", "Movement", "Progress"],
            meanings: {
                upright: "Movement, fast-paced change, action, alignment, air travel",
                uprightCN: "运动、快速变化、行动、一致、航空旅行",
                reversed: "Delays, frustration, resisting change",
                reversedCN: "延迟、挫折、抗拒变化"
            }
        },
        "09": {
            id: 9,
            name: "权杖九",
            nameCN: "权杖九",
            nameEN: "Nine-of-Wands",
            type: "minor",
            suit: "wands",
            image: "09-Nine-of-Wands.jpg",
            element: "fire",
            keywords: ["韧性", "坚持", "防御"],
            keywordsCN: ["韧性", "坚持", "防御"],
            keywordsEN: ["Resilience", "Persistence", "Defense"],
            meanings: {
                upright: "Resilience, courage, persistence, test of faith, boundaries",
                uprightCN: "韧性、勇气、坚持、信仰的考验、界限",
                reversed: "Exhaustion, fatigue, questioning motivations",
                reversedCN: "疲惫、疲劳、质疑动机"
            }
        },
        "10": {
            id: 10,
            name: "权杖十",
            nameCN: "权杖十",
            nameEN: "Ten-of-Wands",
            type: "minor",
            suit: "wands",
            image: "10-Ten-of-Wands.jpg",
            element: "fire",
            keywords: ["负担", "责任", "压力"],
            keywordsCN: ["负担", "责任", "压力"],
            keywordsEN: ["Burden", "Responsibility", "Stress"],
            meanings: {
                upright: "Burden, extra responsibility, hard work, completion",
                uprightCN: "负担、额外责任、努力工作、完成",
                reversed: "Doing it all, carrying the burden, delegation",
                reversedCN: "全力以赴、承担负担、委派"
            }
        },
        "11": {
            id: 11,
            name: "权杖侍者",
            nameCN: "权杖侍者",
            nameEN: "Page-of-Wands",
            type: "minor",
            suit: "wands",
            image: "11-Page-of-Wands.jpg",
            element: "fire",
            keywords: ["探索", "发现", "热情"],
            keywordsCN: ["探索", "发现", "热情"],
            keywordsEN: ["Exploration", "Discovery", "Enthusiasm"],
            meanings: {
                upright: "Inspiration, ideas, discovery, limitless potential, free spirit",
                uprightCN: "灵感、想法、发现、无限潜力、自由精神",
                reversed: "Newly-formed ideas, redirecting energy, self-limiting beliefs",
                reversedCN: "新形成的想法、重新定向能量、自我限制的信念"
            }
        },
        "12": {
            id: 12,
            name: "权杖骑士",
            nameCN: "权杖骑士",
            nameEN: "Knight-of-Wands",
            type: "minor",
            suit: "wands",
            image: "12-Knight-of-Wands.jpg",
            element: "fire",
            keywords: ["能量", "激情", "冒险"],
            keywordsCN: ["能量", "激情", "冒险"],
            keywordsEN: ["Energy", "Passion", "Adventure"],
            meanings: {
                upright: "Energy, passion, inspired action, adventure, impulsiveness",
                uprightCN: "能量、激情、受启发的行动、冒险、冲动",
                reversed: "Passion project, haste, scattered energy, delays",
                reversedCN: "激情项目、仓促、分散的能量、延迟"
            }
        },
        "13": {
            id: 13,
            name: "权杖皇后",
            nameCN: "权杖皇后",
            nameEN: "Queen-of-Wands",
            type: "minor",
            suit: "wands",
            image: "13-Queen-of-Wands.jpg",
            element: "fire",
            keywords: ["自信", "独立", "热情"],
            keywordsCN: ["自信", "独立", "热情"],
            keywordsEN: ["Confidence", "Independence", "Passion"],
            meanings: {
                upright: "Courage, confidence, independence, social butterfly, determination",
                uprightCN: "勇气、自信、独立、社交蝴蝶、决心",
                reversed: "Self-respect, self-confidence, introverted",
                reversedCN: "自尊、自信、内向"
            }
        },
        "14": {
            id: 14,
            name: "权杖国王",
            nameCN: "权杖国王",
            nameEN: "King-of-Wands",
            type: "minor",
            suit: "wands",
            image: "14-King-of-Wands.jpg",
            element: "fire",
            keywords: ["领导", "愿景", "影响力"],
            keywordsCN: ["领导", "愿景", "影响力"],
            keywordsEN: ["Leadership", "Vision", "Influence"],
            meanings: {
                upright: "Natural-born leader, vision, entrepreneur, honor",
                uprightCN: "天生的领导者、愿景、企业家、荣誉",
                reversed: "Impulsiveness, haste, ruthless, high expectations",
                reversedCN: "冲动、仓促、无情、高期望"
            }
        }
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
            keywords: ["情感", "新开始", "灵感"],
            keywordsCN: ["情感", "新开始", "灵感"],
            keywordsEN: ["Emotion", "New beginnings", "Inspiration"],
            meanings: {
                upright: "New relationships, compassion, creativity",
                uprightCN: "新关系、同情、创造力",
                reversed: "Emotional loss, blocked creativity, emptiness",
                reversedCN: "情感失落、创造力受阻、空虚"
            }
        },
        "02": {
            id: 2,
            name: "圣杯二",
            nameCN: "圣杯二",
            nameEN: "Two-of-Cups",
            type: "minor",
            suit: "cups",
            image: "02-Two-of-Cups.jpg",
            element: "water",
            keywords: ["伙伴关系", "和谐", "平衡"],
            keywordsCN: ["伙伴关系", "和谐", "平衡"],
            keywordsEN: ["Partnership", "Harmony", "Balance"],
            meanings: {
                upright: "Unified love, partnership, mutual attraction",
                uprightCN: "统一的爱、伙伴关系、相互吸引",
                reversed: "Break-up, imbalance in a relationship, lack of harmony",
                reversedCN: "分手、关系失衡、缺乏和谐"
            }
        },
        "03": {
            id: 3,
            name: "圣杯三",
            nameCN: "圣杯三",
            nameEN: "Three-of-Cups",
            type: "minor",
            suit: "cups",
            image: "03-Three-of-Cups.jpg",
            element: "water",
            keywords: ["庆祝", "友谊", "创造力"],
            keywordsCN: ["庆祝", "友谊", "创造力"],
            keywordsEN: ["Celebration", "Friendship", "Creativity"],
            meanings: {
                upright: "Celebration, friendship, creativity, community",
                uprightCN: "庆祝、友谊、创造力、社区",
                reversed: "An affair, stifled creativity, lack of support",
                reversedCN: "外遇、创造力受阻、缺乏支持"
            }
        },
        "04": {
            id: 4,
            name: "圣杯四",
            nameCN: "圣杯四",
            nameEN: "Four-of-Cups",
            type: "minor",
            suit: "cups",
            image: "04-Four-of-Cups.jpg",
            element: "water",
            keywords: ["沉思", "不满", "冥想"],
            keywordsCN: ["沉思", "不满", "冥想"],
            keywordsEN: ["Contemplation", "Discontent", "Meditation"],
            meanings: {
                upright: "Meditation, contemplation, apathy, reevaluation",
                uprightCN: "冥想、沉思、冷漠、重新评估",
                reversed: "Sudden awareness, choosing happiness, acceptance",
                reversedCN: "突然的觉察、选择快乐、接受"
            }
        },
        "05": {
            id: 5,
            name: "圣杯五",
            nameCN: "圣杯五",
            nameEN: "Five-of-Cups",
            type: "minor",
            suit: "cups",
            image: "05-Five-of-Cups.jpg",
            element: "water",
            keywords: ["失落", "遗憾", "悲伤"],
            keywordsCN: ["失落", "遗憾", "悲伤"],
            keywordsEN: ["Loss", "Regret", "Grief"],
            meanings: {
                upright: "Regret, failure, disappointment, pessimism",
                uprightCN: "遗憾、失败、失望、悲观",
                reversed: "Personal setbacks, self-forgiveness, moving on",
                reversedCN: "个人挫折、自我宽恕、继续前进"
            }
        },
        "06": {
            id: 6,
            name: "圣杯六",
            nameCN: "圣杯六",
            nameEN: "Six-of-Cups",
            type: "minor",
            suit: "cups",
            image: "06-Six-of-Cups.jpg",
            element: "water",
            keywords: ["怀旧", "童年", "回忆"],
            keywordsCN: ["怀旧", "童年", "回忆"],
            keywordsEN: ["Nostalgia", "Childhood", "Memories"],
            meanings: {
                upright: "Revisiting the past, childhood memories, innocence",
                uprightCN: "重温过去、童年回忆、纯真",
                reversed: "Stuck in the past, naivety, unrealistic",
                reversedCN: "困在过去、天真、不切实际"
            }
        },
        "07": {
            id: 7,
            name: "圣杯七",
            nameCN: "圣杯七",
            nameEN: "Seven-of-Cups",
            type: "minor",
            suit: "cups",
            image: "07-Seven-of-Cups.jpg",
            element: "water",
            keywords: ["幻想", "选择", "错觉"],
            keywordsCN: ["幻想", "选择", "错觉"],
            keywordsEN: ["Fantasy", "Choices", "Illusion"],
            meanings: {
                upright: "Opportunities, choices, wishful thinking, illusion",
                uprightCN: "机会、选择、幻想、错觉",
                reversed: "Lack of purpose, diversion, confusion",
                reversedCN: "缺乏目标、分心、困惑"
            }
        },
        "08": {
            id: 8,
            name: "圣杯八",
            nameCN: "圣杯八",
            nameEN: "Eight-of-Cups",
            type: "minor",
            suit: "cups",
            image: "08-Eight-of-Cups.jpg",
            element: "water",
            keywords: ["逃避", "放弃", "旅行"],
            keywordsCN: ["逃避", "放弃", "旅行"],
            keywordsEN: ["Escapism", "Abandonment", "Travel"],
            meanings: {
                upright: "Disappointment, abandonment, withdrawal, escapism",
                uprightCN: "失望、放弃、退缩、逃避",
                reversed: "Trying one more time, indecision, aimless drifting",
                reversedCN: "再试一次、犹豫不决、漫无目的"
            }
        },
        "09": {
            id: 9,
            name: "圣杯九",
            nameCN: "圣杯九",
            nameEN: "Nine-of-Cups",
            type: "minor",
            suit: "cups",
            image: "09-Nine-of-Cups.jpg",
            element: "water",
            keywords: ["满足", "舒适", "幸福"],
            keywordsCN: ["满足", "舒适", "幸福"],
            keywordsEN: ["Contentment", "Comfort", "Happiness"],
            meanings: {
                upright: "Contentment, satisfaction, gratitude, wish come true",
                uprightCN: "满足、满意、感激、愿望成真",
                reversed: "Greed, dissatisfaction, materialism",
                reversedCN: "贪婪、不满、物质主义"
            }
        },
        "10": {
            id: 10,
            name: "圣杯十",
            nameCN: "圣杯十",
            nameEN: "Ten-of-Cups",
            type: "minor",
            suit: "cups",
            image: "10-Ten-of-Cups.jpg",
            element: "water",
            keywords: ["和谐", "幸福", "家庭"],
            keywordsCN: ["和谐", "幸福", "家庭"],
            keywordsEN: ["Harmony", "Happiness", "Family"],
            meanings: {
                upright: "Harmony, marriage, happiness, alignment",
                uprightCN: "和谐、婚姻、幸福、一致",
                reversed: "Misalignment of values, broken home, marital disharmony",
                reversedCN: "价值观不一致、家庭破裂、婚姻不和"
            }
        },
        "11": {
            id: 11,
            name: "圣杯侍者",
            nameCN: "圣杯侍者",
            nameEN: "Page-of-Cups",
            type: "minor",
            suit: "cups",
            image: "11-Page-of-Cups.jpg",
            element: "water",
            keywords: ["好奇心", "可能性", "直觉"],
            keywordsCN: ["好奇心", "可能性", "直觉"],
            keywordsEN: ["Curiosity", "Possibility", "Intuition"],
            meanings: {
                upright: "Creative opportunities, intuitive messages, curiosity",
                uprightCN: "创造机会、直觉信息、好奇心",
                reversed: "Emotional immaturity, creative block",
                reversedCN: "情感不成熟、创造力受阻"
            }
        },
        "12": {
            id: 12,
            name: "圣杯骑士",
            nameCN: "圣杯骑士",
            nameEN: "Knight-of-Cups",
            type: "minor",
            suit: "cups",
            image: "12-Knight-of-Cups.jpg",
            element: "water",
            keywords: ["浪漫", "魅力", "幻想"],
            keywordsCN: ["浪漫", "魅力", "幻想"],
            keywordsEN: ["Romance", "Charm", "Imagination"],
            meanings: {
                upright: "Romance, charm, imagination, beauty",
                uprightCN: "浪漫、魅力、幻想、美丽",
                reversed: "Overactive imagination, unrealistic, jealousy",
                reversedCN: "过度幻想、不切实际、嫉妒"
            }
        },
        "13": {
            id: 13,
            name: "圣杯皇后",
            nameCN: "圣杯皇后",
            nameEN: "Queen-of-Cups",
            type: "minor",
            suit: "cups",
            image: "13-Queen-of-Cups.jpg",
            element: "water",
            keywords: ["同情", "关怀", "情感"],
            keywordsCN: ["同情", "关怀", "情感"],
            keywordsEN: ["Compassion", "Care", "Emotion"],
            meanings: {
                upright: "Compassionate, caring, emotionally stable",
                uprightCN: "富有同情心、关怀、情感稳定",
                reversed: "Insecurity, co-dependence",
                reversedCN: "不安全感、共依存"
            }
        },
        "14": {
            id: 14,
            name: "圣杯国王",
            nameCN: "圣杯国王",
            nameEN: "King-of-Cups",
            type: "minor",
            suit: "cups",
            image: "14-King-of-Cups.jpg",
            element: "water",
            keywords: ["平衡", "外交", "智慧"],
            keywordsCN: ["平衡", "外交", "智慧"],
            keywordsEN: ["Balance", "Diplomacy", "Wisdom"],
            meanings: {
                upright: "Emotionally balanced, compassionate, diplomatic",
                uprightCN: "情感平衡、富有同情心、外交",
                reversed: "Emotional manipulation, moodiness",
                reversedCN: "情感操控、情绪化"
            }
        }
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
            keywords: ["真相", "胜利", "清晰"],
            keywordsCN: ["真相", "胜利", "清晰"],
            keywordsEN: ["Truth", "Victory", "Clarity"],
            meanings: {
                upright: "Breakthrough, clarity, sharp mind",
                uprightCN: "突破、清晰、敏锐的头脑",
                reversed: "Confusion, brutality, chaos",
                reversedCN: "困惑、残暴、混乱"
            }
        },
        "02": {
            id: 2,
            name: "宝剑二",
            nameCN: "宝剑二",
            nameEN: "Two-of-Swords",
            type: "minor",
            suit: "swords",
            image: "02-Two-of-Swords.jpg",
            element: "air",
            keywords: ["决策", "平衡", "僵局"],
            keywordsCN: ["决策", "平衡", "僵局"],
            keywordsEN: ["Decision", "Balance", "Stalemate"],
            meanings: {
                upright: "Difficult decisions, weighing up options, an impasse",
                uprightCN: "艰难的决策、权衡选项、僵局",
                reversed: "Indecision, confusion, information overload",
                reversedCN: "犹豫不决、困惑、信息过载"
            }
        },
        "03": {
            id: 3,
            name: "宝剑三",
            nameCN: "宝剑三",
            nameEN: "Three-of-Swords",
            type: "minor",
            suit: "swords",
            image: "03-Three-of-Swords.jpg",
            element: "air",
            keywords: ["心痛", "悲伤", "分离"],
            keywordsCN: ["心痛", "悲伤", "分离"],
            keywordsEN: ["Heartbreak", "Sorrow", "Separation"],
            meanings: {
                upright: "Heartbreak, emotional pain, sorrow, grief, hurt",
                uprightCN: "心痛、情感痛苦、悲伤、伤害",
                reversed: "Releasing pain, optimism, forgiveness",
                reversedCN: "释放痛苦、乐观、宽恕"
            }
        },
        "04": {
            id: 4,
            name: "宝剑四",
            nameCN: "宝剑四",
            nameEN: "Four-of-Swords",
            type: "minor",
            suit: "swords",
            image: "04-Four-of-Swords.jpg",
            element: "air",
            keywords: ["休息", "恢复", "沉思"],
            keywordsCN: ["休息", "恢复", "沉思"],
            keywordsEN: ["Rest", "Recovery", "Contemplation"],
            meanings: {
                upright: "Rest, relaxation, meditation, contemplation, recuperation",
                uprightCN: "休息、放松、冥想、沉思、恢复",
                reversed: "Exhaustion, burn-out, deep contemplation",
                reversedCN: "疲惫、倦怠、深度沉思"
            }
        },
        "05": {
            id: 5,
            name: "宝剑五",
            nameCN: "宝剑五",
            nameEN: "Five-of-Swords",
            type: "minor",
            suit: "swords",
            image: "05-Five-of-Swords.jpg",
            element: "air",
            keywords: ["冲突", "失败", "不和"],
            keywordsCN: ["冲突", "失败", "不和"],
            keywordsEN: ["Conflict", "Defeat", "Disagreement"],
            meanings: {
                upright: "Conflict, disagreements, defeat, betrayal, loss",
                uprightCN: "冲突、分歧、失败、背叛、失落",
                reversed: "Making amends, reconciliation, past resentment",
                reversedCN: "和解、调解、过去的怨恨"
            }
        },
        "06": {
            id: 6,
            name: "宝剑六",
            nameCN: "宝剑六",
            nameEN: "Six-of-Swords",
            type: "minor",
            suit: "swords",
            image: "06-Six-of-Swords.jpg",
            element: "air",
            keywords: ["过渡", "变化", "恢复"],
            keywordsCN: ["过渡", "变化", "恢复"],
            keywordsEN: ["Transition", "Change", "Recovery"],
            meanings: {
                upright: "Transition, change, rite of passage, releasing baggage",
                uprightCN: "过渡、变化、仪式、释放负担",
                reversed: "Personal transition, resistance to change",
                reversedCN: "个人过渡、抗拒改变"
            }
        },
        "07": {
            id: 7,
            name: "宝剑七",
            nameCN: "宝剑七",
            nameEN: "Seven-of-Swords",
            type: "minor",
            suit: "swords",
            image: "07-Seven-of-Swords.jpg",
            element: "air",
            keywords: ["背叛", "欺骗", "策略"],
            keywordsCN: ["背叛", "欺骗", "策略"],
            keywordsEN: ["Betrayal", "Deception", "Strategy"],
            meanings: {
                upright: "Betrayal, deception, getting away with something, stealth",
                uprightCN: "背叛、欺骗、逃避、隐秘",
                reversed: "Imposter syndrome, self-deceit, keeping secrets",
                reversedCN: "冒名顶替、自欺、保守秘密"
            }
        },
        "08": {
            id: 8,
            name: "宝剑八",
            nameCN: "宝剑八",
            nameEN: "Eight-of-Swords",
            type: "minor",
            suit: "swords",
            image: "08-Eight-of-Swords.jpg",
            element: "air",
            keywords: ["限制", "束缚", "困境"],
            keywordsCN: ["限制", "束缚", "困境"],
            keywordsEN: ["Restriction", "Bondage", "Dilemma"],
            meanings: {
                upright: "Negative thoughts, self-imposed restriction, imprisonment",
                uprightCN: "消极思想、自我限制、囚禁",
                reversed: "Open to new perspectives, release, freedom",
                reversedCN: "开放新视角、释放、自由"
            }
        },
        "09": {
            id: 9,
            name: "宝剑九",
            nameCN: "宝剑九",
            nameEN: "Nine-of-Swords",
            type: "minor",
            suit: "swords",
            image: "09-Nine-of-Swords.jpg",
            element: "air",
            keywords: ["焦虑", "恐惧", "绝望"],
            keywordsCN: ["焦虑", "恐惧", "绝望"],
            keywordsEN: ["Anxiety", "Fear", "Despair"],
            meanings: {
                upright: "Anxiety, worry, fear, depression, nightmares",
                uprightCN: "焦虑、担忧、恐惧、抑郁、噩梦",
                reversed: "Inner turmoil, deep-seated fears, secrets",
                reversedCN: "内心动荡、深层恐惧、秘密"
            }
        },
        "10": {
            id: 10,
            name: "宝剑十",
            nameCN: "宝剑十",
            nameEN: "Ten-of-Swords",
            type: "minor",
            suit: "swords",
            image: "10-Ten-of-Swords.jpg",
            element: "air",
            keywords: ["背叛", "结束", "失败"],
            keywordsCN: ["背叛", "结束", "失败"],
            keywordsEN: ["Betrayal", "Endings", "Failure"],
            meanings: {
                upright: "Painful endings, deep wounds, betrayal, loss, crisis",
                uprightCN: "痛苦的结束、深深的伤口、背叛、失落、危机",
                reversed: "Recovery, regeneration, resisting an inevitable end",
                reversedCN: "恢复、再生、抵抗不可避免的结束"
            }
        },
        "11": {
            id: 11,
            name: "宝剑侍者",
            nameCN: "宝剑侍者",
            nameEN: "Page-of-Swords",
            type: "minor",
            suit: "swords",
            image: "11-Page-of-Swords.jpg",
            element: "air",
            keywords: ["好奇心", "情报", "警觉"],
            keywordsCN: ["好奇心", "情报", "警觉"],
            keywordsEN: ["Curiosity", "Intelligence", "Vigilance"],
            meanings: {
                upright: "New ideas, curiosity, thirst for knowledge, new ways of communicating",
                uprightCN: "新想法、好奇心、求知欲、新的沟通方式",
                reversed: "Self-expression, all talk and no action, haphazard action, haste",
                reversedCN: "自我表达、光说不做、草率行动、仓促"
            }
        },
        "12": {
            id: 12,
            name: "宝剑骑士",
            nameCN: "宝剑骑士",
            nameEN: "Knight-of-Swords",
            type: "minor",
            suit: "swords",
            image: "12-Knight-of-Swords.jpg",
            element: "air",
            keywords: ["行动", "速度", "决心"],
            keywordsCN: ["行动", "速度", "决心"],
            keywordsEN: ["Action", "Speed", "Determination"],
            meanings: {
                upright: "Ambitious, action-oriented, driven to succeed, fast-thinking",
                uprightCN: "雄心勃勃、行动导向、成功驱动、思维敏捷",
                reversed: "Restless, unfocused, impulsive, burn-out",
                reversedCN: "不安、无焦点、冲动、倦怠"
            }
        },
        "13": {
            id: 13,
            name: "宝剑皇后",
            nameCN: "宝剑皇后",
            nameEN: "Queen-of-Swords",
            type: "minor",
            suit: "swords",
            image: "13-Queen-of-Swords.jpg",
            element: "air",
            keywords: ["独立", "洞察力", "清晰"],
            keywordsCN: ["独立", "洞察力", "清晰"],
            keywordsEN: ["Independence", "Insight", "Clarity"],
            meanings: {
                upright: "Independent, unbiased judgement, clear boundaries, direct communication",
                uprightCN: "独立、公正判断、清晰界限、直接沟通",
                reversed: "Overly-emotional, easily influenced, bitchy, cold-hearted",
                reversedCN: "过于情绪化、易受影响、刻薄、冷酷"
            }
        },
        "14": {
            id: 14,
            name: "宝剑国王",
            nameCN: "宝剑国王",
            nameEN: "King-of-Swords",
            type: "minor",
            suit: "swords",
            image: "14-King-of-Swords.jpg",
            element: "air",
            keywords: ["理智", "权威", "真相"],
            keywordsCN: ["理智", "权威", "真相"],
            keywordsEN: ["Logic", "Authority", "Truth"],
            meanings: {
                upright: "Mental clarity, intellectual power, authority, truth",
                uprightCN: "思维清晰、智力权威、权威、真相",
                reversed: "Manipulative, tyrannical, abusive",
                reversedCN: "操控、专制、虐待"
            }
        }
    },
    pentacles: {
        "01": { image: "01-Ace-of-Pentacles.jpg" },
        "02": { image: "02-Two-of-Pentacles.jpg" },
        "03": { image: "03-Three-of-Pentacles.jpg" },
        "04": { image: "04-Four-of-Pentacles.jpg" },
        "05": { image: "05-Five-of-Pentacles.jpg" },
        "06": { image: "06-Six-of-Pentacles.jpg" },
        "07": { image: "07-Seven-of-Pentacles.jpg" },
        "08": { image: "08-Eight-of-Pentacles.jpg" },
        "09": { image: "09-Nine-of-Pentacles.jpg" },
        "10": { image: "10-Ten-of-Pentacles.jpg" },
        "11": { image: "11-Page-of-Pentacles.jpg" },
        "12": { image: "12-Knight-of-Pentacles.jpg" },
        "13": { image: "13-Queen-of-Pentacles.jpg" },
        "14": { image: "14-King-of-Pentacles.jpg" }
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
    return `./cards/${card.image}`;
}

// 生成唯一文件名
function generateUniqueFilename(card) {
    if (card.type === 'major') {
        return `major-${card.image}`;
    } else {
        return `${card.suit}-${card.image}`;
    }
}

// 路径验证函数
function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        console.log('验证图片路径:', path);
        
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功:', path);
            resolve(true);
        };
        
        img.onerror = () => {
            console.warn('图片加载失败:', path);
            reject(new Error(`图片加载失败: ${path}`));
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