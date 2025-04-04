/**
 * 五行过旺健康分析脚本
 * 用于增强八字分析结果中的健康建议
 */

// 五行过旺健康建议函数
function addExcessElementAdvice(element) {
    const advice = {
        '木': [
            '木气过旺，容易出现肝胆疾病，建议调节情绪，避免暴怒。',
            '多注意眼睛、肌腱、筋脉、手脚的保健。',
            '饮食上宜清淡，少吃酸味和油腻食物，多吃辛辣、甘甜食物以调节。',
            '运动宜柔和舒缓，如太极、瑜伽等，避免过度竞争性运动。'
        ],
        '火': [
            '火气过旺，容易出现心脏、小肠疾病，建议保持心情舒畅，避免过度兴奋。',
            '多注意心脏、血管、面色、视力的保健。',
            '饮食上宜清凉，避免辛辣刺激性食物，多吃苦味和咸味食物以调节。',
            '睡眠要充足，避免熬夜，保持情绪稳定。'
        ],
        '土': [
            '土气过旺，容易出现脾胃、消化系统疾病，建议避免过度思虑忧愁。',
            '多注意脾胃、肌肉、口腔的保健。',
            '饮食上避免过甜和黏腻食物，多吃酸味食物以调节，注意饮食规律。',
            '适当进行有氧运动，保持身体灵活性。'
        ],
        '金': [
            '金气过旺，容易出现肺部、大肠疾病，建议避免过度悲忧。',
            '多注意呼吸系统、皮肤、鼻子的保健。',
            '饮食上避免辛辣食物，多吃酸味和甘甜食物以调节，注意饮食卫生。',
            '呼吸新鲜空气，进行适度的肺部锻炼，如慢跑、游泳等。'
        ],
        '水': [
            '水气过旺，容易出现肾脏、膀胱、泌尿系统疾病，建议避免过度恐惧。',
            '多注意耳朵、骨骼、头发的保健。',
            '饮食上避免过咸和寒凉食物，多吃温补食物，适量补充蛋白质。',
            '保持充足的睡眠，避免熬夜，保持下半身温暖。'
        ]
    };
    
    return advice[element] || [];
}

// 五行过旺健康分析总函数
function enhanceHealthSummary(baziData) {
    try {
        // 获取五行统计
        const wuxingStats = baziData.wuxingStats || {};
        
        // 设置过旺的阈值（可根据需要调整）
        const excessThreshold = 7;
        
        // 存储过旺的五行
        const excessElements = [];
        
        // 检查哪些五行过旺
        for (const element in wuxingStats) {
            if (wuxingStats[element] >= excessThreshold) {
                excessElements.push(element);
            }
        }
        
        // 如果没有过旺的五行，直接返回空
        if (excessElements.length === 0) {
            return null;
        }
        
        // 生成健康建议
        let healthSummary = '<div class="section health-advice"><h3>五行过旺健康提示</h3><ul>';
        
        // 添加每个过旺五行的建议
        excessElements.forEach(element => {
            const adviceList = addExcessElementAdvice(element);
            healthSummary += `<li><strong>${element}气过旺</strong>：${adviceList.join(' ')}</li>`;
        });
        
        healthSummary += '</ul></div>';
        
        return healthSummary;
    } catch (error) {
        console.error('处理五行过旺健康分析出错:', error);
        return null;
    }
}

// 直接添加到页面的函数
function addHealthSummaryToPage() {
    // 查找全局变量中的八字数据
    let baziData = null;
    
    // 尝试多种可能的方式获取八字数据
    if (window.baziData) {
        baziData = window.baziData;
    } else if (window.userData && window.userData.baziData) {
        baziData = window.userData.baziData;
    } else {
        // 尝试从页面中提取五行统计数据
        try {
            baziData = {wuxingStats: {}};
            // 从页面上的五行统计表格或元素中获取数据
            const wuxingItems = document.querySelectorAll('.wuxing-item');
            wuxingItems.forEach(item => {
                const label = item.querySelector('.wuxing-label').textContent.trim();
                const value = parseInt(item.querySelector('.wuxing-value').textContent);
                
                // 根据标签获取五行名称
                let element = '';
                if (label === '木' || label === 'Wood') element = '木';
                else if (label === '火' || label === 'Fire') element = '火';
                else if (label === '土' || label === 'Earth') element = '土';
                else if (label === '金' || label === 'Metal') element = '金';
                else if (label === '水' || label === 'Water') element = '水';
                
                if (element && !isNaN(value)) {
                    baziData.wuxingStats[element] = value;
                }
            });
        } catch (error) {
            console.error('无法从页面获取五行统计数据:', error);
            return;
        }
    }
    
    // 如果获取到了数据，生成健康建议并添加到页面
    if (baziData && Object.keys(baziData.wuxingStats || {}).length > 0) {
        const healthSummary = enhanceHealthSummary(baziData);
        
        if (healthSummary) {
            // 找到合适的位置插入健康建议
            const container = document.querySelector('.container');
            if (container) {
                // 创建一个新的节点
                const healthDiv = document.createElement('div');
                healthDiv.innerHTML = healthSummary;
                
                // 添加到容器末尾
                container.appendChild(healthDiv);
                console.log('已添加五行过旺健康建议');
            } else {
                console.error('无法找到容器元素');
            }
        }
    } else {
        console.error('无法获取八字数据或五行统计信息');
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('五行过旺分析模块已加载');
    
    // 延迟执行，确保页面其他元素已加载
    setTimeout(function() {
        // 尝试添加健康建议
        addHealthSummaryToPage();
        
        // 如果存在renderBaziContent函数，增强它
        if (typeof window.renderBaziContent === 'function') {
            const originalRenderBaziContent = window.renderBaziContent;
            
            // 重新定义renderBaziContent函数
            window.renderBaziContent = function(baziData) {
                // 调用原始函数
                originalRenderBaziContent(baziData);
                
                // 添加五行过旺健康分析
                setTimeout(function() {
                    const healthSummary = enhanceHealthSummary(baziData);
                    
                    if (healthSummary) {
                        // 找到容器并添加健康建议
                        const container = document.querySelector('.container');
                        if (container) {
                            // 检查是否已存在健康建议
                            if (!container.querySelector('.health-advice')) {
                                // 创建一个新的节点
                                const healthDiv = document.createElement('div');
                                healthDiv.innerHTML = healthSummary;
                                
                                // 添加到容器末尾
                                container.appendChild(healthDiv);
                                console.log('已添加五行过旺健康建议');
                            }
                        }
                    }
                }, 500); // 延迟执行，确保DOM已更新
            };
            
            console.log('已增强renderBaziContent函数');
        }
    }, 1000); // 等待1秒，确保页面已完全加载
}); 