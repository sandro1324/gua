/**
 * 塔罗牌占卜页面主脚本
 * 整合API功能和DOM操作
 */

import tarotAPI from './core/tarotAPI.js';

// 初始化变量
let selectedElement = null;
let currentLanguage = 'zh';
let readingResults = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化塔罗API
    await tarotAPI.init();
    
    // 获取DOM元素
    const loadingOverlay = document.getElementById('loadingOverlay');
    const elementCards = document.querySelectorAll('.element-card');
    const questionInput = document.getElementById('question');
    const drawButton = document.querySelector('.draw-cards-btn');
    const languageToggle = document.querySelector('.language-toggle');
    
    // 隐藏加载动画
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 2000);
    
    // 元素选择事件
    elementCards.forEach(card => {
        card.querySelector('.element-select-btn').addEventListener('click', () => {
            // 移除其他卡片的选中状态
            elementCards.forEach(c => c.classList.remove('selected'));
            // 添加当前卡片的选中状态
            card.classList.add('selected');
            selectedElement = card.dataset.element;
        });
    });
    
    // 抽取卡牌事件
    drawButton.addEventListener('click', async () => {
        if (!selectedElement) {
            showMessage(currentLanguage === 'zh' ? '请先选择一个元素' : 'Please select an element first');
            return;
        }
        
        const question = questionInput.value.trim();
        if (!question) {
            showMessage(currentLanguage === 'zh' ? '请输入您的问题' : 'Please enter your question');
            return;
        }
        
        try {
            // 显示加载动画
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
            
            // 执行占卜
            readingResults = await tarotAPI.performElementalReading(selectedElement, question, currentLanguage);
            
            // 隐藏加载动画
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                
                // 显示读牌结果
                displayReadingResults(readingResults);
            }, 500);
        } catch (error) {
            console.error('Error during tarot reading:', error);
            loadingOverlay.style.display = 'none';
            showMessage(currentLanguage === 'zh' ? '读牌时发生错误' : 'Error during reading');
        }
    });
    
    // 语言切换事件
    languageToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        updateLanguage();
        
        // 如果已有读牌结果，更新显示
        if (readingResults) {
            readingResults = {
                ...readingResults,
                summary: generateSummary(readingResults.cards, readingResults.style, currentLanguage)
            };
            displayReadingResults(readingResults);
        }
    });
});

/**
 * 生成占卜总结
 * @param {Array} cards - 卡牌数组
 * @param {string} style - 解读风格
 * @param {string} language - 语言
 */
function generateSummary(cards, style, language) {
    const styles = {
        dynamic: {
            zh: '充满活力的',
            en: 'dynamic'
        },
        emotional: {
            zh: '情感丰富的',
            en: 'emotionally rich'
        },
        intellectual: {
            zh: '思想深刻的',
            en: 'thoughtful'
        },
        practical: {
            zh: '实用性强的',
            en: 'practical'
        },
        basic: {
            zh: '基础的',
            en: 'basic'
        }
    };
    
    const styleText = styles[style]?.[language] || styles.basic[language];
    
    return language === 'zh'
        ? `这个牌阵显示了一个${styleText}情况。深入探索每张牌以获取更详细的指引。`
        : `This spread reveals a ${styleText} situation. Explore each card for more detailed guidance.`;
}

/**
 * 显示读牌结果
 * @param {Object} results - 读牌结果
 */
function displayReadingResults(results) {
    const resultsContainer = document.querySelector('.reading-results');
    const questionDisplay = document.querySelector('.question-display');
    const overallReading = document.querySelector('.overall-reading');
    
    // 显示问题
    questionDisplay.innerHTML = `
        <h3>${currentLanguage === 'zh' ? '您的问题' : 'Your Question'}</h3>
        <p>${results.question}</p>
    `;
    
    // 显示总体解读
    overallReading.innerHTML = `
        <h3>${currentLanguage === 'zh' ? '塔罗牌解读' : 'Tarot Reading'}</h3>
        <p>${results.summary}</p>
        <div class="cards-container">
            ${results.cards.map((card, index) => `
                <div class="card-result" data-card="${card.name}">
                    <img src="assets/tarot/images/${card.image}" alt="${card.name}">
                    <h4>${currentLanguage === 'zh' ? (card.nameCN || card.name) : card.name}</h4>
                    <p class="card-position">${card.position.name}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // 显示结果区域
    resultsContainer.style.display = 'block';
    
    // 添加卡牌点击事件
    document.querySelectorAll('.card-result').forEach(cardElement => {
        cardElement.addEventListener('click', () => {
            const cardName = cardElement.dataset.card;
            const card = findCard(cardName);
            if (card) {
                showCardDetails(card);
            }
        });
    });
    
    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 查找卡牌
 * @param {string} name - 卡牌名称
 */
function findCard(name) {
    // 从读牌结果中查找卡牌
    if (readingResults && readingResults.cards) {
        return readingResults.cards.find(card => card.name === name);
    }
    return null;
}

/**
 * 显示卡牌详情
 * @param {Object} card - 卡牌数据
 */
function showCardDetails(card) {
    const detailsContainer = document.querySelector('.card-details-container');
    const cardDetails = tarotAPI.showCardDetails(card, currentLanguage);
    
    detailsContainer.innerHTML = `
        <div class="card-details">
            <h3>${cardDetails.name}</h3>
            <img src="assets/tarot/images/${cardDetails.image}" alt="${cardDetails.name}">
            <div class="card-meaning">
                <h4>${currentLanguage === 'zh' ? '位置' : 'Position'}: ${card.position.name}</h4>
                <p>${card.position.description}</p>
            </div>
            <div class="card-meaning">
                <h4>${currentLanguage === 'zh' ? '关键词' : 'Keywords'}</h4>
                <p>${Array.isArray(cardDetails.keywords) ? cardDetails.keywords.join(', ') : cardDetails.keywords}</p>
            </div>
            <div class="card-meaning">
                <h4>${currentLanguage === 'zh' ? '牌义' : 'Meaning'}</h4>
                <p>${cardDetails.meaning}</p>
            </div>
            <button class="close-details">${currentLanguage === 'zh' ? '关闭' : 'Close'}</button>
        </div>
    `;
    
    detailsContainer.style.display = 'flex';
    
    // 添加关闭按钮事件
    detailsContainer.querySelector('.close-details').addEventListener('click', () => {
        detailsContainer.style.display = 'none';
    });
}

/**
 * 更新界面语言
 */
function updateLanguage() {
    const elements = {
        fire: {
            zh: { name: '火', traits: '热情、行动、力量、转变' },
            en: { name: 'Fire', traits: 'Passion, Action, Power, Transformation' }
        },
        water: {
            zh: { name: '水', traits: '情感、直觉、流动、治愈' },
            en: { name: 'Water', traits: 'Emotion, Intuition, Flow, Healing' }
        },
        air: {
            zh: { name: '风', traits: '思想、沟通、自由、清晰' },
            en: { name: 'Air', traits: 'Thought, Communication, Freedom, Clarity' }
        },
        earth: {
            zh: { name: '土', traits: '稳定、物质、实用、成长' },
            en: { name: 'Earth', traits: 'Stability, Material, Practical, Growth' }
        }
    };
    
    // 更新页面标题
    document.querySelector('.tarot-title').textContent = currentLanguage === 'zh' ? '元素塔罗占卜' : 'Elemental Tarot Reading';
    
    // 更新元素卡片
    document.querySelectorAll('.element-card').forEach(card => {
        const element = card.dataset.element;
        const lang = elements[element][currentLanguage];
        
        card.querySelector('.element-name').textContent = lang.name;
        card.querySelector('.element-traits').textContent = lang.traits;
        
        // 更新元素描述
        const desc = card.querySelector('.element-desc');
        if (currentLanguage === 'zh') {
            desc.textContent = {
                fire: '火元素牌阵适合探索激情、创造力、动力和转变的问题。当你需要明确方向和激发能量时，火元素将为你指引。',
                water: '水元素牌阵适合探索情感、关系、直觉和潜意识的问题。当你需要理解情感变化或增强直觉时，水元素将为你解答。',
                air: '风元素牌阵适合探索思想、沟通、学习和决策的问题。当你需要清晰思考或解决沟通障碍时，风元素将为你梳理。',
                earth: '土元素牌阵适合探索物质、财务、职业和实际问题。当你需要稳定基础或实现具体目标时，土元素将为你支持。'
            }[element];
        } else {
            desc.textContent = {
                fire: 'Fire spreads are ideal for exploring passion, creativity, drive and transformation. When you need direction and energy, fire will guide you.',
                water: 'Water spreads are perfect for emotional matters, relationships, intuition and the subconscious. When you need to understand feelings, water will answer.',
                air: 'Air spreads are suitable for thoughts, communication, learning and decisions. When you need mental clarity or solutions to barriers, air will help.',
                earth: 'Earth spreads address material concerns, finances, career and practical matters. When you need stability or to achieve tangible goals, earth will support you.'
            }[element];
        }
    });
    
    // 更新占卜面板
    document.querySelector('.panel-header').textContent = currentLanguage === 'zh' ? '元素塔罗解读' : 'Elemental Tarot Reading';
    document.querySelector('.question-label').textContent = currentLanguage === 'zh' ? '输入您的问题:' : 'Enter your question:';
    document.querySelector('.draw-cards-btn').textContent = currentLanguage === 'zh' ? '抽取塔罗牌' : 'Draw Cards';
    
    // 更新问题输入框
    const questionInput = document.getElementById('question');
    questionInput.placeholder = currentLanguage === 'zh' 
        ? '例如：我应该如何处理目前的工作挑战？'
        : 'Example: How should I handle my current work challenges?';
    
    // 更新语言切换按钮
    document.querySelector('.language-toggle').textContent = currentLanguage === 'zh' ? 'English' : '中文';
    
    // 更新返回主页链接
    document.querySelector('.home-link span').textContent = currentLanguage === 'zh' ? '返回主页' : 'Return Home';
    
    // 更新页脚
    document.querySelector('.tarot-footer p').textContent = currentLanguage === 'zh' 
        ? '© 2023 元素塔罗占卜 | Elemental Tarot Reading. 探索生命中的元素平衡。'
        : '© 2023 Elemental Tarot Reading. Explore the elemental balance in your life.';
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 */
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
} 