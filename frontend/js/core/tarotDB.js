// 路径生成函数
export function getCardImagePath(card) {
    // 根据卡牌类型确定子目录
    let subDir = '';
    if (card.type === 'major') {
        subDir = 'major';
    } else if (card.type === 'minor') {
        switch (card.suit) {
            case 'cups':
                subDir = 'cups';
                break;
            case 'pentacles':
                subDir = 'pentacles';
                break;
            case 'swords':
                subDir = 'swords';
                break;
            case 'wands':
                subDir = 'wands';
                break;
        }
    }

    // 构建完整的图片路径
    return `/cards/${subDir}/${card.image}`;
}

// 路径验证函数
export function validateCardPath(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功:', path);
            resolve(true);
        };
        img.onerror = () => {
            console.error('图片加载失败:', path);
            // 尝试备用路径
            const fallbackPath = path.replace('/cards/', '/');
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                console.log('备用路径加载成功:', fallbackPath);
                resolve(true);
            };
            fallbackImg.onerror = () => {
                console.error('备用路径也失败:', fallbackPath);
                reject(new Error('图片加载失败'));
            };
            fallbackImg.src = fallbackPath;
        };
        img.src = path;
    });
} 