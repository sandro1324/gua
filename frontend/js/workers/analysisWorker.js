// 八字分析Worker

// 导入必要的计算模块
importScripts('../core/wuxingCalculator.js');
importScripts('../core/baziAnalyzer.js');

self.onmessage = function(e) {
    if(e.data.type === 'fullAnalysis') {
        const result = {};
        
        try {
            const { userData, baziData } = e.data.data;
            
            // 基础数据处理
            result.userData = userData;
            result.baziData = baziData;
            self.postMessage({type: 'progress', value: 20});
            
            // 五行分析
            result.wuxingBalance = WuxingCalculator.getBalance(baziData.ganzhi);
            result.wuxingPattern = WuxingCalculator.getPattern(baziData.ganzhi);
            self.postMessage({type: 'progress', value: 40});
            
            // 命局格局分析
            result.patterns = BaziAnalyzer.getPattern(baziData);
            result.nayin = BaziAnalyzer.getNayin(baziData.ganzhi.day);
            self.postMessage({type: 'progress', value: 60});
            
            // 大运流年分析
            result.dayunData = generateDayunData(baziData);
            self.postMessage({type: 'progress', value: 80});
            
            // 神煞分析
            result.shenshaData = BaziAnalyzer.analyzeShensha(baziData);
            
            // 完成分析
            self.postMessage({type: 'progress', value: 100});
            self.postMessage({type: 'result', result: result});
            
        } catch (error) {
            self.postMessage({
                type: 'error',
                error: error.message
            });
        }
    }
};

// 生成大运数据
function generateDayunData(baziData) {
    const dayunData = {
        startAge: calculateStartAge(baziData),
        direction: calculateDirection(baziData),
        periods: []
    };
    
    // 生成八个大运
    for(let i = 0; i < 8; i++) {
        const period = {
            startAge: dayunData.startAge + i * 10,
            endAge: dayunData.startAge + (i + 1) * 10 - 1,
            ganzhi: calculateDayunGanzhi(baziData, i, dayunData.direction),
            analysis: analyzeDayunPeriod(baziData, i)
        };
        dayunData.periods.push(period);
    }
    
    return dayunData;
}

// 计算大运起始年龄
function calculateStartAge(baziData) {
    const gender = baziData.gender;
    const monthGan = baziData.ganzhi.month[0];
    const isYang = "甲丙戊庚壬".includes(monthGan);
    
    // 根据性别和月干阴阳确定起运年龄
    let monthAge = 1;
    if((gender === "男" && isYang) || (gender === "女" && !isYang)) {
        monthAge = 1;
    } else {
        monthAge = 0;
    }
    
    return monthAge + 3; // 实际应该根据出生时辰和月份精确计算
}

// 计算大运方向
function calculateDirection(baziData) {
    const gender = baziData.gender;
    const dayGan = baziData.ganzhi.day[0];
    const isYang = "甲丙戊庚壬".includes(dayGan);
    
    return (gender === "男" && isYang) || (gender === "女" && !isYang) ? "顺行" : "逆行";
}

// 分析大运周期
function analyzeDayunPeriod(baziData, index) {
    return {
        overall: calculateOverallLuck(baziData, index),
        career: analyzeCareer(baziData, index),
        wealth: analyzeWealth(baziData, index),
        relationship: analyzeRelationship(baziData, index),
        health: analyzeHealth(baziData, index)
    };
}

// 计算总体运势
function calculateOverallLuck(baziData, index) {
    // 实现具体的运势计算逻辑
    return {
        score: 75 + Math.random() * 20 - 10,
        description: "运势平稳，可稳步发展"
    };
}

// 分析事业运势
function analyzeCareer(baziData, index) {
    // 实现具体的事业分析逻辑
    return {
        score: 70 + Math.random() * 20 - 10,
        advice: "适合稳健发展，注意把握机会"
    };
}

// 分析财运
function analyzeWealth(baziData, index) {
    // 实现具体的财运分析逻辑
    return {
        score: 65 + Math.random() * 20 - 10,
        advice: "理财宜稳健，避免冒险投资"
    };
}

// 分析感情运势
function analyzeRelationship(baziData, index) {
    // 实现具体的感情分析逻辑
    return {
        score: 80 + Math.random() * 20 - 10,
        advice: "人际关系和谐，感情发展顺利"
    };
}

// 分析健康状况
function analyzeHealth(baziData, index) {
    // 实现具体的健康分析逻辑
    return {
        score: 75 + Math.random() * 20 - 10,
        advice: "注意作息规律，保持运动习惯"
    };
} 