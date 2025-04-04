/**
 * 塔罗牌应用API
 * 整合数据库、洗牌功能和解释功能
 */

import { majorArcana, minorArcana, spreadPositions } from './tarotDB.js';

// API主类
class TarotAPI {
    constructor() {
        this.initialized = false;
        this.useWorker = window.Worker !== undefined;
        this.worker = null;
        this.audioCache = {};
    }

    /**
     * 初始化API
     */
    async init() {
        // 预加载音频资源
        await this.preloadAudio([
            'assets/tarot/sounds/shuffle.mp3',
            'assets/tarot/sounds/card-flip.mp3',
            'assets/tarot/sounds/reveal.mp3'
        ]);

        // 如果浏览器支持Worker，初始化洗牌Worker
        if (this.useWorker) {
            this.worker = new Worker('./js/workers/tarotWorker.js');
        }

        this.initialized = true;
        return this;
    }

    /**
     * 获取完整牌组
     */
    getFullDeck() {
        return [
            ...Object.values(majorArcana),
            ...Object.values(minorArcana.wands),
            ...Object.values(minorArcana.cups),
            ...Object.values(minorArcana.swords),
            ...Object.values(minorArcana.pentacles)
        ];
    }

    /**
     * 按元素获取牌组
     * @param {string} element - 元素名称(fire, water, air, earth)
     */
    getElementalDeck(element) {
        const elementMap = {
            fire: ['wands'],
            water: ['cups'],
            air: ['swords'],
            earth: ['pentacles']
        };

        const suits = elementMap[element] || [];
        const deck = [
            ...Object.values(majorArcana),
            ...suits.flatMap(suit => Object.values(minorArcana[suit] || {}))
        ];

        return deck;
    }

    /**
     * 获取牌阵定义
     * @param {string} spreadType - 牌阵类型
     * @param {string} language - 语言(zh/en)
     */
    getSpreadDefinition(spreadType, language = 'zh') {
        const spread = spreadPositions[spreadType];
        if (!spread) return null;

        return spread.map(position => ({
            name: language === 'zh' ? position.nameCN : position.name,
            description: language === 'zh' ? position.descriptionCN : position.description
        }));
    }

    /**
     * 执行洗牌
     * @param {Array} deck - 要洗的牌组
     * @param {string} spreadType - 牌阵类型
     */
    performShuffle(deck, spreadType) {
        return new Promise((resolve) => {
            if (this.useWorker) {
                // 使用Worker异步处理
                const worker = this.worker;
                worker.onmessage = function(e) {
                    if (e.data.success) {
                        resolve(e.data.cards);
                    }
                };
                worker.postMessage({ deck, spreadType });
            } else {
                // 同步处理
                const shuffled = this.shuffleArray([...deck]);
                const numCards = this.getCardCount(spreadType);
                resolve(shuffled.slice(0, numCards));
            }
        });
    }

    /**
     * 同步洗牌算法
     * @private
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * 获取牌阵所需卡牌数量
     * @private
     */
    getCardCount(spreadType) {
        const spreadSizes = {
            'three-card': 3,
            'celtic-cross': 10,
            'wheel-of-year': 12
        };
        return spreadSizes[spreadType] || 3;
    }

    /**
     * 预加载音频资源
     * @private
     */
    async preloadAudio(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve) => {
                const audio = new Audio();
                audio.src = url;
                this.audioCache[url] = audio;
                audio.addEventListener('canplaythrough', () => resolve());
                audio.load();
            });
        });
        return Promise.all(promises);
    }

    /**
     * 播放音效
     * @param {string} type - 音效类型
     */
    playSound(type) {
        let url;
        switch(type) {
            case 'shuffle':
                url = 'assets/tarot/sounds/shuffle.mp3';
                break;
            case 'flip':
                url = 'assets/tarot/sounds/card-flip.mp3';
                break;
            case 'reveal':
                url = 'assets/tarot/sounds/reveal.mp3';
                break;
            default:
                return;
        }

        const audio = this.audioCache[url] || new Audio(url);
        audio.volume = 0.3;
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio playback failed:', e));
    }

    /**
     * 解释塔罗牌阵
     * @param {Array} cards - 选中的卡牌
     * @param {string} spreadType - 牌阵类型
     * @param {string} language - 语言(zh/en)
     * @param {string} element - 元素(fire/water/air/earth)
     */
    interpretReading(cards, spreadType, language = 'zh', element = null) {
        const spread = this.getSpreadDefinition(spreadType, language);
        
        // 将卡牌与位置匹配
        const cardsWithPositions = cards.map((card, index) => {
            return {
                ...card,
                position: spread?.[index] || { 
                    name: language === 'zh' ? '位置' + (index + 1) : 'Position ' + (index + 1), 
                    description: '' 
                }
            };
        });

        // 根据元素和牌阵组合，生成适合的解读风格
        let style = 'basic';
        if (element) {
            switch(element) {
                case 'fire': style = 'dynamic'; break;
                case 'water': style = 'emotional'; break;
                case 'air': style = 'intellectual'; break;
                case 'earth': style = 'practical'; break;
            }
        }

        return {
            cards: cardsWithPositions,
            style,
            summary: this.generateReadingSummary(cardsWithPositions, style, language)
        };
    }

    /**
     * 生成读牌摘要
     * @private
     */
    generateReadingSummary(cards, style, language) {
        // 这里可以添加复杂的解析逻辑，现在先返回简单的结果
        const summary = language === 'zh' 
            ? `这个牌阵显示了一个${style === 'dynamic' ? '充满活力的' : style === 'emotional' ? '情感丰富的' : style === 'intellectual' ? '思想深刻的' : '实用性强的'}情况。`
            : `This spread reveals a ${style === 'dynamic' ? 'dynamic' : style === 'emotional' ? 'emotionally rich' : style === 'intellectual' ? 'thoughtful' : 'practical'} situation.`;
        
        return summary;
    }

    /**
     * 执行完整的塔罗牌阵读牌
     * @param {string} spreadType - 牌阵类型
     * @param {string} element - 元素类型(可选)
     * @param {string} language - 语言
     */
    async performFullReading(spreadType, element = null, language = 'zh') {
        // 播放洗牌声音
        this.playSound('shuffle');
        
        // 确定牌组
        const deck = element ? this.getElementalDeck(element) : this.getFullDeck();
        
        // 洗牌并抽取卡牌
        const cards = await this.performShuffle(deck, spreadType);
        
        // 解读牌阵
        return this.interpretReading(cards, spreadType, language, element);
    }

    /**
     * 执行元素塔罗牌阵
     * @param {string} element - 元素
     * @param {string} question - 问题
     * @param {string} language - 语言
     */
    async performElementalReading(element, question, language = 'zh') {
        // 根据元素和问题类型确定最佳牌阵
        let spreadType = 'three-card';
        
        // 这里可以根据问题关键词进行更智能的牌阵选择
        if (question.length > 100) {
            spreadType = 'celtic-cross';
        }
        
        // 执行读牌
        const result = await this.performFullReading(spreadType, element, language);
        
        // 添加问题到结果中
        return {
            ...result,
            question
        };
    }

    /**
     * 显示卡牌详细信息
     * @param {Object} card - 卡牌数据
     * @param {string} language - 语言
     */
    showCardDetails(card, language = 'zh') {
        this.playSound('flip');
        
        // 根据语言获取卡牌信息
        const name = language === 'zh' ? card.nameCN || card.name : card.name;
        const keywords = language === 'zh' ? card.keywordsCN || card.keywords : card.keywords;
        const meaning = language === 'zh' 
            ? card.meanings.uprightCN || card.meanings.upright 
            : card.meanings.upright;
        
        return {
            name,
            image: card.image,
            keywords,
            meaning,
            element: card.element
        };
    }
}

// 创建单例并导出
const tarotAPI = new TarotAPI();
export default tarotAPI; 