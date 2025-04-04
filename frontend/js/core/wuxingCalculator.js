// 五行计算核心模块

const WuxingCalculator = {
    // 五行属性映射
    elementMap: {
        gan: {
            甲: '木', 乙: '木',
            丙: '火', 丁: '火',
            戊: '土', 己: '土',
            庚: '金', 辛: '金',
            壬: '水', 癸: '水'
        },
        zhi: {
            子: '水', 丑: '土',
            寅: '木', 卯: '木',
            辰: '土', 巳: '火',
            午: '火', 未: '土',
            申: '金', 酉: '金',
            戌: '土', 亥: '水'
        }
    },

    // 计算五行比例
    getBalance: function(ganzhi) {
        const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
        
        // 计算天干五行
        Object.entries(ganzhi).forEach(([key, value]) => {
            const gan = value.charAt(0);
            const zhi = value.charAt(1);
            
            // 天干权重1.2
            elements[this.elementMap.gan[gan]] += 1.2;
            // 地支权重1.0
            elements[this.elementMap.zhi[zhi]] += 1.0;
        });
        
        // 归一化处理
        const total = Object.values(elements).reduce((a, b) => a + b, 0);
        return Object.fromEntries(
            Object.entries(elements).map(([k, v]) => [k, (v/total*100).toFixed(1)])
        );
    },

    // 判断五行格局
    getPattern: function(ganzhi) {
        const balance = this.getBalance(ganzhi);
        const patterns = [];
        
        // 判断五行偏旺
        const max = Math.max(...Object.values(balance).map(Number));
        const min = Math.min(...Object.values(balance).map(Number));
        
        if(max > 35) {
            const element = Object.entries(balance).find(([k,v]) => Number(v) === max)[0];
            patterns.push(`${element}旺`);
        }
        
        if(min < 10) {
            const element = Object.entries(balance).find(([k,v]) => Number(v) === min)[0];
            patterns.push(`${element}弱`);
        }
        
        // 判断五行相生相克
        if(this.hasGenerationCycle(ganzhi)) {
            patterns.push('五行相生');
        }
        
        if(this.hasControlCycle(ganzhi)) {
            patterns.push('五行相克');
        }
        
        return patterns;
    },

    // 检查五行相生循环
    hasGenerationCycle: function(ganzhi) {
        const elements = Object.values(ganzhi).map(gz => this.elementMap.gan[gz[0]]);
        const cycle = ['木', '火', '土', '金', '水'];
        
        let count = 0;
        for(let i = 0; i < elements.length; i++) {
            const current = elements[i];
            const next = elements[(i + 1) % elements.length];
            if(cycle.indexOf(next) === (cycle.indexOf(current) + 1) % 5) {
                count++;
            }
        }
        
        return count >= 3;
    },

    // 检查五行相克循环
    hasControlCycle: function(ganzhi) {
        const elements = Object.values(ganzhi).map(gz => this.elementMap.gan[gz[0]]);
        const cycle = ['木', '土', '水', '火', '金'];
        
        let count = 0;
        for(let i = 0; i < elements.length; i++) {
            const current = elements[i];
            const next = elements[(i + 1) % elements.length];
            if(cycle.indexOf(next) === (cycle.indexOf(current) + 1) % 5) {
                count++;
            }
        }
        
        return count >= 3;
    },

    // 计算日主旺衰
    getDayMasterStrength: function(ganzhi, birthMonth) {
        const dayElement = this.elementMap.gan[ganzhi.day[0]];
        const monthElement = this.elementMap.zhi[ganzhi.month[1]];
        let strength = 5; // 基础分
        
        // 月令旺相休囚死
        const seasonMap = {
            木: [2,3,4], // 春
            火: [5,6,7], // 夏
            土: [1,7,10,4], // 四季
            金: [8,9,10], // 秋
            水: [11,12,1] // 冬
        };
        
        // 根据月令加分
        if(seasonMap[dayElement].includes(birthMonth)) {
            strength += 2;
        }
        
        // 根据五行关系加分
        if(this.isGenerating(monthElement, dayElement)) {
            strength += 1;
        } else if(this.isControlling(monthElement, dayElement)) {
            strength -= 1;
        }
        
        return {
            score: strength,
            status: this.getStrengthStatus(strength)
        };
    },

    // 判断生克关系
    isGenerating: function(e1, e2) {
        const cycle = {
            木: '火',
            火: '土',
            土: '金',
            金: '水',
            水: '木'
        };
        return cycle[e1] === e2;
    },

    isControlling: function(e1, e2) {
        const cycle = {
            木: '土',
            土: '水',
            水: '火',
            火: '金',
            金: '木'
        };
        return cycle[e1] === e2;
    },

    // 获取强弱状态描述
    getStrengthStatus: function(score) {
        if(score >= 8) return '极旺';
        if(score >= 6) return '旺';
        if(score >= 4) return '平衡';
        if(score >= 2) return '弱';
        return '极弱';
    }
};

// 导出模块
if(typeof module !== 'undefined' && module.exports) {
    module.exports = WuxingCalculator;
} 