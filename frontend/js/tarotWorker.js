// 塔罗牌洗牌Worker
self.onmessage = function(e) {
    try {
        const { deck, spreadType } = e.data;
        
        // 洗牌函数
        function shuffleDeck(deck) {
            const shuffled = [...deck];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        // 根据牌阵类型选择卡牌数量
        const spreadMap = {
            'three-card': 3,
            'celtic-cross': 10,
            'wheel-of-year': 12
        };
        
        const numCards = spreadMap[spreadType] || 3;
        
        // 洗牌
        const shuffledDeck = shuffleDeck(deck);
        
        // 选择卡牌
        const selectedCards = shuffledDeck.slice(0, numCards);
        
        // 返回结果
        self.postMessage({
            success: true,
            cards: selectedCards
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
}; 