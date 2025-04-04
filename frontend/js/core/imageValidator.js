// 塔罗牌资源验证
export const verifyAssets = async () => {
    const requiredPaths = [
        // 大阿卡那牌
        'major/00-The Fool.jpg',
        'major/01-The Magician.jpg',
        'major/02-The High Priestess.jpg',
        'major/03-The Empress.jpg',
        'major/04-The Emperor.jpg',
        'major/05-The Hierophant.jpg',
        'major/06-The Lovers.jpg',
        'major/07-The Chariot.jpg',
        'major/08-Strength.jpg',
        'major/09-The Hermit.jpg',
        'major/10-Wheel of Fortune.jpg',
        'major/11-Justice.jpg',
        'major/12-The Hanged Man.jpg',
        'major/13-Death.jpg',
        'major/14-Temperance.jpg',
        'major/15-The Devil.jpg',
        'major/16-The Tower.jpg',
        'major/17-The Star.jpg',
        'major/18-The Moon.jpg',
        'major/19-The Sun.jpg',
        'major/20-Judgement.jpg',
        'major/21-The World.jpg',

        // 小阿卡那牌 - 权杖
        'wands/01-Ace of Wands.jpg',
        'wands/02-Two of Wands.jpg',
        'wands/03-Three of Wands.jpg',
        'wands/04-Four of Wands.jpg',
        'wands/05-Five of Wands.jpg',
        'wands/06-Six of Wands.jpg',
        'wands/07-Seven of Wands.jpg',
        'wands/08-Eight of Wands.jpg',
        'wands/09-Nine of Wands.jpg',
        'wands/10-Ten of Wands.jpg',
        'wands/11-Page of Wands.jpg',
        'wands/12-Knight of Wands.jpg',
        'wands/13-Queen of Wands.jpg',
        'wands/14-King of Wands.jpg',

        // 小阿卡那牌 - 圣杯
        'cups/01-Ace of Cups.jpg',
        'cups/02-Two of Cups.jpg',
        'cups/03-Three of Cups.jpg',
        'cups/04-Four of Cups.jpg',
        'cups/05-Five of Cups.jpg',
        'cups/06-Six of Cups.jpg',
        'cups/07-Seven of Cups.jpg',
        'cups/08-Eight of Cups.jpg',
        'cups/09-Nine of Cups.jpg',
        'cups/10-Ten of Cups.jpg',
        'cups/11-Page of Cups.jpg',
        'cups/12-Knight of Cups.jpg',
        'cups/13-Queen of Cups.jpg',
        'cups/14-King of Cups.jpg',

        // 小阿卡那牌 - 宝剑
        'swords/01-Ace of Swords.jpg',
        'swords/02-Two of Swords.jpg',
        'swords/03-Three of Swords.jpg',
        'swords/04-Four of Swords.jpg',
        'swords/05-Five of Swords.jpg',
        'swords/06-Six of Swords.jpg',
        'swords/07-Seven of Swords.jpg',
        'swords/08-Eight of Swords.jpg',
        'swords/09-Nine of Swords.jpg',
        'swords/10-Ten of Swords.jpg',
        'swords/11-Page of Swords.jpg',
        'swords/12-Knight of Swords.jpg',
        'swords/13-Queen of Swords.jpg',
        'swords/14-King of Swords.jpg',

        // 小阿卡那牌 - 星币
        'pentacles/01-Ace of Pentacles.jpg',
        'pentacles/02-Two of Pentacles.jpg',
        'pentacles/03-Three of Pentacles.jpg',
        'pentacles/04-Four of Pentacles.jpg',
        'pentacles/05-Five of Pentacles.jpg',
        'pentacles/06-Six of Pentacles.jpg',
        'pentacles/07-Seven of Pentacles.jpg',
        'pentacles/08-Eight of Pentacles.jpg',
        'pentacles/09-Nine of Pentacles.jpg',
        'pentacles/10-Ten of Pentacles.jpg',
        'pentacles/11-Page of Pentacles.jpg',
        'pentacles/12-Knight of Pentacles.jpg',
        'pentacles/13-Queen of Pentacles.jpg',
        'pentacles/14-King of Pentacles.jpg',

        // 元素图片
        'elements/fire-element.png',
        'elements/water-element.png',
        'elements/air-element.png',
        'elements/earth-element.png',

        // 其他资源
        'card-back-pattern.png',
        'crystal-ball.png',
        '../card-back.png'
    ];

    const missing = [];
    
    for(const path of requiredPaths){
        try {
            const response = await fetch(`assets/tarot/images/${path}`);
            if (!response.ok) {
                missing.push(path);
            }
        } catch (error) {
            missing.push(path);
        }
    }

    if(missing.length > 0){
        console.error(`缺失资源：\n${missing.join('\n')}`);
        return false;
    }
    return true;
}; 