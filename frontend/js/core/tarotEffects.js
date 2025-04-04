/**
 * 塔罗牌特效逻辑
 * 负责处理卡牌的动画、翻转、洗牌效果等
 */

// 音频效果管理
export const audioEffects = {
  /**
   * 预加载所有音频资源
   */
  preloadAll() {
    const sounds = ['shuffle', 'flip', 'crystal', 'fire', 'water', 'air', 'earth'];
    this.audioElements = {};
    
    sounds.forEach(sound => {
      const audio = new Audio(`assets/tarot/sounds/${sound}.mp3`);
      audio.load();
      this.audioElements[sound] = audio;
    });
  },
  
  /**
   * 播放特定音效
   * @param {string} type - 音效类型
   * @param {number} volume - 音量（0-1）
   */
  play(type, volume = 0.3) {
    if (!this.audioElements) this.preloadAll();
    
    if (this.audioElements[type]) {
      const audio = this.audioElements[type];
      audio.volume = volume;
      
      // 如果正在播放，重置并再次播放
      audio.pause();
      audio.currentTime = 0;
      
      audio.play().catch(e => console.log(`音频播放失败: ${e.message}`));
    } else {
      console.warn(`音效 ${type} 不存在`);
    }
  }
};

// 卡牌动画效果
export const cardAnimations = {
  /**
   * 创建洗牌动画
   * @param {Element} container - 卡牌容器元素
   * @param {number} cardCount - 卡牌数量
   * @param {Function} onComplete - 动画完成回调
   */
  shuffleDeck(container, cardCount = 5, onComplete = null) {
    // 清空容器
    container.innerHTML = '';
    
    // 创建卡牌
    for (let i = 0; i < cardCount; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.style.transform = `translateZ(${-i * 0.5}px)`;
      container.appendChild(card);
    }
    
    // 播放洗牌音效
    audioEffects.play('shuffle');
    
    const cards = container.querySelectorAll('.card');
    let completedCards = 0;
    
    cards.forEach((card, index) => {
      // 随机旋转和位置
      const randomX = Math.random() * 100 - 50;
      const randomY = Math.random() * 100 - 50;
      const randomRotate = Math.random() * 360;
      
      setTimeout(() => {
        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        
        setTimeout(() => {
          card.style.transform = 'translateZ(' + (-index * 0.5) + 'px)';
          
          // 检查是否所有卡牌动画已完成
          completedCards++;
          if (completedCards === cards.length && onComplete) {
            setTimeout(onComplete, 500);
          }
        }, 500);
      }, index * 100);
    });
  },
  
  /**
   * 翻牌动画
   * @param {Element} card - 卡牌元素
   * @param {Object} cardData - 卡牌数据
   * @param {boolean} isReversed - 是否逆位
   * @param {Function} onComplete - 动画完成回调
   */
  flipCard(card, cardData, isReversed = false, onComplete = null) {
    // 添加翻转类
    card.classList.add('flipping');
    
    // 播放翻牌音效
    audioEffects.play('flip');
    
    // 创建卡牌正面
    setTimeout(() => {
      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      
      const img = document.createElement('img');
      img.src = `assets/tarot/cards/${cardData.image}`;
      img.alt = cardData.name;
      img.classList.add('card-image');
      
      if (isReversed) {
        img.classList.add('reversed');
      }
      
      cardFront.appendChild(img);
      
      // 卡牌名称
      const nameElement = document.createElement('div');
      nameElement.classList.add('card-name');
      nameElement.textContent = cardData.name;
      cardFront.appendChild(nameElement);
      
      // 清空卡牌并添加正面
      card.innerHTML = '';
      card.appendChild(cardFront);
      card.classList.remove('flipping');
      card.classList.add('flipped');
      
      if (onComplete) onComplete(card);
    }, 250);
  },
  
  /**
   * 创建牌阵
   * @param {Element} container - 牌阵容器
   * @param {Array} reading - 读牌结果
   * @param {string} spreadType - 牌阵类型
   */
  createSpread(container, reading, spreadType) {
    container.innerHTML = '';
    
    // 根据牌阵类型设置布局类
    container.className = `spread-layout ${spreadType}`;
    
    reading.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('tarot-card');
      cardElement.dataset.position = index;
      
      // 卡牌背面
      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      cardElement.appendChild(cardBack);
      
      container.appendChild(cardElement);
      
      // 延迟翻牌
      setTimeout(() => {
        this.flipCard(cardElement, card, card.reversed, (flippedCard) => {
          // 添加位置标签
          const positionLabel = document.createElement('div');
          positionLabel.classList.add('position-label');
          positionLabel.textContent = card.position;
          flippedCard.appendChild(positionLabel);
        });
      }, 500 + index * 300);
    });
  },
  
  /**
   * 创建光亮效果
   * @param {Element} element - 目标元素
   * @param {string} color - 光亮颜色
   */
  createGlow(element, color = 'rgba(212, 175, 55, 0.6)') {
    element.style.boxShadow = `0 0 20px ${color}`;
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 2000);
  },
  
  /**
   * 元素激活动画
   * @param {Element} element - 目标元素
   */
  activateElement(element) {
    element.classList.add('activating');
    
    setTimeout(() => {
      element.classList.remove('activating');
      element.classList.add('active');
    }, 500);
  }
};

// 牌阵渲染器
export const spreadRenderer = {
  /**
   * 渲染三牌阵
   * @param {Element} container - 牌阵容器
   */
  threeCard(container) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.gap = '30px';
  },
  
  /**
   * 渲染凯尔特十字阵
   * @param {Element} container - 牌阵容器
   */
  celticCross(container) {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(4, 1fr)';
    container.style.gridTemplateRows = 'repeat(4, 1fr)';
    container.style.gap = '15px';
    
    // 设置每张卡的位置
    const cards = container.querySelectorAll('.tarot-card');
    
    // 中心卡片
    cards[0].style.gridColumn = '2';
    cards[0].style.gridRow = '2';
    
    // 横穿中心卡片
    cards[1].style.gridColumn = '2';
    cards[1].style.gridRow = '2';
    cards[1].style.transform = 'rotate(90deg)';
    
    // 底部卡片
    cards[2].style.gridColumn = '2';
    cards[2].style.gridRow = '3';
    
    // 左侧卡片
    cards[3].style.gridColumn = '1';
    cards[3].style.gridRow = '2';
    
    // 顶部卡片
    cards[4].style.gridColumn = '2';
    cards[4].style.gridRow = '1';
    
    // 右侧卡片
    cards[5].style.gridColumn = '3';
    cards[5].style.gridRow = '2';
    
    // 右侧列
    cards[6].style.gridColumn = '4';
    cards[6].style.gridRow = '1';
    cards[7].style.gridColumn = '4';
    cards[7].style.gridRow = '2';
    cards[8].style.gridColumn = '4';
    cards[8].style.gridRow = '3';
    cards[9].style.gridColumn = '4';
    cards[9].style.gridRow = '4';
  },
  
  /**
   * 渲染时间之轮
   * @param {Element} container - 牌阵容器
   */
  wheelOfYear(container) {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    container.style.gridTemplateRows = 'repeat(5, 1fr)';
    container.style.gap = '15px';
    
    const cards = container.querySelectorAll('.tarot-card');
    
    // 中心卡片
    cards[0].style.gridColumn = '3';
    cards[0].style.gridRow = '3';
    
    // 季节卡片
    cards[1].style.gridColumn = '3';
    cards[1].style.gridRow = '1'; // 冬季
    cards[2].style.gridColumn = '5';
    cards[2].style.gridRow = '3'; // 春季
    cards[3].style.gridColumn = '3';
    cards[3].style.gridRow = '5'; // 夏季
    cards[4].style.gridColumn = '1';
    cards[4].style.gridRow = '3'; // 秋季
    
    // 其他方面
    cards[5].style.gridColumn = '2';
    cards[5].style.gridRow = '2'; // 灵性
    cards[6].style.gridColumn = '4';
    cards[6].style.gridRow = '2'; // 情感
    cards[7].style.gridColumn = '4';
    cards[7].style.gridRow = '4'; // 物质
    cards[8].style.gridColumn = '2';
    cards[8].style.gridRow = '4'; // 思维
  }
}; 