// 八字分析核心模块

const BaziAnalyzer = {
    // 纳音五行对照表
    nayinMap: {
        '甲子甲午': '海中金', '乙丑乙未': '海中金',
        '丙寅丙申': '炉中火', '丁卯丁酉': '炉中火',
        '戊辰戊戌': '大林木', '己巳己亥': '大林木',
        '庚午庚子': '路旁土', '辛未辛丑': '路旁土',
        '壬申壬寅': '剑锋金', '癸酉癸卯': '剑锋金',
        '甲戌甲辰': '山头火', '乙亥乙巳': '山头火',
        '丙子丙午': '涧下水', '丁丑丁未': '涧下水',
        '戊寅戊申': '城头土', '己卯己酉': '城头土',
        '庚辰庚戌': '白蜡金', '辛巳辛亥': '白蜡金',
        '壬午壬子': '杨柳木', '癸未癸丑': '杨柳木'
    },

    // 十神对照表
    shiShenMap: {
        '甲': {
            '甲': '比肩', '乙': '劫财',
            '丙': '食神', '丁': '伤官',
            '戊': '偏财', '己': '正财',
            '庚': '七杀', '辛': '正官',
            '壬': '偏印', '癸': '正印'
        },
        // ... 其他天干的十神关系
    },

    // 获取纳音五行
    getNayin: function(ganzhi) {
        for(let [key, value] of Object.entries(this.nayinMap)) {
            if(key.includes(ganzhi)) {
                return value;
            }
        }
        return '';
    },

    // 获取十神关系
    getShiShen: function(dayGan, targetGan) {
        return this.shiShenMap[dayGan][targetGan] || '';
    },

    // 分析命局格局
    getPattern: function(baziData) {
        const patterns = [];
        const { year, month, day, hour } = baziData.ganzhi;
        
        // 检查特殊格局
        if(this.isAllSame(year, month, day, hour)) {
            patterns.push('四柱同体');
        }
        
        if(this.isSeasonMatch(month, day)) {
            patterns.push('月令得时');
        }
        
        // 检查天干组合
        const ganCombinations = this.checkGanCombinations(year[0], month[0], day[0], hour[0]);
        patterns.push(...ganCombinations);
        
        // 检查地支组合
        const zhiCombinations = this.checkZhiCombinations(year[1], month[1], day[1], hour[1]);
        patterns.push(...zhiCombinations);
        
        return patterns;
    },

    // 检查四柱是否同体
    isAllSame: function(year, month, day, hour) {
        const firstGan = year[0];
        const firstZhi = year[1];
        return [month, day, hour].every(gz => 
            gz[0] === firstGan && gz[1] === firstZhi
        );
    },

    // 检查月令是否得时
    isSeasonMatch: function(month, day) {
        const seasonMap = {
            '寅卯辰': '木',
            '巳午未': '火',
            '申酉戌': '金',
            '亥子丑': '水'
        };
        
        const monthZhi = month[1];
        const dayGan = day[0];
        
        for(let [season, element] of Object.entries(seasonMap)) {
            if(season.includes(monthZhi)) {
                return WuxingCalculator.elementMap.gan[dayGan] === element;
            }
        }
        return false;
    },

    // 检查天干组合
    checkGanCombinations: function(...gans) {
        const combinations = [];
        const ganPairs = {
            '甲己': '土',
            '乙庚': '金',
            '丙辛': '水',
            '丁壬': '木',
            '戊癸': '火'
        };
        
        for(let i = 0; i < gans.length; i++) {
            for(let j = i + 1; j < gans.length; j++) {
                const pair = gans[i] + gans[j];
                for(let [combo, element] of Object.entries(ganPairs)) {
                    if(combo.includes(gans[i]) && combo.includes(gans[j])) {
                        combinations.push(`天干${element}合`);
                    }
                }
            }
        }
        
        return combinations;
    },

    // 检查地支组合
    checkZhiCombinations: function(...zhis) {
        const combinations = [];
        const zhiTriples = {
            '寅午戌': '火',
            '申子辰': '水',
            '亥卯未': '木',
            '巳酉丑': '金'
        };
        
        // 检查三合
        for(let [triple, element] of Object.entries(zhiTriples)) {
            let count = zhis.filter(zhi => triple.includes(zhi)).length;
            if(count >= 2) {
                combinations.push(`地支${element}局`);
            }
        }
        
        // 检查六合
        const zhiPairs = {
            '子丑': '土',
            '寅亥': '木',
            '卯戌': '火',
            '辰酉': '金',
            '巳申': '水',
            '午未': '土'
        };
        
        for(let i = 0; i < zhis.length; i++) {
            for(let j = i + 1; j < zhis.length; j++) {
                const pair = zhis[i] + zhis[j];
                for(let [combo, element] of Object.entries(zhiPairs)) {
                    if(combo.includes(zhis[i]) && combo.includes(zhis[j])) {
                        combinations.push(`地支${element}合`);
                    }
                }
            }
        }
        
        return combinations;
    },

    // 分析神煞
    analyzeShensha: function(baziData) {
        const result = {
            positive: [],
            negative: [],
            score: 0
        };
        
        // 检查天乙贵人
        if(this.hasTianyi(baziData.ganzhi)) {
            result.positive.push({
                name: '天乙贵人',
                effect: '主贵人相助，逢凶化吉'
            });
            result.score += 10;
        }
        
        // 检查文昌贵人
        if(this.hasWenchang(baziData.ganzhi)) {
            result.positive.push({
                name: '文昌贵人',
                effect: '主学业事业有成，才华出众'
            });
            result.score += 8;
        }
        
        // 检查孤辰寡宿
        if(this.hasGuchen(baziData.ganzhi)) {
            result.negative.push({
                name: '孤辰寡宿',
                effect: '主人际关系欠佳，感情易孤独'
            });
            result.score -= 5;
        }
        
        // 检查劫煞
        if(this.hasJiesha(baziData.ganzhi)) {
            result.negative.push({
                name: '劫煞',
                effect: '主有突发变故，需谨慎行事'
            });
            result.score -= 6;
        }
        
        return result;
    },

    // 检查天乙贵人
    hasTianyi: function(ganzhi) {
        const tianyiMap = {
            '甲': '丑未',
            '乙': '子申',
            '丙戊': '亥酉',
            '丁己': '午辰',
            '庚': '卯巳',
            '辛': '寅戌',
            '壬癸': '丑未'
        };
        
        const dayGan = ganzhi.day[0];
        const positions = Object.entries(tianyiMap)
            .find(([key]) => key.includes(dayGan))?.[1];
            
        if(!positions) return false;
        
        return Object.values(ganzhi)
            .some(gz => positions.includes(gz[1]));
    },

    // 检查文昌贵人
    hasWenchang: function(ganzhi) {
        const wenchangMap = {
            '甲': '巳',
            '乙': '午',
            '丙戊': '申',
            '丁己': '酉',
            '庚': '亥',
            '辛': '子',
            '壬': '寅',
            '癸': '卯'
        };
        
        const dayGan = ganzhi.day[0];
        const position = Object.entries(wenchangMap)
            .find(([key]) => key.includes(dayGan))?.[1];
            
        if(!position) return false;
        
        return Object.values(ganzhi)
            .some(gz => gz[1] === position);
    },

    // 检查孤辰寡宿
    hasGuchen: function(ganzhi) {
        const guchen = '寅卯辰巳午未';
        const gusu = '申酉戌亥子丑';
        
        let guchenCount = 0;
        let gusuCount = 0;
        
        Object.values(ganzhi).forEach(gz => {
            if(guchen.includes(gz[1])) guchenCount++;
            if(gusu.includes(gz[1])) gusuCount++;
        });
        
        return guchenCount === 1 || gusuCount === 1;
    },

    // 检查劫煞
    hasJiesha: function(ganzhi) {
        const jieshaMap = {
            '甲': '庚',
            '乙': '辛',
            '丙': '壬',
            '丁': '癸',
            '戊': '甲',
            '己': '乙',
            '庚': '丙',
            '辛': '丁',
            '壬': '戊',
            '癸': '己'
        };
        
        const dayGan = ganzhi.day[0];
        const jiesha = jieshaMap[dayGan];
        
        return Object.values(ganzhi)
            .some(gz => gz[0] === jiesha);
    }
};

// 导出模块
if(typeof module !== 'undefined' && module.exports) {
    module.exports = BaziAnalyzer;
} 