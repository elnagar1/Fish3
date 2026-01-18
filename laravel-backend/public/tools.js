// ============================================
// Fish Farm Tools - Smart Calculator Module
// Based on FAO & Boyd (2014) Scientific Guidelines
// ============================================

// ============================================
// Scientific Data - Feed Rates by Species & Stage
// ============================================

const SPECIES_DATA = {
    tilapia: {
        name: 'البلطي',
        stages: {
            fry: { rate: 0.10, protein: '40-45%', proteinValue: 42 },
            fry2: { rate: 0.08, protein: '35-40%', proteinValue: 38 },
            fingerling: { rate: 0.05, protein: '32-35%', proteinValue: 33 },
            juvenile: { rate: 0.04, protein: '28-32%', proteinValue: 30 },
            growout: { rate: 0.03, protein: '28-30%', proteinValue: 29 },
            market: { rate: 0.02, protein: '25-28%', proteinValue: 26 },
            broodstock: { rate: 0.015, protein: '28-32%', proteinValue: 30 }
        },
        optimalTemp: { min: 25, max: 30 },
        feedFrequency: { fry: 6, fry2: 4, fingerling: 3, juvenile: 2, growout: 2, market: 2, broodstock: 1 }
    },
    catfish: {
        name: 'القرموط',
        stages: {
            fry: { rate: 0.08, protein: '45-50%', proteinValue: 47 },
            fry2: { rate: 0.07, protein: '42-45%', proteinValue: 43 },
            fingerling: { rate: 0.055, protein: '40-45%', proteinValue: 42 },
            juvenile: { rate: 0.035, protein: '35-40%', proteinValue: 37 },
            growout: { rate: 0.02, protein: '32-35%', proteinValue: 33 },
            market: { rate: 0.015, protein: '30-32%', proteinValue: 31 },
            broodstock: { rate: 0.015, protein: '30-35%', proteinValue: 32 }
        },
        optimalTemp: { min: 26, max: 30 },
        feedFrequency: { fry: 8, fry2: 6, fingerling: 4, juvenile: 3, growout: 2, market: 2, broodstock: 1 }
    },
    carp: {
        name: 'المبروك',
        stages: {
            fry: { rate: 0.08, protein: '35-40%', proteinValue: 37 },
            fry2: { rate: 0.06, protein: '32-35%', proteinValue: 33 },
            fingerling: { rate: 0.04, protein: '28-32%', proteinValue: 30 },
            juvenile: { rate: 0.03, protein: '25-28%', proteinValue: 26 },
            growout: { rate: 0.025, protein: '23-25%', proteinValue: 24 },
            market: { rate: 0.02, protein: '20-23%', proteinValue: 22 },
            broodstock: { rate: 0.015, protein: '25-28%', proteinValue: 26 }
        },
        optimalTemp: { min: 24, max: 28 },
        feedFrequency: { fry: 6, fry2: 4, fingerling: 3, juvenile: 2, growout: 2, market: 2, broodstock: 1 }
    },
    seabass: {
        name: 'القاروص',
        stages: {
            fry: { rate: 0.08, protein: '50-55%', proteinValue: 52 },
            fry2: { rate: 0.06, protein: '48-50%', proteinValue: 49 },
            fingerling: { rate: 0.04, protein: '45-48%', proteinValue: 46 },
            juvenile: { rate: 0.03, protein: '42-45%', proteinValue: 43 },
            growout: { rate: 0.025, protein: '40-42%', proteinValue: 41 },
            market: { rate: 0.02, protein: '38-40%', proteinValue: 39 },
            broodstock: { rate: 0.015, protein: '40-45%', proteinValue: 42 }
        },
        optimalTemp: { min: 22, max: 28 },
        feedFrequency: { fry: 8, fry2: 6, fingerling: 4, juvenile: 3, growout: 2, market: 2, broodstock: 1 }
    },
    mullet: {
        name: 'البوري',
        stages: {
            fry: { rate: 0.06, protein: '35-40%', proteinValue: 37 },
            fry2: { rate: 0.05, protein: '32-35%', proteinValue: 33 },
            fingerling: { rate: 0.04, protein: '28-32%', proteinValue: 30 },
            juvenile: { rate: 0.03, protein: '25-28%', proteinValue: 26 },
            growout: { rate: 0.025, protein: '22-25%', proteinValue: 23 },
            market: { rate: 0.02, protein: '20-22%', proteinValue: 21 },
            broodstock: { rate: 0.015, protein: '25-28%', proteinValue: 26 }
        },
        optimalTemp: { min: 20, max: 27 },
        feedFrequency: { fry: 6, fry2: 4, fingerling: 3, juvenile: 2, growout: 2, market: 2, broodstock: 1 }
    },
    other: {
        name: 'أخرى',
        stages: {
            fry: { rate: 0.08, protein: '35-40%', proteinValue: 37 },
            fry2: { rate: 0.06, protein: '32-35%', proteinValue: 33 },
            fingerling: { rate: 0.04, protein: '28-32%', proteinValue: 30 },
            juvenile: { rate: 0.03, protein: '25-28%', proteinValue: 26 },
            growout: { rate: 0.025, protein: '23-25%', proteinValue: 24 },
            market: { rate: 0.02, protein: '20-23%', proteinValue: 22 },
            broodstock: { rate: 0.015, protein: '25-28%', proteinValue: 26 }
        },
        optimalTemp: { min: 24, max: 30 },
        feedFrequency: { fry: 6, fry2: 4, fingerling: 3, juvenile: 2, growout: 2, market: 2, broodstock: 1 }
    }
};

// Temperature adjustment factors
const TEMP_FACTORS = [
    { min: 0, max: 18, factor: 0.25, status: 'danger', hint: '❄️ بارد جداً - تغذية محدودة' },
    { min: 18, max: 22, factor: 0.50, status: 'warning', hint: '🌡️ بارد - تغذية منخفضة' },
    { min: 22, max: 25, factor: 0.75, status: 'warning', hint: '🌡️ معتدل - تغذية متوسطة' },
    { min: 25, max: 30, factor: 1.00, status: 'optimal', hint: '✅ درجة حرارة مثالية للتغذية' },
    { min: 30, max: 32, factor: 0.75, status: 'warning', hint: '🌡️ دافئ - تغذية متوسطة' },
    { min: 32, max: 40, factor: 0.25, status: 'danger', hint: '🔥 حار جداً - إجهاد حراري' }
];

// ============================================
// Modal Functions
// ============================================

function openTool(toolId) {
    const modal = document.getElementById(`${toolId}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateFeedSettings();
    }
}

function closeTool() {
    const modals = document.querySelectorAll('.tool-modal');
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTool();
});

// ============================================
// Dynamic Settings Updates
// ============================================

function updateFeedSettings() {
    const species = document.getElementById('fishSpecies').value;
    const stage = document.getElementById('growthStage').value;

    if (SPECIES_DATA[species] && SPECIES_DATA[species].stages[stage]) {
        const data = SPECIES_DATA[species].stages[stage];

        // Update feed rate hint
        const feedRateHint = document.getElementById('feedRateHint');
        if (feedRateHint) {
            feedRateHint.textContent = `معدل التغذية: ${(data.rate * 100).toFixed(0)}% من وزن الجسم`;
        }

        // Update protein hint and default value
        const proteinHint = document.getElementById('proteinHint');
        const proteinInput = document.getElementById('proteinPercent');
        if (proteinHint) {
            proteinHint.textContent = `موصى به: ${data.protein} لهذه المرحلة`;
        }
        if (proteinInput && !proteinInput.value) {
            proteinInput.value = data.proteinValue;
        }
    }

    updateTempDisplay();
}

function updateFeedRate() {
    updateFeedSettings();
}

function updateTempDisplay() {
    const temp = parseInt(document.getElementById('waterTemp').value);
    const tempDisplay = document.getElementById('tempDisplay');
    const tempHint = document.getElementById('tempHint');

    if (tempDisplay) {
        tempDisplay.textContent = temp + '°C';
    }

    if (tempHint) {
        const tempData = TEMP_FACTORS.find(t => temp >= t.min && temp < t.max);
        if (tempData) {
            tempHint.textContent = tempData.hint;
            tempHint.className = 'input-hint temp-' + tempData.status;
        }
    }
}

function suggestGrowthStage() {
    const weight = parseFloat(document.getElementById('avgWeight').value);
    const stageSelect = document.getElementById('growthStage');

    if (!weight || !stageSelect) return;

    let suggestedStage = 'juvenile';

    if (weight < 1) suggestedStage = 'fry';
    else if (weight < 5) suggestedStage = 'fry2';
    else if (weight < 50) suggestedStage = 'fingerling';
    else if (weight < 200) suggestedStage = 'juvenile';
    else if (weight < 500) suggestedStage = 'growout';
    else suggestedStage = 'market';

    stageSelect.value = suggestedStage;
    updateFeedSettings();
}

function getTempFactor(temp) {
    const tempData = TEMP_FACTORS.find(t => temp >= t.min && temp < t.max);
    return tempData ? tempData.factor : 1.0;
}

// ============================================
// Main Calculation Function
// ============================================

function calculateFeed() {
    // Get input values
    const species = document.getElementById('fishSpecies').value;
    const stage = document.getElementById('growthStage').value;
    const fishCount = parseFloat(document.getElementById('fishCount').value);
    const avgWeight = parseFloat(document.getElementById('avgWeight').value);
    const waterTemp = parseFloat(document.getElementById('waterTemp').value);
    const proteinPercent = parseFloat(document.getElementById('proteinPercent').value) || 30;
    const feedUnit = document.getElementById('feedUnit').value;
    const pondVolume = parseFloat(document.getElementById('pondVolume').value);
    const volumeUnit = document.getElementById('volumeUnit').value;

    // Validate inputs
    if (!fishCount || fishCount <= 0) {
        showPrompt('أدخل عدد الأسماك صالح');
        return;
    }

    if (!avgWeight || avgWeight <= 0) {
        showPrompt('أدخل متوسط وزن سمكة صالح (بالجرام)');
        return;
    }

    hidePrompt();

    // Get species-specific data
    const speciesData = SPECIES_DATA[species];
    const stageData = speciesData.stages[stage];
    const baseFeedRate = stageData.rate;

    // Apply temperature adjustment
    const tempFactor = getTempFactor(waterTemp);
    const adjustedFeedRate = baseFeedRate * tempFactor;

    // Calculate total biomass (in grams, then convert to kg)
    const totalBiomassGrams = fishCount * avgWeight;
    const totalBiomassKg = totalBiomassGrams / 1000;

    // Calculate daily feed amount (in grams)
    let feedAmountGrams = totalBiomassGrams * adjustedFeedRate;
    let feedAmount = feedUnit === 'kg' ? feedAmountGrams / 1000 : feedAmountGrams;

    // Calculate protein content
    const proteinAmount = feedAmount * (proteinPercent / 100);

    // Calculate nitrogen (protein × 16%)
    const nitrogenAmount = proteinAmount * 0.16;

    // Calculate ammonia (nitrogen × 1.214) - only ~30% is excreted as TAN
    const ammoniaAmount = nitrogenAmount * 1.214 * 0.30;

    // Calculate ammonia concentration if volume is provided
    let ammoniaConcentration = null;
    if (pondVolume && pondVolume > 0) {
        let volumeInLiters = volumeUnit === 'm3' ? pondVolume * 1000 : pondVolume;
        const ammoniaInMg = ammoniaAmount * (feedUnit === 'kg' ? 1000000 : 1000);
        ammoniaConcentration = ammoniaInMg / volumeInLiters;
    }

    // Update results
    const unit = feedUnit === 'kg' ? 'كجم' : 'جم';
    const biomassUnit = 'كجم';

    document.getElementById('totalBiomass').textContent = formatNumber(totalBiomassKg) + ' ' + biomassUnit;
    document.getElementById('feedAmount').textContent = formatNumber(feedAmount) + ' ' + unit + '/يوم';
    document.getElementById('totalProtein').textContent = formatNumber(proteinAmount) + ' ' + unit;
    document.getElementById('totalNitrogen').textContent = formatNumber(nitrogenAmount, 4) + ' ' + unit;

    if (ammoniaConcentration !== null) {
        document.getElementById('totalAmmonia').textContent =
            formatNumber(ammoniaConcentration, 4) + ' ملجم/لتر';
    } else {
        document.getElementById('totalAmmonia').textContent = formatNumber(ammoniaAmount, 4) + ' ' + unit;
    }

    // Update safety badge
    updateSafetyBadge(ammoniaConcentration);

    // Update recommendations
    updateRecommendations(species, stage, tempFactor, feedAmount, unit);

    // Animate results
    document.querySelectorAll('.result-item').forEach((item, index) => {
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.1}s`;
    });
}

function updateRecommendations(species, stage, tempFactor, feedAmount, unit) {
    const speciesData = SPECIES_DATA[species];
    const frequency = speciesData.feedFrequency[stage] || 2;
    const mealSize = feedAmount / frequency;

    const tips = [];

    tips.push(`قسّم العلف على <strong>${frequency} وجبات</strong> يومياً (~${formatNumber(mealSize)} ${unit}/وجبة)`);

    if (tempFactor < 1) {
        tips.push(`⚠️ تم تقليل الكمية بنسبة ${Math.round((1 - tempFactor) * 100)}% بسبب درجة الحرارة`);
    }

    if (stage === 'fry' || stage === 'fry2') {
        tips.push('🔬 استخدم علف مطحون ناعم للزريعة');
    }

    tips.push('👀 راقب استهلاك الأسماك وعدّل الكمية حسب الحاجة');
    tips.push('⏰ أفضل أوقات التغذية: الصباح الباكر والمساء');

    const tipsContainer = document.getElementById('feedingTips');
    if (tipsContainer) {
        tipsContainer.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }
}

// ============================================
// Helper Functions
// ============================================

function formatNumber(num, decimals = 2) {
    if (num === null || isNaN(num)) return '—';
    return num.toLocaleString('ar-EG', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function showPrompt(message) {
    const prompt = document.getElementById('weight-prompt');
    if (prompt) {
        prompt.querySelector('p').textContent = message;
        prompt.classList.remove('hidden');
    }
}

function hidePrompt() {
    const prompt = document.getElementById('weight-prompt');
    if (prompt) {
        prompt.classList.add('hidden');
    }
}

function clearForm() {
    document.getElementById('fishCount').value = '';
    document.getElementById('avgWeight').value = '';
    document.getElementById('proteinPercent').value = '';
    document.getElementById('pondVolume').value = '';
    document.getElementById('fishSpecies').selectedIndex = 0;
    document.getElementById('growthStage').selectedIndex = 3;
    document.getElementById('feedUnit').selectedIndex = 0;
    document.getElementById('volumeUnit').selectedIndex = 0;
    document.getElementById('waterTemp').value = 28;

    // Reset results
    document.getElementById('totalBiomass').textContent = '—';
    document.getElementById('feedAmount').textContent = '—';
    document.getElementById('totalProtein').textContent = '—';
    document.getElementById('totalNitrogen').textContent = '—';
    document.getElementById('totalAmmonia').textContent = '—';

    hidePrompt();
    updateFeedSettings();

    // Reset safety badge
    const badge = document.querySelector('.results-badge');
    if (badge) {
        badge.innerHTML = '<span class="badge-icon">✓</span><span>آمن</span>';
        badge.style.background = 'rgba(46, 204, 113, 0.2)';
        badge.style.borderColor = 'var(--seaweed)';
    }
}

function updateSafetyBadge(ammoniaConcentration) {
    const badge = document.querySelector('.results-badge');
    if (!badge) return;

    if (ammoniaConcentration === null) {
        badge.innerHTML = '<span class="badge-icon">—</span><span>أدخل حجم الحوض</span>';
        badge.style.background = 'rgba(148, 163, 184, 0.2)';
        badge.style.borderColor = '#94a3b8';
        return;
    }

    if (ammoniaConcentration <= 0.02) {
        badge.innerHTML = '<span class="badge-icon">✓</span><span>آمن</span>';
        badge.style.background = 'rgba(46, 204, 113, 0.2)';
        badge.style.borderColor = 'var(--seaweed)';
    } else if (ammoniaConcentration <= 0.05) {
        badge.innerHTML = '<span class="badge-icon">⚠️</span><span>تحذير</span>';
        badge.style.background = 'rgba(245, 158, 11, 0.2)';
        badge.style.borderColor = '#f59e0b';
    } else {
        badge.innerHTML = '<span class="badge-icon">🚨</span><span>خطر</span>';
        badge.style.background = 'rgba(239, 68, 68, 0.2)';
        badge.style.borderColor = '#ef4444';
    }
}

function toggleScience() {
    const content = document.getElementById('scienceContent');
    const toggle = document.querySelector('.science-toggle');

    if (content && toggle) {
        content.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

// ============================================
// Animations
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .temp-optimal { color: #2ecc71 !important; }
    .temp-warning { color: #f59e0b !important; }
    .temp-danger { color: #ef4444 !important; }
    .featured-result { 
        background: linear-gradient(135deg, rgba(46, 204, 113, 0.3) 0%, rgba(0, 180, 216, 0.3) 100%) !important; 
        border: 2px solid var(--seaweed) !important;
    }
    .result-status { font-size: 0.85rem; margin-top: 5px; }
    .status-safe { color: #2ecc71; }
    .status-warning { color: #f59e0b; }
    .status-danger { color: #ef4444; }
`;
document.head.appendChild(style);

// ============================================
// Water Quality Calculator
// ============================================

const WQ_STANDARDS = {
    temperature: { optimal: { min: 25, max: 30 }, acceptable: { min: 22, max: 32 }, danger: { below: 18, above: 35 } },
    ph: { optimal: { min: 7.0, max: 8.0 }, acceptable: { min: 6.5, max: 9.0 }, danger: { below: 6, above: 9.5 } },
    do: { optimal: 5, acceptable: 4, danger: 3 },
    ammonia: { optimal: 0.02, acceptable: 0.05, danger: 0.1 },
    nitrite: { optimal: 0.1, acceptable: 0.5, danger: 1.0 },
    nitrate: { optimal: 50, acceptable: 100, danger: 200 }
};

function analyzeWaterQuality() {
    const temp = parseFloat(document.getElementById('wqTemperature').value);
    const ph = parseFloat(document.getElementById('wqPH').value);
    const doLevel = parseFloat(document.getElementById('wqDO').value);
    const ammonia = parseFloat(document.getElementById('wqAmmonia').value);
    const nitrite = parseFloat(document.getElementById('wqNitrite').value);
    const nitrate = parseFloat(document.getElementById('wqNitrate').value);

    let overallStatus = 'safe';
    let issues = [];
    let tips = [];

    // Analyze Temperature
    if (!isNaN(temp)) {
        const tempResult = analyzeParameter('temperature', temp, '°C', 'wqTempResult');
        if (tempResult === 'danger') overallStatus = 'danger';
        else if (tempResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (temp < 22) tips.push('🌡️ درجة الحرارة منخفضة - استخدم سخان أو غطاء');
        if (temp > 32) tips.push('🌡️ درجة الحرارة مرتفعة - زد التهوية أو استخدم مظلة');
    }

    // Analyze pH
    if (!isNaN(ph)) {
        const phResult = analyzeParameter('ph', ph, '', 'wqPHResult');
        if (phResult === 'danger') overallStatus = 'danger';
        else if (phResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (ph < 6.5) tips.push('⚗️ pH منخفض - أضف كلس أو بيكربونات');
        if (ph > 9) tips.push('⚗️ pH مرتفع - قلل كثافة الطحالب، غيّر جزء من المياه');
    }

    // Analyze DO
    if (!isNaN(doLevel)) {
        const doResult = analyzeParameter('do', doLevel, 'mg/L', 'wqDOResult');
        if (doResult === 'danger') { overallStatus = 'danger'; issues.push('أكسجين منخفض جداً!'); }
        else if (doResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (doLevel < 4) tips.push('💨 الأكسجين منخفض - شغّل التهوية فوراً!');
        if (doLevel < 3) tips.push('🚨 خطر نفوق! أوقف التغذية وشغّل كل وسائل التهوية');
    }

    // Analyze Ammonia
    if (!isNaN(ammonia)) {
        const amResult = analyzeParameter('ammonia', ammonia, 'mg/L', 'wqAmmoniaResult');
        if (amResult === 'danger') { overallStatus = 'danger'; issues.push('أمونيا خطيرة!'); }
        else if (amResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (ammonia > 0.02) tips.push('⚠️ قلل التغذية أو غيّر جزء من المياه');
        if (ammonia > 0.05) tips.push('🚨 أوقف التغذية فوراً وغيّر 30% من المياه');
    }

    // Analyze Nitrite
    if (!isNaN(nitrite)) {
        const niResult = analyzeParameter('nitrite', nitrite, 'mg/L', 'wqNitriteResult');
        if (niResult === 'danger') { overallStatus = 'danger'; issues.push('نيتريت مرتفع!'); }
        else if (niResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (nitrite > 0.1) tips.push('🧪 أضف ملح (3 كجم/م³) لتقليل سمية النيتريت');
    }

    // Analyze Nitrate
    if (!isNaN(nitrate)) {
        const naResult = analyzeParameter('nitrate', nitrate, 'mg/L', 'wqNitrateResult');
        if (naResult === 'danger') overallStatus = 'danger';
        else if (naResult === 'warning' && overallStatus !== 'danger') overallStatus = 'warning';

        if (nitrate > 50) tips.push('🧫 غيّر جزء من المياه لتقليل النيترات');
    }

    // Update overall badge
    updateWQBadge(overallStatus);

    // Update tips
    if (tips.length === 0) tips.push('✅ جودة المياه ممتازة، استمر في المراقبة الدورية');
    document.getElementById('wqTips').innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

function analyzeParameter(param, value, unit, elementId) {
    const std = WQ_STANDARDS[param];
    const el = document.getElementById(elementId);
    if (!el) return 'unknown';

    let status = 'safe';
    let statusText = '✅ مثالي';

    if (param === 'temperature' || param === 'ph') {
        if (value >= std.optimal.min && value <= std.optimal.max) {
            status = 'safe'; statusText = '✅ مثالي';
        } else if (value >= std.acceptable.min && value <= std.acceptable.max) {
            status = 'warning'; statusText = '⚠️ مقبول';
        } else {
            status = 'danger'; statusText = '🚨 خطر';
        }
    } else if (param === 'do') {
        if (value >= std.optimal) { status = 'safe'; statusText = '✅ ممتاز'; }
        else if (value >= std.acceptable) { status = 'warning'; statusText = '⚠️ منخفض'; }
        else { status = 'danger'; statusText = '🚨 خطر'; }
    } else {
        if (value <= std.optimal) { status = 'safe'; statusText = '✅ آمن'; }
        else if (value <= std.acceptable) { status = 'warning'; statusText = '⚠️ تحذير'; }
        else { status = 'danger'; statusText = '🚨 خطر'; }
    }

    el.querySelector('.result-value').textContent = value + ' ' + unit;
    el.querySelector('.result-status').textContent = statusText;
    el.querySelector('.result-status').className = 'result-status status-' + status;

    return status;
}

function updateWQBadge(status) {
    const badge = document.getElementById('wqOverallBadge');
    if (!badge) return;

    if (status === 'safe') {
        badge.innerHTML = '<span class="badge-icon">✅</span><span>ممتاز</span>';
        badge.style.background = 'rgba(46, 204, 113, 0.2)';
        badge.style.borderColor = '#2ecc71';
    } else if (status === 'warning') {
        badge.innerHTML = '<span class="badge-icon">⚠️</span><span>يحتاج انتباه</span>';
        badge.style.background = 'rgba(245, 158, 11, 0.2)';
        badge.style.borderColor = '#f59e0b';
    } else {
        badge.innerHTML = '<span class="badge-icon">🚨</span><span>خطر</span>';
        badge.style.background = 'rgba(239, 68, 68, 0.2)';
        badge.style.borderColor = '#ef4444';
    }
}

function clearWaterQualityForm() {
    ['wqTemperature', 'wqPH', 'wqDO', 'wqAmmonia', 'wqNitrite', 'wqNitrate', 'wqSalinity'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    ['wqTempResult', 'wqPHResult', 'wqDOResult', 'wqAmmoniaResult', 'wqNitriteResult', 'wqNitrateResult'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.querySelector('.result-value').textContent = '—';
            el.querySelector('.result-status').textContent = '';
        }
    });

    const badge = document.getElementById('wqOverallBadge');
    if (badge) {
        badge.innerHTML = '<span class="badge-icon">—</span><span>أدخل البيانات</span>';
        badge.style.background = 'rgba(148, 163, 184, 0.2)';
        badge.style.borderColor = '#94a3b8';
    }

    document.getElementById('wqTips').innerHTML = '<li>أدخل قياسات المياه للحصول على توصيات</li>';
}

function toggleWQScience() {
    const content = document.getElementById('wqScienceContent');
    const toggles = document.querySelectorAll('#water-quality-modal .science-toggle');
    if (content) {
        content.classList.toggle('active');
        toggles.forEach(t => t.classList.toggle('active'));
    }
}

// ============================================
// Fish Density Calculator
// ============================================

const DENSITY_DATA = {
    tilapia: {
        name: 'بلطي',
        densities: {
            fry: { earthen: 1000, concrete: 2000, tarpaulin: 1500, tank: 3000, ras: 5000, cage: 1500 },
            fingerling: { earthen: 200, concrete: 500, tarpaulin: 400, tank: 800, ras: 1500, cage: 500 },
            growout: { earthen: 30, concrete: 75, tarpaulin: 60, tank: 100, ras: 150, cage: 50 }
        },
        survivalRate: { fry: 0.7, fingerling: 0.85, growout: 0.9 }
    },
    catfish: {
        name: 'قرموط',
        densities: {
            fry: { earthen: 500, concrete: 1000, tarpaulin: 800, tank: 2000, ras: 5000, cage: 500 },
            fingerling: { earthen: 100, concrete: 200, tarpaulin: 150, tank: 300, ras: 500, cage: 150 },
            growout: { earthen: 50, concrete: 80, tarpaulin: 70, tank: 100, ras: 200, cage: 60 }
        },
        survivalRate: { fry: 0.6, fingerling: 0.8, growout: 0.85 },
        useKgDensity: true,
        kgDensity: { earthen: 50, concrete: 80, tarpaulin: 70, tank: 100, ras: 150, cage: 50 }
    },
    carp: {
        name: 'مبروك',
        densities: {
            fry: { earthen: 500, concrete: 800, tarpaulin: 600, tank: 1000, ras: 2000, cage: 400 },
            fingerling: { earthen: 100, concrete: 200, tarpaulin: 150, tank: 300, ras: 400, cage: 100 },
            growout: { earthen: 20, concrete: 40, tarpaulin: 30, tank: 50, ras: 80, cage: 25 }
        },
        survivalRate: { fry: 0.65, fingerling: 0.8, growout: 0.88 }
    },
    seabass: {
        name: 'قاروص',
        densities: {
            fry: { earthen: 300, concrete: 600, tarpaulin: 500, tank: 1000, ras: 2000, cage: 500 },
            fingerling: { earthen: 80, concrete: 150, tarpaulin: 120, tank: 200, ras: 300, cage: 100 },
            growout: { earthen: 15, concrete: 30, tarpaulin: 25, tank: 40, ras: 60, cage: 20 }
        },
        survivalRate: { fry: 0.6, fingerling: 0.75, growout: 0.85 }
    }
};

const AERATION_FACTOR = { none: 0.5, low: 0.75, medium: 1.0, high: 1.3 };

function calculateDensity() {
    const species = document.getElementById('fdSpecies').value;
    const pondType = document.getElementById('fdPondType').value;
    const stage = document.getElementById('fdStage').value;
    const length = parseFloat(document.getElementById('fdLength').value);
    const width = parseFloat(document.getElementById('fdWidth').value);
    const depth = parseFloat(document.getElementById('fdDepth').value);
    const targetWeight = parseFloat(document.getElementById('fdTargetWeight').value) || 500;
    const aeration = document.getElementById('fdAeration').value;

    if (!length || !width || !depth) {
        alert('الرجاء إدخال أبعاد الحوض');
        return;
    }

    const speciesData = DENSITY_DATA[species];
    const volume = length * width * depth;
    const area = length * width;
    const aerationFactor = AERATION_FACTOR[aeration];

    // Get base density
    const baseDensity = speciesData.densities[stage][pondType] || 50;
    const adjustedDensity = Math.round(baseDensity * aerationFactor);

    // Calculate fish count
    const fishCount = Math.round(adjustedDensity * volume);

    // Calculate expected yield
    const survivalRate = speciesData.survivalRate[stage];
    const survivingFish = Math.round(fishCount * survivalRate);
    const expectedYield = (survivingFish * targetWeight) / 1000; // kg

    // Density in kg/m³
    const densityKg = (expectedYield / volume).toFixed(1);

    // Update results
    document.getElementById('fdVolume').textContent = volume.toFixed(1) + ' م³ (' + area.toFixed(1) + ' م²)';
    document.getElementById('fdFishCount').textContent = formatNumber(fishCount, 0) + ' سمكة';
    document.getElementById('fdDensityKg').textContent = densityKg + ' كجم/م³';
    document.getElementById('fdDensityNum').textContent = adjustedDensity + ' سمكة/م³';
    document.getElementById('fdExpectedYield').textContent = formatNumber(expectedYield, 0) + ' كجم';

    // Update badge
    const badge = document.getElementById('fdBadge');
    badge.innerHTML = '<span class="badge-icon">✅</span><span>توصية</span>';
    badge.style.background = 'rgba(46, 204, 113, 0.2)';
    badge.style.borderColor = '#2ecc71';

    // Update tips
    const tips = [];
    tips.push(`🐟 كثافة موصى بها لـ ${speciesData.name} في حوض ${getPondTypeName(pondType)}`);
    tips.push(`📊 معدل النفوق المتوقع: ${Math.round((1 - survivalRate) * 100)}%`);
    tips.push(`⏱️ سيصل الإنتاج لـ ${formatNumber(expectedYield, 0)} كجم عند وزن ${targetWeight} جم`);

    if (aeration === 'none') tips.push('⚠️ بدون تهوية، الكثافة محدودة جداً');
    if (aeration === 'high') tips.push('✅ التهوية المكثفة تسمح بكثافة أعلى');

    document.getElementById('fdTips').innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

function getPondTypeName(type) {
    const names = { earthen: 'ترابي', concrete: 'خرساني', tarpaulin: 'مشمع', tank: 'تانك', ras: 'RAS', cage: 'قفص' };
    return names[type] || type;
}

function updateDensityDefaults() {
    // Could update hints based on selection
}

function clearDensityForm() {
    ['fdLength', 'fdWidth', 'fdDepth'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    document.getElementById('fdTargetWeight').value = '500';

    ['fdVolume', 'fdFishCount', 'fdDensityKg', 'fdDensityNum', 'fdExpectedYield'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    });

    const badge = document.getElementById('fdBadge');
    if (badge) {
        badge.innerHTML = '<span class="badge-icon">—</span><span>أدخل البيانات</span>';
        badge.style.background = 'rgba(148, 163, 184, 0.2)';
        badge.style.borderColor = '#94a3b8';
    }

    document.getElementById('fdTips').innerHTML = '<li>أدخل أبعاد الحوض للحصول على توصيات</li>';
}

function toggleFDScience() {
    const content = document.getElementById('fdScienceContent');
    const toggles = document.querySelectorAll('#fish-density-modal .science-toggle');
    if (content) {
        content.classList.toggle('active');
        toggles.forEach(t => t.classList.toggle('active'));
    }
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🧮 Fish Farm Smart Tools loaded successfully');

    // Add Enter key support
    const inputs = document.querySelectorAll('.calc-inputs input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateFeed();
        });
    });
});

// ============================================
// MODAL CONTROL FUNCTIONS
// ============================================
function openTool(toolId) {
    const modal = document.getElementById(toolId + '-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('🔓 Opening tool:', toolId);
    } else {
        console.error('❌ Modal not found:', toolId + '-modal');
    }
}

function closeTool() {
    const modals = document.querySelectorAll('.tool-modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
    console.log('🔒 All modals closed');
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTool();
});
