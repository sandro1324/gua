/**
 * 八字分析系统前端脚本
 */

// 全局变量和配置
const CONFIG = {
    storage: {
        userData: 'bazi_user_data',
        analysisResult: 'bazi_analysis_result',
        cacheExpiry: 24 * 60 * 60 * 1000, // 24小时
        version: '1.0' // 缓存版本号，用于处理数据结构变更
    },
    api: {
        baseUrl: 'http://localhost:8000',
        timeout: 5000,
        retryCount: 3,
        retryDelay: 1000,
        endpoints: {
            analyze: '/api/analyze',
            status: '/'
        }
    },
    debug: {
        enabled: true,
        level: 'info' // 'debug' | 'info' | 'warn' | 'error'
    }
};

// 性能监控
const Performance = {
    metrics: {},
    history: [],
    maxHistoryLength: 100,
    start(key) {
        this.metrics[key] = performance.now();
    },
    end(key) {
        if (this.metrics[key]) {
            const duration = performance.now() - this.metrics[key];
            const metric = {
                key,
                duration: duration.toFixed(2),
                timestamp: new Date().toISOString()
            };
            this.history.push(metric);
            if (this.history.length > this.maxHistoryLength) {
                this.history.shift();
            }
            if (CONFIG.debug.enabled) {
                console.log(`Performance [${key}]: ${duration.toFixed(2)}ms`);
            }
            delete this.metrics[key];
            return duration;
        }
    },
    getHistory() {
        return this.history;
    },
    clear() {
        this.metrics = {};
        this.history = [];
    }
};

// 缓存管理
const Cache = {
    set(key, value, expiry = CONFIG.storage.cacheExpiry) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
                expiry,
                version: CONFIG.storage.version
            };
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('缓存写入失败:', error);
            return false;
        }
    },
    get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const { value, timestamp, expiry, version } = JSON.parse(item);
            
            // 检查缓存版本
            if (version !== CONFIG.storage.version) {
                this.clear(key);
                return null;
            }
            
            // 检查是否过期
            if (Date.now() - timestamp > expiry) {
                this.clear(key);
                return null;
            }
            return value;
        } catch (error) {
            console.error('缓存读取失败:', error);
            return null;
        }
    },
    clear(key) {
        try {
            if (key) {
                localStorage.removeItem(key);
            } else {
                // 清除所有相关缓存
                Object.values(CONFIG.storage)
                    .filter(value => typeof value === 'string')
                    .forEach(key => localStorage.removeItem(key));
            }
            return true;
        } catch (error) {
            console.error('缓存清理失败:', error);
            return false;
        }
    },
    clearExpired() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item && item.timestamp && Date.now() - item.timestamp > item.expiry) {
                        localStorage.removeItem(key);
                    }
                } catch {}
            });
            return true;
        } catch (error) {
            console.error('过期缓存清理失败:', error);
            return false;
        }
    }
};

// 事件管理
const EventManager = {
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },
    
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                Logger.error(`事件处理错误 [${event}]:`, error);
            }
        });
    }
};

// 状态管理
const StateManager = {
    state: {
        lunarLibraryLoaded: false,
        backendAvailable: false,
        currentPage: null,
        userDataLoaded: false,
        analysisInProgress: false
    },
    
    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        if (oldValue !== value) {
            EventManager.emit('stateChange', {
                key,
                oldValue,
                newValue: value
            });
        }
    },
    
    getState(key) {
        return this.state[key];
    },
    
    resetState() {
        Object.keys(this.state).forEach(key => {
            this.state[key] = false;
        });
        EventManager.emit('stateReset');
    }
};

// 日志记录
const Logger = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    },
    log(level, message, ...args) {
        if (this.levels[level] >= this.levels[CONFIG.debug.level]) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            if (level === 'error') {
                console.error(prefix, message, ...args);
            } else if (level === 'warn') {
                console.warn(prefix, message, ...args);
            } else {
                console.log(prefix, message, ...args);
            }
        }
    },
    debug(message, ...args) { this.log('debug', message, ...args); },
    info(message, ...args) { this.log('info', message, ...args); },
    warn(message, ...args) { this.log('warn', message, ...args); },
    error(message, ...args) { this.log('error', message, ...args); }
};

// 错误处理
const ErrorHandler = {
    handleError(error, context = '') {
        Logger.error(`${context}:`, error);
        if (error instanceof TypeError) {
            return '操作类型错误，请检查输入数据';
        } else if (error instanceof ReferenceError) {
            return '程序引用错误，请刷新页面重试';
        } else if (error instanceof NetworkError || error.name === 'NetworkError') {
            return '网络连接错误，请检查网络连接';
        } else {
            return '发生未知错误，请刷新页面重试';
        }
    },
    showError(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    Logger.info('页面加载完成，初始化应用...');
    
    // 检查是否在分析页面
    const isAnalysisPage = document.querySelector('.analysis-container');
    
    if (isAnalysisPage) {
        // 显示加载动画
        showLoading(true);
        
        // 修复可能的数据问题
        const fixed = fixDataIssues();
        
        // 使用try-catch包装初始化过程，防止整个页面崩溃
        try {
            // 初始化分析页面
            setTimeout(initAnalysisPage, 500);
            
            // 初始化十神关系图谱
            setTimeout(renderShishenDiagram, 1000);
            
            // 添加全局错误处理
            window.onerror = function(message, source, lineno, colno, error) {
                console.error('页面发生错误:', message, source, lineno, colno, error);
                // 如果加载过程中出错，显示友好的错误信息
                if (document.querySelector('.loading-overlay').style.display !== 'none') {
                    showError('加载分析数据时出错，请尝试刷新页面或返回重新生成分析');
                }
                return true; // 防止默认错误处理
            };
        } catch (error) {
            console.error('初始化页面时出错:', error);
            showError('初始化页面时出错: ' + error.message);
        }
    } else {
        // 检查是否在表单页面
        const isFormPage = document.querySelector('.form-container');
        
        if (isFormPage) {
            try {
                // 初始化用户表单
                initUserForm();
                
                // 检查后端状态
                checkBackendStatus();
                
                // 检查农历库
                checkLunarLibrary();
                
                // 恢复用户数据
                restoreUserDataFromStorage();
            } catch (error) {
                console.error('初始化表单页面时出错:', error);
                showError('初始化表单时出错: ' + error.message);
            }
        }
    }
});

/**
 * 检查lunar库是否加载
 */
async function checkLunarLibrary() {
    Performance.start('loadLunarLibrary');
    
    if (typeof Lunar !== 'undefined' && typeof Solar !== 'undefined') {
        console.log('检测到lunar-javascript库已加载');
        lunarLibraryLoaded = true;
        Performance.end('loadLunarLibrary');
        return true;
    }
    
    console.warn('lunar-javascript库未加载，尝试动态加载...');
    
    try {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = './lunar-javascript/lunar.js';
            
            script.onload = () => {
                if (typeof Lunar !== 'undefined' && typeof Solar !== 'undefined') {
                    console.log('lunar-javascript库动态加载成功');
                    lunarLibraryLoaded = true;
                    Performance.end('loadLunarLibrary');
                    resolve();
                } else {
                    reject(new Error('lunar-javascript库加载失败 - 库对象未定义'));
                }
            };
            
            script.onerror = () => reject(new Error('lunar-javascript库加载失败 - 脚本加载错误'));
            document.head.appendChild(script);
        });
        
        return true;
    } catch (error) {
        console.error('加载lunar-javascript库时出错:', error);
        showError('加载必要组件失败，请刷新页面重试');
        Performance.end('loadLunarLibrary');
        return false;
    }
}

/**
 * 初始化用户表单页
 */
function initUserForm() {
    console.log('初始化用户表单页...');
    
    // 检查后端服务状态
    checkBackendStatus();
    
    // 绑定表单提交事件
    const form = document.getElementById('user-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            submitUserForm();
        });
    }
    
    // 从本地存储恢复数据
    restoreUserDataFromStorage();
}

/**
 * 检查后端服务状态
 */
function checkBackendStatus() {
    console.log('正在检查后端服务状态...');
    
    fetch(`${CONFIG.api.baseUrl}${CONFIG.api.endpoints.status}`, { 
        method: 'GET',
        signal: AbortSignal.timeout(CONFIG.api.timeout)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`后端服务返回错误状态: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('后端服务状态:', data);
        // 如果状态不是运行中或lunar库不可用，显示警告
        if (!data.status || data.status !== 'running' || !data.lunar_available) {
            showBackendWarning(!data.lunar_available);
        }
    })
    .catch(error => {
        console.warn('无法连接到后端服务:', error);
        showBackendWarning(true);
    });
}

// 用户界面管理
const UIManager = {
    elements: {
        warningContainer: 'backend-warning',
        errorContainer: 'error-message',
        loadingContainer: 'loading-overlay'
    },
    
    showWarning(message, duration = 5000) {
        const element = document.getElementById(this.elements.warningContainer);
        if (element) {
            element.innerHTML = `⚠️ 警告: ${message}`;
            element.style.display = 'block';
            if (duration > 0) {
                setTimeout(() => this.hideWarning(), duration);
            }
        }
    },
    
    hideWarning() {
        const element = document.getElementById(this.elements.warningContainer);
        if (element) {
            element.style.display = 'none';
        }
    },
    
    showError(message, duration = 5000) {
        const element = document.getElementById(this.elements.errorContainer);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            if (duration > 0) {
                setTimeout(() => this.hideError(), duration);
            }
        } else {
            alert(message);
        }
    },
    
    hideError() {
        const element = document.getElementById(this.elements.errorContainer);
        if (element) {
            element.style.display = 'none';
        }
    },
    
    showLoading() {
        const element = document.getElementById(this.elements.loadingContainer);
        if (element) {
            element.style.display = 'flex';
        }
    },
    
    hideLoading() {
        const element = document.getElementById(this.elements.loadingContainer);
        if (element) {
            element.style.display = 'none';
        }
    },
    
    showBackendWarning(lunarUnavailable) {
        const message = lunarUnavailable
            ? '后端服务存在问题，lunar-python库不可用。系统将使用简化算法，精度可能降低。'
            : '后端服务不可用，系统将使用前端计算，部分高级功能可能不可用。';
        this.showWarning(message, 0);
    }
};

/**
 * 显示后端服务警告消息
 */
function showBackendWarning(lunarUnavailable) {
    UIManager.showBackendWarning(lunarUnavailable);
}

/**
 * 从本地存储恢复用户数据
 */
function restoreUserDataFromStorage() {
    const savedData = localStorage.getItem(CONFIG.storage.userData);
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            document.getElementById('name').value = userData.name || '';
            document.getElementById('gender').value = userData.gender || '男';
            
            if (userData.birthDate) {
                document.getElementById('birth-date').value = userData.birthDate;
            }
            
            if (userData.birthTime) {
                document.getElementById('birth-time').value = userData.birthTime;
            }
            
            console.log('已从本地存储恢复用户数据');
        } catch (error) {
            console.error('从本地存储恢复用户数据时出错:', error);
        }
    }
}

/**
 * 提交用户表单
 */
async function submitUserForm() {
    Performance.start('formSubmission');
    
    try {
    console.log('提交用户表单...');
    
    // 显示加载状态
    showLoading(true);
    
    // 获取表单数据
    const userData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        birthDate: document.getElementById('birth-date').value,
        birthTime: document.getElementById('birth-time').value
    };
    
    // 验证表单数据
    if (!validateUserData(userData)) {
        showLoading(false);
        return;
    }
    
    // 保存到本地存储
    Cache.set(CONFIG.storage.userData, userData);
    
    // 准备API调用数据
    const birthDateTime = `${userData.birthDate} ${userData.birthTime}`;
    const apiData = {
        name: userData.name,
        gender: userData.gender,
        birth_datetime: birthDateTime
    };
    
    // 调用后端API或使用前端计算
    callAnalysisAPI(apiData)
        .then(result => {
            // 保存分析结果到本地存储
            Cache.set(CONFIG.storage.analysisResult, result);
            
            // 隐藏加载状态
            showLoading(false);
            
            // 跳转到分析页面
            window.location.href = 'bazi详细分析.html';
        })
        .catch(error => {
            console.error('分析过程出错:', error);
            
            // 如果后端API调用失败，尝试使用前端计算
            if (lunarLibraryLoaded) {
                console.log('尝试使用前端lunar-javascript库进行计算...');
                try {
                    const frontendResult = calculateWithFrontend(userData);
                    localStorage.setItem(STORAGE_KEY_ANALYSIS_RESULT, JSON.stringify(frontendResult));
                    showLoading(false);
                    window.location.href = 'bazi详细分析.html';
                } catch (frontendError) {
                    console.error('前端计算也失败:', frontendError);
                    showError('无法计算八字，请稍后再试。详细错误: ' + String(frontendError));
                    showLoading(false);
                }
            } else {
                showError('后端服务不可用，前端lunar库也未加载，无法进行计算。');
                showLoading(false);
            }
        });
}

/**
 * 验证用户数据
 */
function validateUserData(userData) {
    if (!userData.name || userData.name.trim() === '') {
        showError('请输入姓名');
        return false;
    }
    
    if (!userData.birthDate) {
        showError('请选择出生日期');
        return false;
    }
    
    if (!userData.birthTime) {
        showError('请选择出生时间');
        return false;
    }
    
    return true; // 所有验证通过
}

// API请求管理
const APIManager = {
    retryDelay: CONFIG.api.retryDelay,
    maxRetries: CONFIG.api.retryCount,
    
    async request(endpoint, options = {}) {
        let retries = 0;
        
        while (retries <= this.maxRetries) {
            try {
                Performance.start(`api_${endpoint}`);
                
                const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    signal: AbortSignal.timeout(CONFIG.api.timeout)
                });
                
                const data = await response.json();
                Performance.end(`api_${endpoint}`);
                
                if (!response.ok) {
                    throw new Error(data.detail || `API返回错误状态: ${response.status}`);
                }
                
                return data;
            } catch (error) {
                retries++;
                Logger.warn(`API请求失败 (${retries}/${this.maxRetries}):`, error);
                
                if (retries <= this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
                } else {
                    throw error;
                }
            }
        }
    },
    
    async analyze(data) {
        try {
            Logger.info('开始调用分析API...');
            return await this.request(CONFIG.api.endpoints.analyze, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (error) {
            Logger.error('分析API调用失败:', error);
            throw error;
        }
    },
    
    async checkStatus() {
        try {
            Logger.info('检查后端服务状态...');
            return await this.request(CONFIG.api.endpoints.status);
        } catch (error) {
            Logger.error('状态检查失败:', error);
            throw error;
        }
    }
};

/**
 * 调用分析API
 */
function callAnalysisAPI(apiData) {
    return APIManager.analyze(apiData);
}
}

/**
 * 使用前端lunar-javascript库计算
 */
function calculateWithFrontend(userData) {
    console.log('开始使用前端lunar-javascript库计算...');
    
    // 解析出生日期和时间
    const [year, month, day] = userData.birthDate.split('-').map(Number);
    const [hour, minute] = userData.birthTime.split(':').map(Number);
    
    // 使用lunar-javascript库计算
    try {
        // 创建阳历对象
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        
        // 转换为阴历
        const lunar = solar.getLunar();
        
        // 构建结果对象
        const result = {
            user: {
                name: userData.name,
                gender: userData.gender,
                birth_datetime: `${userData.birthDate} ${userData.birthTime}`
            },
            solar: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${solar.getHour()}:${solar.getMinute()}`,
            lunar: `${lunar.getYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
            bazi: {
                year: `${lunar.getYearGan()}${lunar.getYearZhi()}`,
                month: `${lunar.getMonthGan()}${lunar.getMonthZhi()}`,
                day: `${lunar.getDayGan()}${lunar.getDayZhi()}`,
                hour: `${lunar.getTimeGan()}${lunar.getTimeZhi()}`
            },
            shengxiao: lunar.getYearShengXiao(),
            analysis: calculateAnalysis(lunar),
            method: "frontend",
            note: "此结果由前端计算生成，未使用后端服务"
        };
        
        console.log('前端计算完成:', result);
        return result;
    } catch (error) {
        console.error('前端计算出错:', error);
        throw error;
    }
}

/**
 * 计算简单的五行分析
 */
function calculateAnalysis(lunar) {
    // 天干五行
    const ganWuxing = {
        "甲": "木", "乙": "木",
        "丙": "火", "丁": "火",
        "戊": "土", "己": "土",
        "庚": "金", "辛": "金",
        "壬": "水", "癸": "水"
    };
    
    // 地支五行
    const zhiWuxing = {
        "子": "水", "丑": "土", 
        "寅": "木", "卯": "木",
        "辰": "土", "巳": "火",
        "午": "火", "未": "土",
        "申": "金", "酉": "金",
        "戌": "土", "亥": "水"
    };
    
    // 计算五行得分
    const scores = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0};
    
    // 年柱
    const yearGan = lunar.getYearGan();
    const yearZhi = lunar.getYearZhi();
    scores[ganWuxing[yearGan]] += 1;
    scores[zhiWuxing[yearZhi]] += 1;
    
    // 月柱
    const monthGan = lunar.getMonthGan();
    const monthZhi = lunar.getMonthZhi();
    scores[ganWuxing[monthGan]] += 1;
    scores[zhiWuxing[monthZhi]] += 1;
    
    // 日柱
    const dayGan = lunar.getDayGan();
    const dayZhi = lunar.getDayZhi();
    scores[ganWuxing[dayGan]] += 1;
    scores[zhiWuxing[dayZhi]] += 1;
    
    // 时柱
    const timeGan = lunar.getTimeGan();
    const timeZhi = lunar.getTimeZhi();
    scores[ganWuxing[timeGan]] += 1;
    scores[zhiWuxing[timeZhi]] += 1;
    
    // 计算百分比
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const percentage = {};
    for (const [key, value] of Object.entries(scores)) {
        percentage[key] = Math.round((value / total) * 100 * 10) / 10;
    }
    
    // 计算日主五行
    const dayWuxing = ganWuxing[dayGan];
    
    // 返回分析结果
    return {
        wuxing: percentage,
        dayMaster: {
            gan: dayGan,
            wuxing: dayWuxing,
            strength: calculateDayMasterStrength(dayWuxing, percentage)
        }
    };
}

/**
 * 计算日主强弱
 */
function calculateDayMasterStrength(dayWuxing, wuxingScores) {
    const score = wuxingScores[dayWuxing];
    
    if (score >= 30) {
        return "过强";
    } else if (score >= 25) {
        return "偏强";
    } else if (score >= 20) {
        return "中和偏强";
    } else if (score >= 15) {
        return "中和";
    } else if (score >= 10) {
        return "中和偏弱";
    } else if (score >= 5) {
        return "偏弱";
    } else {
        return "过弱";
    }
}

/**
 * 初始化分析页面
 */
function initAnalysisPage() {
    // 获取八字数据
    const baziData = JSON.parse(localStorage.getItem('baziAnalysisData') || '{}');
    
    // 检查八字数据是否存在
    if (!baziData.name) {
        // 如果没有数据，显示错误消息
        showError('数据加载失败，请返回输入页面重新生成分析');
        return;
    }
    
    // 渲染用户基本信息
    document.getElementById('analysis-name').textContent = baziData.name || '未知';
    document.getElementById('analysis-gender').textContent = baziData.gender || '未知';
    document.getElementById('analysis-birthdate').textContent = baziData.birthDate || '未知';
    
    // 渲染八字信息
    if (baziData.bazi) {
        document.getElementById('year-gan').textContent = baziData.bazi.yearGan || '未知';
        document.getElementById('year-zhi').textContent = baziData.bazi.yearZhi || '未知';
        document.getElementById('month-gan').textContent = baziData.bazi.monthGan || '未知';
        document.getElementById('month-zhi').textContent = baziData.bazi.monthZhi || '未知';
        document.getElementById('day-gan').textContent = baziData.bazi.dayGan || '未知';
        document.getElementById('day-zhi').textContent = baziData.bazi.dayZhi || '未知';
        document.getElementById('hour-gan').textContent = baziData.bazi.hourGan || '未知';
        document.getElementById('hour-zhi').textContent = baziData.bazi.hourZhi || '未知';
    }
    
    // 渲染五行分析
    if (baziData.wuxing) {
        renderWuxingAnalysis(baziData.wuxing);
    }
    
    // 渲染日主分析
    if (baziData.dayMaster) {
        document.getElementById('day-master-gan').textContent = baziData.dayMaster.gan || '未知';
        document.getElementById('day-master-wuxing').textContent = baziData.dayMaster.wuxing || '未知';
        
        // 计算日主强弱
        if (baziData.wuxing) {
            const strength = calculateDayMasterStrength(baziData.dayMaster.wuxing, baziData.wuxing);
            document.getElementById('day-master-strength').textContent = strength.description;
            
            // 获取日主建议
            const advice = getDayMasterAdvice(strength, baziData.dayMaster.wuxing);
            document.getElementById('day-master-advice').textContent = advice;
        }
    }
    
    // 初始化高级分析
    initAdvancedAnalysis();
    
    // 初始化大运流年分析
    initDayunAnalysis();
    
    // 渲染十神关系图谱
    renderShishenDiagram();
    
    // 链接大运和十神
    setTimeout(linkDayunAndShishen, 1000);
    
    // 初始化神煞分析
    initShenshaAnalysis();
    
    // 初始化用神建议
    initYongshenAdvice();
    
    // 隐藏加载动画
    showLoading(false);
}

/**
 * 渲染分析结果
 */
function renderAnalysisResult(result) {
    // 更新计算方法信息
    if (document.getElementById('calculation-method')) {
        document.getElementById('calculation-method').textContent = result.calculation_method || '标准八字法';
    }
    
    // 大运与十神联动
    linkDayunAndShishen();
}

/**
 * 初始化流年分析
 */
function initLiunianAnalysis() {
    try {
        // 获取当前年份
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = currentYear.toString();
        }
        
        // 设置年份导航按钮事件
        const prevYearBtn = document.getElementById('prev-year-btn');
        const nextYearBtn = document.getElementById('next-year-btn');
        
        if (prevYearBtn) {
            prevYearBtn.addEventListener('click', function() {
                const currentYearElem = document.getElementById('current-year');
                const year = parseInt(currentYearElem.textContent) - 1;
                currentYearElem.textContent = year.toString();
                renderLiunianCalendar(year);
            });
        }
        
        if (nextYearBtn) {
            nextYearBtn.addEventListener('click', function() {
                const currentYearElem = document.getElementById('current-year');
                const year = parseInt(currentYearElem.textContent) + 1;
                currentYearElem.textContent = year.toString();
                renderLiunianCalendar(year);
            });
        }
        
        // 渲染当前年份的流年日历
        renderLiunianCalendar(currentYear);
        
    } catch (error) {
        console.error('初始化流年分析失败:', error);
    }
}

/**
 * 渲染流年日历
 * @param {number} year - 年份
 */
function renderLiunianCalendar(year) {
    const calendarContainer = document.getElementById('liunian-calendar');
    if (!calendarContainer) {
        console.error('未找到流年日历容器');
        return;
    }
    
    // 清空日历容器
    calendarContainer.innerHTML = '';
    
    // 检查lunar库是否可用
    if (!lunarLibraryLoaded || typeof Solar === 'undefined' || typeof Lunar === 'undefined') {
        calendarContainer.innerHTML = '<div class="calendar-error">无法加载农历库，流年分析不可用</div>';
        console.warn('农历库不可用，无法进行流年分析');
        return;
    }
    
    try {
        // 创建公历年对象
        const solar = Solar.fromYmd(year, 1, 1);
        // 获取对应的农历年
        const lunar = solar.getLunar();
        // 获取年的干支
        const yearGanZhi = lunar.getYearInGanZhi();
        
        // 更新年干支和纳音显示
        document.getElementById('liunian-ganzhi').textContent = yearGanZhi;
        
        // 获取用户数据以计算年龄
        const userData = JSON.parse(localStorage.getItem('baziAnalysisData'));
        if (userData && userData.birthDate) {
            const birthYear = new Date(userData.birthDate).getFullYear();
            const age = year - birthYear;
            document.getElementById('liunian-age').textContent = age;
        }
        
        // 获取纳音五行
        // 这里需要有纳音五行的对照表，简化处理
        const nayin = getNayin(yearGanZhi);
        document.getElementById('liunian-nayin').textContent = nayin || '未知';
        
        // 计算月份数据
        const months = [];
        for (let i = 1; i <= 12; i++) {
            const monthSolar = Solar.fromYmd(year, i, 1);
            const monthLunar = monthSolar.getLunar();
            const monthGanZhi = monthLunar.getMonthInGanZhi();
            
            // 简单判断吉凶 (实际应结合用户八字进行复杂计算)
            const monthType = getMonthType(monthGanZhi, yearGanZhi);
            
            months.push({
                solarMonth: i,
                lunarMonth: monthLunar.getMonthInChinese(),
                ganZhi: monthGanZhi,
                type: monthType,
                keywords: generateMonthKeywords(monthGanZhi, monthType)
            });
        }
        
        // 渲染月份
        months.forEach(month => {
            const monthElement = document.createElement('div');
            monthElement.className = `month-item ${month.type === '吉' ? 'month-auspicious' : month.type === '凶' ? 'month-inauspicious' : 'month-neutral'}`;
            monthElement.innerHTML = `
                <div class="month-number">${month.solarMonth}月</div>
                <div class="month-ganzhi">${month.ganZhi}</div>
                <div class="month-type">${month.type}</div>
            `;
            
            // 添加点击事件
            monthElement.addEventListener('click', () => {
                // 移除其他月份的选中状态
                document.querySelectorAll('.month-item').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // 添加选中状态
                monthElement.classList.add('selected');
                
                // 更新月份详情
                updateMonthDetails(month);
            });
            
            calendarContainer.appendChild(monthElement);
        });
        
        // 默认选中当前月份
        const currentMonth = new Date().getMonth() + 1;
        if (year === new Date().getFullYear()) {
            const currentMonthElement = calendarContainer.children[currentMonth - 1];
            if (currentMonthElement) {
                currentMonthElement.click();
            }
        } else {
            // 如果不是当前年份，默认选中第一个月
            if (calendarContainer.children[0]) {
                calendarContainer.children[0].click();
            }
        }
        
    } catch (error) {
        console.error('渲染流年日历失败:', error);
        calendarContainer.innerHTML = '<div class="calendar-error">生成流年日历时出错</div>';
    }
}

/**
 * 根据月干支和年干支简单判断吉凶
 * @param {string} monthGanZhi - 月干支
 * @param {string} yearGanZhi - 年干支
 * @returns {string} - 吉/凶/平
 */
function getMonthType(monthGanZhi, yearGanZhi) {
    // 简化计算，仅作示例
    // 实际应根据用户八字与流年干支组合进行详细判断
    const monthGan = monthGanZhi.charAt(0);
    const monthZhi = monthGanZhi.charAt(1);
    const yearGan = yearGanZhi.charAt(0);
    const yearZhi = yearGanZhi.charAt(1);
    
    // 简单规则：生助关系为吉，克制关系为凶，其他为平
    const ganRelation = getElementRelation(getElementByGan(monthGan), getElementByGan(yearGan));
    
    if (ganRelation === '生' || ganRelation === '助') {
        return '吉';
    } else if (ganRelation === '克' || ganRelation === '泄') {
        return '凶';
    } else {
        return '平';
    }
}

/**
 * 更新月份详情显示
 * @param {Object} month - 月份数据
 */
function updateMonthDetails(month) {
    const selectedMonthName = document.getElementById('selected-month-name');
    const selectedMonthGanZhi = document.getElementById('selected-month-ganzhi');
    const careerElement = document.getElementById('month-career');
    const wealthElement = document.getElementById('month-wealth');
    const healthElement = document.getElementById('month-health');
    
    if (selectedMonthName) selectedMonthName.textContent = month.solarMonth;
    if (selectedMonthGanZhi) selectedMonthGanZhi.textContent = month.ganZhi;
    
    // 生成相关分析文字
    const careerText = generateMonthCareerText(month);
    const wealthText = generateMonthWealthText(month);
    const healthText = generateMonthHealthText(month);
    
    if (careerElement) careerElement.textContent = careerText;
    if (wealthElement) wealthElement.textContent = wealthText;
    if (healthElement) healthElement.textContent = healthText;
}

/**
 * 生成月份关键词
 */
function generateMonthKeywords(monthGanZhi, type) {
    // 简化处理，实际应结合八字分析系统生成更精准的关键词
    const gan = monthGanZhi.charAt(0);
    const zhi = monthGanZhi.charAt(1);
    const element = getElementByGan(gan);
    
    let keywords = [];
    
    // 根据五行属性添加关键词
    switch(element) {
        case '木':
            keywords = ['成长', '突破', '创新', '进取'];
            break;
        case '火':
            keywords = ['热情', '表现', '社交', '扩张'];
            break;
        case '土':
            keywords = ['稳定', '务实', '规划', '收获'];
            break;
        case '金':
            keywords = ['收敛', '聚财', '准确', '精致'];
            break;
        case '水':
            keywords = ['智慧', '交流', '流动', '变化'];
            break;
    }
    
    // 根据吉凶添加相应词汇
    if (type === '吉') {
        keywords.push('顺利', '有利', '机遇');
    } else if (type === '凶') {
        keywords.push('阻碍', '压力', '谨慎');
    } else {
        keywords.push('平稳', '中和', '调整');
    }
    
    return keywords;
}

/**
 * 生成月份事业分析文字
 */
function generateMonthCareerText(month) {
    const monthGan = month.ganZhi.charAt(0);
    const element = getElementByGan(monthGan);
    
    if (month.type === '吉') {
        switch(element) {
            case '木': return '事业上有向上发展的势头，适合主动规划新项目或争取升职机会。';
            case '火': return '事业上容易得到展示才能的机会，领导力提升，利于表达和沟通。';
            case '土': return '事业稳步上升，适合巩固现有成果，踏实耕耘定能获得回报。';
            case '金': return '工作效率高，精益求精，容易获得领导赏识，适合整理和总结。';
            case '水': return '思维活跃，创意丰富，适合头脑风暴和策划工作，人际关系有利。';
            default: return '整体事业运势良好，可把握机会主动出击。';
        }
    } else if (month.type === '凶') {
        switch(element) {
            case '木': return '事业上可能遇到阻碍，不宜贸然行动，应稳固现有地位，避免冲突。';
            case '火': return '事业压力较大，需控制情绪避免冲动，谨言慎行为宜。';
            case '土': return '工作效率可能下降，容易出现拖延，需强化自律，按计划行事。';
            case '金': return '可能遇到竞争或挑战，需保持冷静判断，切勿与人争执。';
            case '水': return '思维混乱，决策易出错，重要决定需反复斟酌，避免轻信。';
            default: return '事业运势受阻，应保持低调，避免冒险，静待时机。';
        }
    } else {
        return '事业发展平稳，适合稳扎稳打，保持现状并做好规划。';
    }
}

/**
 * 生成月份财富分析文字
 */
function generateMonthWealthText(month) {
    const monthZhi = month.ganZhi.charAt(1);
    
    if (month.type === '吉') {
        return '财运较好，正财和偏财都有机会，可适当把握投资机会，但仍需量力而行。';
    } else if (month.type === '凶') {
        return '财运起伏不定，应谨慎理财，避免大额投资和冒险行为，守成为主。';
    } else {
        return '财务状况平稳，收支平衡，适合财务规划和长期投资布局。';
    }
}

/**
 * 生成月份健康分析文字
 */
function generateMonthHealthText(month) {
    const monthGan = month.ganZhi.charAt(0);
    const element = getElementByGan(monthGan);
    
    // 根据五行对应不同的健康建议
    switch(element) {
        case '木':
            return '注意肝胆健康，避免情绪激动，适当运动和舒缓压力，保持充足睡眠。';
        case '火':
            return '注意心脏和血液循环，避免过度兴奋和劳累，保持情绪平和，注意饮食健康。';
        case '土':
            return '注意消化系统，保持饮食规律，避免过度思虑忧愁，适量运动增强脾胃功能。';
        case '金':
            return '注意呼吸系统和肺部健康，保持居所通风，避免接触过敏原，增强肺部功能。';
        case '水':
            return '注意肾脏和泌尿系统，避免过度劳累，保持温暖，适当补充水分但避免过饮。';
        default:
            return '保持作息规律，均衡饮食，适量运动，定期体检。';
    }
}

/**
 * 获取纳音五行
 * @param {string} ganZhi 干支组合
 * @returns {string} 纳音五行
 */
function getNayin(ganZhi) {
    // 纳音对照表
    const nayinMap = {
        '甲子': '海中金', '乙丑': '海中金',
        '丙寅': '炉中火', '丁卯': '炉中火',
        '戊辰': '大林木', '己巳': '大林木',
        '庚午': '路旁土', '辛未': '路旁土',
        '壬申': '剑锋金', '癸酉': '剑锋金',
        '甲戌': '山头火', '乙亥': '山头火',
        '丙子': '涧下水', '丁丑': '涧下水',
        '戊寅': '城头土', '己卯': '城头土',
        '庚辰': '白蜡金', '辛巳': '白蜡金',
        '壬午': '杨柳木', '癸未': '杨柳木',
        '甲申': '泉中水', '乙酉': '泉中水',
        '丙戌': '屋上土', '丁亥': '屋上土',
        '戊子': '霹雳火', '己丑': '霹雳火',
        '庚寅': '松柏木', '辛卯': '松柏木',
        '壬辰': '长流水', '癸巳': '长流水',
        '甲午': '砂中金', '乙未': '砂中金',
        '丙申': '山下火', '丁酉': '山下火',
        '戊戌': '平地木', '己亥': '平地木',
        '庚子': '壁上土', '辛丑': '壁上土',
        '壬寅': '金箔金', '癸卯': '金箔金',
        '甲辰': '覆灯火', '乙巳': '覆灯火',
        '丙午': '天河水', '丁未': '天河水',
        '戊申': '大驿土', '己酉': '大驿土',
        '庚戌': '钗钏金', '辛亥': '钗钏金',
        '壬子': '桑柘木', '癸丑': '桑柘木',
        '甲寅': '大溪水', '乙卯': '大溪水',
        '丙辰': '沙中土', '丁巳': '沙中土',
        '戊午': '天上火', '己未': '天上火',
        '庚申': '石榴木', '辛酉': '石榴木',
        '壬戌': '大海水', '癸亥': '大海水'
    };
    
    return nayinMap[ganZhi] || '未知';
}

/**
 * 获取天干对应的五行
 * @param {string} gan 天干
 * @returns {string} 五行属性
 */
function getElementByGan(gan) {
    const ganElement = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    return ganElement[gan] || '';
}

/**
 * 获取地支对应的五行
 * @param {string} zhi 地支
 * @returns {string} 五行属性
 */
function getElementByZhi(zhi) {
    const zhiElement = {
        '子': '水', '丑': '土',
        '寅': '木', '卯': '木',
        '辰': '土', '巳': '火',
        '午': '火', '未': '土',
        '申': '金', '酉': '金',
        '戌': '土', '亥': '水'
    };
    return zhiElement[zhi] || '';
}

/**
 * 获取两个五行之间的关系
 * @param {string} element1 第一个五行
 * @param {string} element2 第二个五行
 * @returns {string} 五行关系：生、克、被生、被克、同类
 */
function getElementRelation(element1, element2) {
    if (element1 === element2) {
        return '比';  // 同类
    }
    
    // 五行相生关系：木生火，火生土，土生金，金生水，水生木
    if ((element1 === '木' && element2 === '火') ||
        (element1 === '火' && element2 === '土') ||
        (element1 === '土' && element2 === '金') ||
        (element1 === '金' && element2 === '水') ||
        (element1 === '水' && element2 === '木')) {
        return '生';  // 生
    }
    
    // 五行相克关系：木克土，土克水，水克火，火克金，金克木
    if ((element1 === '木' && element2 === '土') ||
        (element1 === '土' && element2 === '水') ||
        (element1 === '水' && element2 === '火') ||
        (element1 === '火' && element2 === '金') ||
        (element1 === '金' && element2 === '木')) {
        return '克';  // 克
    }
    
    // 被生关系：与生相反
    if ((element2 === '木' && element1 === '火') ||
        (element2 === '火' && element1 === '土') ||
        (element2 === '土' && element1 === '金') ||
        (element2 === '金' && element1 === '水') ||
        (element2 === '水' && element1 === '木')) {
        return '泄';  // 被生
    }
    
    // 被克关系：与克相反
    if ((element2 === '木' && element1 === '土') ||
        (element2 === '土' && element1 === '水') ||
        (element2 === '水' && element1 === '火') ||
        (element2 === '火' && element1 === '金') ||
        (element2 === '金' && element1 === '木')) {
        return '耗';  // 被克
    }
    
    return '未知';  // 不应该到达这里
}

// 定义常量
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 初始化大运分析
 */
function initDayunAnalysis() {
    try {
        // 尝试获取八字分析数据
        let baziData = null;
        
        // 尝试从不同的存储键获取数据
        const storageKeys = ['baziAnalysisData', 'bazi_analysis_result', 'analysisResult'];
        for (const key of storageKeys) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    baziData = JSON.parse(data);
                    console.log(`成功从存储键 "${key}" 获取到八字数据`);
                    break;
                } catch (e) {
                    console.error(`从存储键 "${key}" 解析数据失败:`, e);
                }
            }
        }
        
        if (!baziData) {
            console.error('未找到八字分析数据');
            document.getElementById('dayun-timeline').innerHTML = 
                '<div class="error-message">无法获取用户数据，请返回填写用户信息</div>';
            return;
        }
        
        // 提取用户基本信息
        const gender = baziData.gender || '男';
        let birthDateStr = '';
        
        // 尝试不同的字段获取生日
        if (baziData.birthDate) {
            birthDateStr = baziData.birthDate;
        } else if (baziData.birth && baziData.birth.date) {
            birthDateStr = baziData.birth.date;
        } else if (baziData.userData && baziData.userData.birthDate) {
            birthDateStr = baziData.userData.birthDate;
        }
        
        if (!birthDateStr) {
            console.error('未找到用户出生日期');
            document.getElementById('dayun-timeline').innerHTML = 
                '<div class="error-message">无法获取用户出生日期，请返回填写完整信息</div>';
            return;
        }
        
        // 解析出生日期
        let birthDate = null;
        
        // 尝试解析不同格式的日期
        if (/^\d{4}[-/年]\d{1,2}[-/月]\d{1,2}/.test(birthDateStr)) {
            // 标准格式：2000-01-01 或 2000年01月01日
            birthDateStr = birthDateStr.replace(/年|月|日/g, '-').replace(/\//g, '-');
            if (birthDateStr.endsWith('-')) {
                birthDateStr = birthDateStr.slice(0, -1);
            }
            birthDate = new Date(birthDateStr);
        } else {
            console.error('无法解析日期格式:', birthDateStr);
            document.getElementById('dayun-timeline').innerHTML = 
                '<div class="error-message">日期格式错误，请返回重新填写</div>';
            return;
        }
        
        // 检查lunar库是否加载
        if (typeof Lunar === 'undefined' || typeof Solar === 'undefined') {
            console.error('lunar库未加载，无法计算大运');
            document.getElementById('dayun-timeline').innerHTML = 
                '<div class="error-message">缺少大运计算所需的农历库，无法生成分析</div>';
            return;
        }
        
        // 提取出生时间信息
        let birthHour = 0;
        let birthMinute = 0;
        
        if (baziData.birthTime) {
            const timeMatch = baziData.birthTime.match(/(\d{1,2})[时:](\d{1,2})?/);
            if (timeMatch) {
                birthHour = parseInt(timeMatch[1]);
                birthMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            }
        } else if (baziData.birth && baziData.birth.time) {
            const timeMatch = baziData.birth.time.match(/(\d{1,2})[时:](\d{1,2})?/);
            if (timeMatch) {
                birthHour = parseInt(timeMatch[1]);
                birthMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            }
        }
        
        // 创建公历日期对象
        const solar = Solar.fromYmdHms(
            birthDate.getFullYear(),
            birthDate.getMonth() + 1,
            birthDate.getDate(),
            birthHour,
            birthMinute,
            0
        );
        
        // 获取农历信息
        const lunar = solar.getLunar();
        
        // 获取四柱干支
        const yearGZ = lunar.getYearInGanZhi();
        const monthGZ = lunar.getMonthInGanZhi();
        const dayGZ = lunar.getDayInGanZhi();
        const timeGZ = lunar.getTimeInGanZhi();
        
        // 确定大运方向 (阳男阴女顺行，阴男阳女逆行)
        const dayGan = dayGZ.charAt(0);
        const dayGanIndex = TIANGAN.indexOf(dayGan);
        const isYangGan = dayGanIndex % 2 === 0; // 甲丙戊庚壬为阳，乙丁己辛癸为阴
        
        // 确定大运顺逆
        let isForward;
        if ((isYangGan && gender === '男') || (!isYangGan && gender === '女')) {
            isForward = true; // 顺行
        } else {
            isForward = false; // 逆行
        }
        
        // 显示大运方向
        document.getElementById('dayun-direction').textContent = isForward ? '顺行' : '逆行';
        
        // 计算大运起始年龄 (简化计算，实际大运排盘更复杂)
        // 按照出生后3个月起运简化计算
        const startAgeMonth = 3;
        const startAge = Math.ceil(startAgeMonth / 12);
        const startYear = birthDate.getFullYear() + startAge;
        
        // 显示起运年龄和年份
        document.getElementById('dayun-start-age').textContent = startAge;
        document.getElementById('dayun-start-year').textContent = startYear;
        
        // 生成大运干支序列
        const dayuns = generateDayunSequence(monthGZ, isForward, 8);
        
        // 渲染大运时间轴
        renderDayunTimeline(dayuns, startYear, startAge);
        
        // 默认选中当前所在大运
        const currentYear = new Date().getFullYear();
        updateDayunSelection(currentYear, dayuns);
        
        // 初始化流年分析
        initLiunianAnalysis();
        
    } catch (error) {
        console.error('初始化大运分析失败:', error);
        document.getElementById('dayun-timeline').innerHTML = 
            `<div class="error-message">计算大运出错: ${error.message}</div>`;
    }
}

/**
 * 生成大运干支序列
 * @param {string} startGZ - 起始干支（通常是月柱干支）
 * @param {boolean} isForward - 是否顺行
 * @param {number} count - 生成数量
 * @returns {Array} 大运干支数组
 */
function generateDayunSequence(startGZ, isForward, count) {
    const startGan = startGZ.charAt(0);
    const startZhi = startGZ.charAt(1);
    
    let ganIndex = TIANGAN.indexOf(startGan);
    let zhiIndex = DIZHI.indexOf(startZhi);
    
    if (ganIndex === -1 || zhiIndex === -1) {
        console.error('无效的干支:', startGZ);
        return [];
    }
    
    const dayuns = [];
    
    for (let i = 0; i < count; i++) {
        // 计算干支索引
        const currentGanIndex = isForward ? (ganIndex + i) % 10 : (ganIndex - i + 10) % 10;
        const currentZhiIndex = isForward ? (zhiIndex + i) % 12 : (zhiIndex - i + 12) % 12;
        
        // 获取干支
        const gan = TIANGAN[currentGanIndex];
        const zhi = DIZHI[currentZhiIndex];
        
        dayuns.push({
            index: i,
            ganZhi: gan + zhi,
            startAge: i * 10, // 每个大运10年
            endAge: (i + 1) * 10 - 1,
            element: getElementByGan(gan)
        });
    }
    
    return dayuns;
}

/**
 * 渲染大运时间轴
 * @param {Array} dayuns - 大运数组
 * @param {number} startYear - 起运年份
 * @param {number} startAge - 起运年龄
 */
function renderDayunTimeline(dayuns, startYear, startAge) {
    const timelineElement = document.getElementById('dayun-timeline');
    if (!timelineElement) {
        console.error('未找到大运时间轴容器');
        return;
    }
    
    // 清空时间轴
    timelineElement.innerHTML = '';
    
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    
    // 渲染每个大运
    dayuns.forEach((dayun, index) => {
        // 计算大运开始和结束年份
        const dyStartAge = startAge + dayun.startAge;
        const dyEndAge = startAge + dayun.endAge;
        const dyStartYear = startYear + dayun.startAge;
        const dyEndYear = startYear + dayun.endAge;
        
        // 计算是否是当前大运
        const isCurrent = currentYear >= dyStartYear && currentYear <= dyEndYear;
        
        // 创建大运元素
        const dayunElement = document.createElement('div');
        dayunElement.className = `dayun-item ${isCurrent ? 'current' : ''}`;
        dayunElement.setAttribute('data-index', index);
        dayunElement.setAttribute('data-ganzhi', dayun.ganZhi);
        
        // 设置大运内容
        dayunElement.innerHTML = `
            <div class="dayun-ages">${dyStartAge}-${dyEndAge}岁</div>
            <div class="dayun-ganzhi">${dayun.ganZhi}</div>
            <div class="dayun-years">${dyStartYear}-${dyEndYear}</div>
        `;
        
        // 添加点击事件
        dayunElement.addEventListener('click', () => {
            // 移除其他大运的选中状态
            timelineElement.querySelectorAll('.dayun-item').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 添加选中状态
            dayunElement.classList.add('selected');
            
            // 更新大运详情
            updateDayunDetails(dayun, dyStartAge, dyEndAge, dyStartYear, dyEndYear);
        });
        
        // 添加到时间轴
        timelineElement.appendChild(dayunElement);
    });
    
    // 如果有当前大运，默认选中
    const currentDayun = timelineElement.querySelector('.dayun-item.current');
    if (currentDayun) {
        currentDayun.click();
    } else {
        // 如果没有当前大运，选中第一个
        const firstDayun = timelineElement.querySelector('.dayun-item');
        if (firstDayun) {
            firstDayun.click();
        }
    }
}

/**
 * 更新大运选中状态
 * @param {number} year - 当前年份
 * @param {Array} dayuns - 大运数组
 */
function updateDayunSelection(year, dayuns) {
    // 查找包含当前年份的大运
    for (let i = 0; i < dayuns.length; i++) {
        const startYear = year - (i * 10);
        if (startYear <= year && year <= startYear + 9) {
            // 找到包含当前年份的大运，模拟点击
            const dayunElement = document.querySelector(`.dayun-item[data-index="${i}"]`);
            if (dayunElement) {
                dayunElement.click();
                break;
            }
        }
    }
}

/**
 * 更新大运详情
 * @param {Object} dayun - 大运信息
 * @param {number} startAge - 开始年龄
 * @param {number} endAge - 结束年龄
 * @param {number} startYear - 开始年份
 * @param {number} endYear - 结束年份
 */
function updateDayunDetails(dayun, startAge, endAge, startYear, endYear) {
    // 更新大运标题信息
    document.getElementById('current-dayun-year').textContent = `${startYear}-${endYear}`;
    document.getElementById('current-dayun-ganzhi').textContent = dayun.ganZhi;
    document.getElementById('current-dayun-age-range').textContent = `${startAge}-${endAge}`;
    
    // 根据大运五行生成分析文本
    const element = dayun.element;
    
    // 生成大运关键词
    generateDayunKeywords(dayun);
    
    // 更新各个领域的分析
    updateDayunCareerAnalysis(dayun);
    updateDayunWealthAnalysis(dayun);
    updateDayunHealthAnalysis(dayun);
    updateDayunRelationshipAnalysis(dayun);
}

/**
 * 生成大运关键词云
 * @param {Object} dayun - 大运信息
 */
function generateDayunKeywords(dayun) {
    const keywordsElement = document.getElementById('dayun-keywords');
    if (!keywordsElement) return;
    
    // 清空关键词容器
    keywordsElement.innerHTML = '';
    
    // 根据五行生成关键词
    const element = dayun.element;
    let keywords = [];
    
    // 基于五行的通用关键词
    switch(element) {
        case '木':
            keywords = ['成长', '创新', '拓展', '灵活', '进取', '决策', '领导', '规划', '远见', '变革'];
            break;
        case '火':
            keywords = ['热情', '表现', '社交', '人气', '创意', '激情', '活力', '辐射', '影响力', '扩张'];
            break;
        case '土':
            keywords = ['稳定', '务实', '中庸', '可靠', '包容', '诚信', '踏实', '沉稳', '承担', '信任'];
            break;
        case '金':
            keywords = ['精确', '规范', '纪律', '条理', '高效', '坚毅', '决断', '权威', '精致', '完善'];
            break;
        case '水':
            keywords = ['智慧', '思考', '钻研', '交流', '灵活', '适应', '流动', '变通', '深度', '探索'];
            break;
    }
    
    // 随机排序并取前8个关键词
    const shuffledKeywords = keywords.sort(() => 0.5 - Math.random()).slice(0, 8);
    
    // 为每个关键词创建标签
    shuffledKeywords.forEach(keyword => {
        const tagElement = document.createElement('div');
        tagElement.className = 'keyword-tag';
        tagElement.textContent = keyword;
        
        // 随机大小 (1-5)
        const size = 1 + Math.floor(Math.random() * 5);
        tagElement.classList.add(`size-${size}`);
        
        keywordsElement.appendChild(tagElement);
    });
}

/**
 * 更新大运事业分析
 * @param {Object} dayun - 大运信息
 */
function updateDayunCareerAnalysis(dayun) {
    const careerElement = document.getElementById('dayun-career');
    if (!careerElement) return;
    
    // 根据五行生成事业分析
    const element = dayun.element;
    let analysis = '';
    
    switch(element) {
        case '木':
            analysis = '事业上有向上发展的势头，适合开创新事业或扩展现有业务。领导能力提升，具有长远规划能力和决策力。适合创业、管理、教育、法律等需要成长和拓展的行业。';
            break;
        case '火':
            analysis = '事业发展活跃，人际关系广泛，容易得到展示才华的机会。适合需要表现力和创造力的工作，如市场营销、媒体、演艺、设计等行业。社交圈扩大，有利于职场晋升。';
            break;
        case '土':
            analysis = '事业稳步上升，踏实稳健，注重积累和沉淀。适合需要专注和耐心的领域，如行政管理、房地产、农业、保险等。可获得长辈或上司赏识，有担当精神。';
            break;
        case '金':
            analysis = '事业精进阶段，工作效率和质量提高，重视细节和完善。适合金融、IT、制造、质检等需要精确和规范的行业。有执行力和条理性，善于总结经验。';
            break;
        case '水':
            analysis = '事业思路开阔，创新意识强，喜欢探索和研究。适合学术研究、咨询顾问、旅游、贸易等需要灵活思维的行业。人脉广泛，信息灵通，善于把握机会。';
            break;
    }
    
    careerElement.textContent = analysis;
}

/**
 * 更新大运财富分析
 * @param {Object} dayun - 大运信息
 */
function updateDayunWealthAnalysis(dayun) {
    const wealthElement = document.getElementById('dayun-wealth');
    if (!wealthElement) return;
    
    // 根据五行生成财富分析
    const element = dayun.element;
    let analysis = '';
    
    switch(element) {
        case '木':
            analysis = '财运积极上扬，适合投资长期回报项目。财源多样化，有开拓新财路的能力。善于规划财务，但需注意投资风险控制，避免过于激进。收入主要来自个人能力和创业项目。';
            break;
        case '火':
            analysis = '财运活跃，容易获得意外之财。适合短期投资和流动性强的理财产品。社交带来财富机会，但支出也较大，需控制冲动消费。收入可能与创意、营销、社交活动相关。';
            break;
        case '土':
            analysis = '财运稳定且有积累，适合稳健型投资和不动产。理财态度保守务实，注重资产保值。有积少成多的能力，善于开源节流。收入可能与房产、保险、管理工作相关。';
            break;
        case '金':
            analysis = '财运精准且有计划性，善于管理资金和资产配置。投资理性，追求确定性收益。有存钱和增值能力，注重财富品质。收入可能与金融、技术、精密行业相关。';
            break;
        case '水':
            analysis = '财运多变且流动性强，善于把握投资机会。财务思维灵活，能够适应市场变化。对信息敏感，可能通过信息差获利。收入可能与贸易、运输、咨询、信息产业相关。';
            break;
    }
    
    wealthElement.textContent = analysis;
}

/**
 * 更新大运健康分析
 * @param {Object} dayun - 大运信息
 */
function updateDayunHealthAnalysis(dayun) {
    const healthElement = document.getElementById('dayun-health');
    if (!healthElement) return;
    
    // 根据五行生成健康分析
    const element = dayun.element;
    let zhAnalysis = '';
    let enAnalysis = '';
    
    switch(element) {
        case '木':
            zhAnalysis = '整体健康状况良好，但需注意肝胆系统。保持情绪平和，避免过度紧张和压力。建议适当运动舒展筋骨，规律作息。易受风邪影响，注意季节变化时的保暖。';
            enAnalysis = 'Overall health is good, but pay attention to liver and gallbladder systems. Keep emotions calm, avoid excessive tension and stress. Recommend appropriate exercise to stretch muscles and maintain regular rest. Susceptible to wind-related ailments, stay warm during seasonal changes.';
            break;
        case '火':
            zhAnalysis = '活力充沛，但容易心火旺盛。注意心脑血管健康，避免情绪过度兴奋。建议适量运动，保持心情愉悦。易受暑热影响，夏季应注意防暑降温，保持充足睡眠。';
            enAnalysis = 'Full of vitality, but prone to excessive heart fire. Pay attention to cardiovascular health, avoid over-excitement. Recommend moderate exercise, maintain good mood. Susceptible to summer heat, take precautions against heat in summer and maintain sufficient sleep.';
            break;
        case '土':
            zhAnalysis = '体质较为稳定，但需关注消化系统。注意饮食规律，避免过度思虑忧愁。建议适量运动增强脾胃功能，保持心情舒畅。易受湿邪影响，梅雨季节应注意防潮。';
            enAnalysis = 'Constitution is stable, but need to focus on digestive system. Maintain regular diet, avoid excessive worry. Recommend moderate exercise to strengthen spleen and stomach function, keep mood pleasant. Susceptible to dampness, take precautions during rainy seasons.';
            break;
        case '金':
            zhAnalysis = '免疫力较强，但需关注呼吸系统。注意保持居所通风，避免接触过敏原。建议适当增强肺部功能的运动，如慢跑、游泳等。易受燥邪影响，秋季应注意保湿。';
            enAnalysis = 'Strong immunity, but need to focus on respiratory system. Keep living space well-ventilated, avoid allergens. Recommend exercises that strengthen lung function, like jogging and swimming. Susceptible to dryness, maintain moisture in autumn.';
            break;
        case '水':
            zhAnalysis = '精力充沛，思维活跃，但需关注肾脏和泌尿系统。注意保暖，避免过度劳累。建议适量补水但避免过饮，保持充足睡眠。易受寒邪影响，冬季应特别注意保暖。';
            enAnalysis = 'Energetic with active mind, but need to focus on kidney and urinary system. Stay warm and avoid overwork. Recommend moderate water intake but avoid excessive drinking, maintain sufficient sleep. Susceptible to cold, pay special attention to keeping warm in winter.';
            break;
    }
    
    healthElement.innerHTML = `<div class="lang-content" data-lang="zh">${zhAnalysis}</div><div class="lang-content" data-lang="en">${enAnalysis}</div>`;
}

/**
 * 更新大运人际关系分析
 * @param {Object} dayun - 大运信息
 */
function updateDayunRelationshipAnalysis(dayun) {
    const relationshipElement = document.getElementById('dayun-relationships');
    if (!relationshipElement) return;
    
    // 根据五行生成人际关系分析
    const element = dayun.element;
    let zhAnalysis = '';
    let enAnalysis = '';
    
    switch(element) {
        case '木':
            zhAnalysis = '人际关系积极向上，善于开拓人脉和社交圈。领导能力提升，容易获得他人认可。家庭关系需要平衡事业与家庭的时间。感情上主动积极，但可能因工作忙碌而疏忽感情经营。';
            enAnalysis = 'Interpersonal relationships are positive and upward, good at expanding social networks. Leadership abilities improve, easily gaining recognition from others. Family relationships need balance between career and family time. Proactive in relationships, but may neglect emotional investment due to busy work.';
            break;
        case '火':
            zhAnalysis = '人际关系活跃广泛，社交能力强，容易受欢迎。家庭关系温暖融洽，但需稳定情绪，避免火爆脾气。感情上热情奔放，容易吸引异性，但也需避免过于理想化。';
            enAnalysis = 'Active and extensive social relationships, strong social skills, easily popular. Family relationships are warm and harmonious, but need emotional stability to avoid hot temper. Passionate in relationships, easily attracts others, but should avoid being too idealistic.';
            break;
        case '土':
            zhAnalysis = '人际关系稳固可靠，注重长期深厚的友谊。家庭关系和睦，重视家庭责任，尊敬长辈。感情上踏实专一，追求安稳和谐的关系，适合婚姻稳定发展。';
            enAnalysis = 'Stable and reliable relationships, values long-term deep friendships. Harmonious family relationships, values family responsibilities and respects elders. Steady and faithful in relationships, pursues stable and harmonious connections, suitable for stable marriage development.';
            break;
        case '金':
            zhAnalysis = '人际关系讲究品质而非数量，社交圈精英化。家庭关系注重规范和责任，可能较为严格。感情上理性务实，重视对方的社会地位和能力，较少冲动决策。';
            enAnalysis = 'Values quality over quantity in relationships, elite social circle. Family relationships emphasize norms and responsibilities, may be relatively strict. Rational and practical in relationships, values partner\'s social status and abilities, less impulsive in decision-making.';
            break;
        case '水':
            zhAnalysis = '人际关系广泛灵活，善于沟通交流，了解各方信息。家庭关系需要增加沟通和理解，避免过于疏离。感情上敏感聪慧，需要精神层面的共鸣，可能较为理想主义。';
            enAnalysis = 'Extensive and flexible relationships, good at communication and understanding various information. Family relationships need more communication and understanding to avoid detachment. Sensitive and intelligent in relationships, needs spiritual resonance, may be somewhat idealistic.';
            break;
    }
    
    relationshipElement.innerHTML = `<div class="lang-content" data-lang="zh">${zhAnalysis}</div><div class="lang-content" data-lang="en">${enAnalysis}</div>`;
}

/**
 * 连接大运和十神分析
 * 当用户点击大运时，更新十神分析显示
 */
function linkDayunAndShishen() {
    // 获取所有大运元素
    const dayunItems = document.querySelectorAll('.dayun-item');
    const shishenAnalysis = document.getElementById('shishen-analysis');
    const personalityTraits = document.getElementById('personality-traits');
    
    if (!dayunItems || !shishenAnalysis || !personalityTraits) {
        console.log('大运或十神分析元素未找到，无法建立链接');
        return;
    }
    
    // 为每个大运元素添加点击事件
    dayunItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取当前大运的干支
            const ganZhi = this.getAttribute('data-ganzhi');
            if (!ganZhi) return;
            
            // 生成相应的十神分析文本
            const gan = ganZhi.charAt(0); // 取天干
            let analysisText = '';
            let traits = [];
            
            // 根据天干生成不同的分析
            switch(gan) {
                case '甲':
                case '乙':
                    analysisText = '木性大运期间，十神表现为积极进取，创新能力增强。' +
                                  '适合发展创业、教育、法律等需要思维灵活的事业。' +
                                  '人际关系方面需注意不要过于固执己见，学会变通。';
                    traits = ['创新', '进取', '灵活', '决策力强', '有远见', '固执'];
                    break;
                case '丙':
                case '丁':
                    analysisText = '火性大运期间，十神表现为热情活跃，表达能力和人际魅力增强。' +
                                  '适合从事营销、演艺、教育等需要表现力的工作。' +
                                  '需注意情绪波动，避免过度兴奋导致决策失误。';
                    traits = ['热情', '表现力强', '活力充沛', '魅力四射', '情绪波动', '冲动'];
                    break;
                case '戊':
                case '己':
                    analysisText = '土性大运期间，十神表现为稳健务实，组织能力和责任感增强。' +
                                  '适合从事管理、房地产、金融等需要稳定性的工作。' +
                                  '为人踏实可靠，但需避免过于保守，错失发展机会。';
                    traits = ['踏实', '稳重', '可靠', '责任感强', '保守', '固化思维'];
                    break;
                case '庚':
                case '辛':
                    analysisText = '金性大运期间，十神表现为精确严谨，执行力和纪律性增强。' +
                                  '适合从事金融、IT、制造等需要精确度的行业。' +
                                  '处事果断有原则，但需注意人际沟通的柔和度。';
                    traits = ['执行力', '严谨', '规范', '果断', '精确', '刻板'];
                    break;
                case '壬':
                case '癸':
                    analysisText = '水性大运期间，十神表现为智慧灵活，思维敏捷，洞察力增强。' +
                                  '适合从事咨询、研究、贸易等需要应变能力的工作。' +
                                  '人际关系灵活多变，但需增强坚持性和专注度。';
                    traits = ['智慧', '灵活', '洞察力', '应变能力', '多变', '缺乏专注'];
                    break;
            }
            
            // 更新十神分析文本
            shishenAnalysis.textContent = analysisText;
            
            // 清空并重新生成性格特质标签
            personalityTraits.innerHTML = '';
            traits.forEach(trait => {
                const tagElement = document.createElement('div');
                tagElement.className = 'trait-tag';
                tagElement.textContent = trait;
                personalityTraits.appendChild(tagElement);
            });
            
            // 滚动到十神分析区域
            document.getElementById('shishen-personalized').scrollIntoView({behavior: 'smooth'});
        });
    });
    
    console.log('已成功建立大运与十神分析的联动');
}

/**
 * 渲染十神关系图谱
 */
function renderShishenDiagram() {
    const diagramContainer = document.getElementById('shishen-diagram');
    if (!diagramContainer) {
        console.error('未找到十神图谱容器');
        return;
    }
    
    // 创建简化版十神关系图
    // 在实际应用中，可以使用专业的图表库如D3.js或mermaid.js
    
    diagramContainer.innerHTML = `
        <div class="shishen-diagram-simple">
            <div class="diagram-center">
                <div class="node main-node">日主</div>
            </div>
            <div class="diagram-level">
                <div class="node">比肩</div>
                <div class="node">劫财</div>
                <div class="node">食神</div>
                <div class="node">伤官</div>
            </div>
            <div class="diagram-level">
                <div class="node">正财</div>
                <div class="node">偏财</div>
                <div class="node">正官</div>
                <div class="node">七杀</div>
                <div class="node">正印</div>
                <div class="node">偏印</div>
            </div>
        </div>
        <div class="diagram-note">
            注：此图展示十神关系基本结构，详细分析请查看下方解释
        </div>
    `;
    
    // 为节点添加点击事件
    const nodes = diagramContainer.querySelectorAll('.node');
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            // 获取节点文本
            const shishenType = this.textContent;
            
            // 高亮选中节点
            nodes.forEach(n => n.classList.remove('selected'));
            this.classList.add('selected');
            
            // 更新对应的十神解释
            updateShishenExplanation(shishenType);
        });
    });
    
    console.log('十神关系图谱渲染完成');
}

/**
 * 更新十神解释
 */
function updateShishenExplanation(shishenType) {
    const explanations = {
        '日主': '八字核心，代表自己，决定喜用神',
        '比肩': '与日主天干相同，代表兄弟姐妹、朋友、同事，表示竞争与协助',
        '劫财': '与日主天干同五行异阴阳，代表竞争者，夺取财物',
        '食神': '日主天干所生之五行阳性，代表子女、创造力、艺术才能、享乐',
        '伤官': '日主天干所生之五行阴性，代表才华、智慧、口才、革新能力',
        '正财': '日主天干所克之五行阳性，代表正当财，如工资、家产',
        '偏财': '日主天干所克之五行阴性，代表意外之财，如奖金、彩票',
        '正官': '克日主天干之五行阳性，代表规矩、权威、贵人、配偶',
        '七杀': '克日主天干之五行阴性，代表压力、权力、威严、困难',
        '正印': '生日主天干之五行阳性，代表学识、文化修养、母亲',
        '偏印': '生日主天干之五行阴性，代表智慧、灵感、秘密、潜能'
    };
    
    // 更新解释文本
    const analysisElement = document.getElementById('shishen-analysis');
    if (analysisElement) {
        analysisElement.textContent = explanations[shishenType] || '请选择一个十神元素查看解释';
    }
}

// 当DOM加载完成时,初始化高级分析功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化基本功能
    initUserForm();
    
    // 检查是否在分析结果页面
    if (document.getElementById('bazi-analysis')) {
        // 初始化高级分析功能
        initAdvancedAnalysis();
        
        // 初始化十神关系图谱
        renderShishenDiagram();
    }
});

/**
 * 前端计算八字
 */
function calculateBaziByFrontend(formData) {
    // ... existing code ...
    
    try {
        // 创建公历日期
        const solar = Solar.fromYmdHms(
            parseInt(formData.year), 
            parseInt(formData.month), 
            parseInt(formData.day),
            parseInt(formData.hour) || 0,
            parseInt(formData.minute) || 0,
            0
        );
        
        // 转换为农历
        const lunar = solar.getLunar();
        
        // 输出调试信息
        console.log('生肖对象检查:');
        console.log('- lunar.getYearShengXiao()', lunar.getYearShengXiao());
        console.log('- LunarUtil.SHENGXIAO', LunarUtil.SHENGXIAO);
        console.log('- lunar.getYearZhiIndex()', lunar.getYearZhiIndex());
        
        // 生成结果
        const result = {
            // ... existing code ...
            
            shengxiao: lunar.getYearShengXiao(),
            
            // ... existing code ...
        };
        
        console.log('前端计算完成:', result);
        return result;
    } catch (error) {
        // ... existing code ...
    }
}

