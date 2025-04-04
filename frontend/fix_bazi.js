// 五行建议生成函数
function generateWuxingAdvice(wuxingData) {
    let advice = '';
    const { wood, fire, earth, metal, water } = wuxingData;
    
    // 计算五行总量
    const total = wood + fire + earth + metal + water;
    
    // 计算各五行占比
    const woodPercent = (wood / total * 100).toFixed(1);
    const firePercent = (fire / total * 100).toFixed(1);
    const earthPercent = (earth / total * 100).toFixed(1);
    const metalPercent = (metal / total * 100).toFixed(1);
    const waterPercent = (water / total * 100).toFixed(1);
    
    // 判断五行偏旺和偏弱
    const threshold = 25; // 设定偏旺/偏弱的阈值
    const strongElements = [];
    const weakElements = [];
    
    if (woodPercent > threshold) strongElements.push('木');
    if (firePercent > threshold) strongElements.push('火');
    if (earthPercent > threshold) strongElements.push('土');
    if (metalPercent > threshold) strongElements.push('金');
    if (waterPercent > threshold) strongElements.push('水');
    
    if (woodPercent < 15) weakElements.push('木');
    if (firePercent < 15) weakElements.push('火');
    if (earthPercent < 15) weakElements.push('土');
    if (metalPercent < 15) weakElements.push('金');
    if (waterPercent < 15) weakElements.push('水');
    
    // 生成建议
    if (strongElements.length > 0) {
        advice += `您的八字中${strongElements.join('、')}偏旺，`;
        if (weakElements.length > 0) {
            advice += `而${weakElements.join('、')}偏弱。\n`;
        } else {
            advice += '其他五行较为平衡。\n';
        }
    } else if (weakElements.length > 0) {
        advice += `您的八字中${weakElements.join('、')}偏弱，需要注意补充。\n`;
    } else {
        advice += '您的八字五行分布较为平衡。\n';
    }
    
    // 根据五行特点给出具体建议
    advice += '建议：\n';
    if (strongElements.includes('木')) {
        advice += '- 木旺者可从事教育、文化、出版、法律等行业\n';
    }
    if (strongElements.includes('火')) {
        advice += '- 火旺者适合从事餐饮、娱乐、科技、传媒等行业\n';
    }
    if (strongElements.includes('土')) {
        advice += '- 土旺者可从事房地产、建筑、农业、服务业等行业\n';
    }
    if (strongElements.includes('金')) {
        advice += '- 金旺者适合从事金融、珠宝、机械制造等行业\n';
    }
    if (strongElements.includes('水')) {
        advice += '- 水旺者可从事运输、贸易、物流、IT等行业\n';
    }
    
    return advice;
}

// 英文版职业建议生成函数
function generateCareerAdviceEn(wuxingData) {
    let advice = '';
    const { wood, fire, earth, metal, water } = wuxingData;
    
    // Calculate total and percentages
    const total = wood + fire + earth + metal + water;
    const woodPercent = (wood / total * 100).toFixed(1);
    const firePercent = (fire / total * 100).toFixed(1);
    const earthPercent = (earth / total * 100).toFixed(1);
    const metalPercent = (metal / total * 100).toFixed(1);
    const waterPercent = (water / total * 100).toFixed(1);
    
    // Determine strong and weak elements
    const threshold = 25;
    const strongElements = [];
    const weakElements = [];
    
    if (woodPercent > threshold) strongElements.push('Wood');
    if (firePercent > threshold) strongElements.push('Fire');
    if (earthPercent > threshold) strongElements.push('Earth');
    if (metalPercent > threshold) strongElements.push('Metal');
    if (waterPercent > threshold) strongElements.push('Water');
    
    if (woodPercent < 15) weakElements.push('Wood');
    if (firePercent < 15) weakElements.push('Fire');
    if (earthPercent < 15) weakElements.push('Earth');
    if (metalPercent < 15) weakElements.push('Metal');
    if (waterPercent < 15) weakElements.push('Water');
    
    // Generate advice
    if (strongElements.length > 0) {
        advice += `In your BaZi chart, ${strongElements.join(', ')} ${strongElements.length > 1 ? 'are' : 'is'} dominant, `;
        if (weakElements.length > 0) {
            advice += `while ${weakElements.join(', ')} ${weakElements.length > 1 ? 'are' : 'is'} weak.\n`;
        } else {
            advice += 'while other elements are relatively balanced.\n';
        }
    } else if (weakElements.length > 0) {
        advice += `In your BaZi chart, ${weakElements.join(', ')} ${weakElements.length > 1 ? 'are' : 'is'} weak and need attention.\n`;
    } else {
        advice += 'Your BaZi chart shows a balanced distribution of the Five Elements.\n';
    }
    
    // Career recommendations based on strong elements
    advice += '\nCareer Recommendations:\n';
    if (strongElements.includes('Wood')) {
        advice += '- Wood: Education, Culture, Publishing, Law\n';
    }
    if (strongElements.includes('Fire')) {
        advice += '- Fire: Food & Beverage, Entertainment, Technology, Media\n';
    }
    if (strongElements.includes('Earth')) {
        advice += '- Earth: Real Estate, Construction, Agriculture, Service Industry\n';
    }
    if (strongElements.includes('Metal')) {
        advice += '- Metal: Finance, Jewelry, Manufacturing\n';
    }
    if (strongElements.includes('Water')) {
        advice += '- Water: Transportation, Trade, Logistics, IT\n';
    }
    
    return advice;
}