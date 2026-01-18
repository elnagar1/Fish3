// ============================================
// NEW CALCULATORS JAVASCRIPT
// Profit, FCR, Biofloc, Feeding Schedule
// ============================================

// ============================================
// 1. PROFIT CALCULATOR
// ============================================
function calculateProfit() {
    // Get inputs
    const fishCount = parseFloat(document.getElementById('profit-fish-count').value);
    const initialWeight = parseFloat(document.getElementById('profit-initial-weight').value) / 1000; // to kg
    const targetWeight = parseFloat(document.getElementById('profit-target-weight').value) / 1000; // to kg
    const fingerlingPrice = parseFloat(document.getElementById('profit-fingerling-price').value);
    const feedPrice = parseFloat(document.getElementById('profit-feed-price').value) / 1000; // to kg
    const fcr = parseFloat(document.getElementById('profit-fcr').value);
    const electricity = parseFloat(document.getElementById('profit-electricity').value);
    const labor = parseFloat(document.getElementById('profit-labor').value);
    const other = parseFloat(document.getElementById('profit-other').value);
    const months = parseFloat(document.getElementById('profit-months').value);
    const sellingPrice = parseFloat(document.getElementById('profit-selling-price').value);
    const survivalRate = parseFloat(document.getElementById('profit-survival-rate').value) / 100;

    //  Calculations
    const weightGain = targetWeight - initialWeight; // kg per fish
    const totalWeightGain = weightGain * fishCount * survivalRate; // kg
    const feedRequired = totalWeightGain * fcr; // kg

    // Costs
    const fingerlingCost = fishCount * fingerlingPrice;
    const feedCost = feedRequired * feedPrice;
    const electricityCost = electricity * months;
    const laborCost = labor * months;
    const otherCosts = other * months;
    const totalCosts = fingerlingCost + feedCost + electricityCost + laborCost + otherCosts;

    // Revenue
    const finalFishCount = fishCount * survivalRate;
    const totalProduction = finalFishCount * targetWeight; // kg
    const totalRevenue = totalProduction * sellingPrice;

    // Profit
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = (netProfit / totalRevenue) * 100;
    const roi = (netProfit / totalCosts) * 100;
    const profitPerFish = netProfit / finalFishCount;
    const profitPerKg = netProfit / totalProduction;

    // Display results
    const resultsDiv = document.getElementById('profit-results');
    resultsDiv.innerHTML = `
        <div class="results-header">
            <h3>📊 نتائج التحليل المالي</h3>
        </div>

        <div class="result-card ${netProfit > 0 ? 'success' : 'danger'}">
            <div class="result-label">💰 صافي الربح</div>
            <div class="result-value">${netProfit.toFixed(2)} جنيه</div>
            <div class="result-note">${netProfit > 0 ? '✅ مشروع مربح' : '⚠️ مشروع خاسر'}</div>
        </div>

        <div class="results-grid">
            <div class="result-item">
                <div class="result-icon">📈</div>
                <div class="result-label">هامش الربح</div>
                <div class="result-value">${profitMargin.toFixed(1)}%</div>
            </div>

            <div class="result-item">
                <div class="result-icon">💹</div>
                <div class="result-label">العائد على الاستثمار</div>
                <div class="result-value">${roi.toFixed(1)}%</div>
            </div>

            <div class="result-item">
                <div class="result-icon">🐟</div>
                <div class="result-label">الربح لكل سمكة</div>
                <div class="result-value">${profitPerFish.toFixed(2)} جنيه</div>
            </div>

            <div class="result-item">
                <div class="result-icon">⚖️</div>
                <div class="result-label">الربح لكل كجم</div>
                <div class="result-value">${profitPerKg.toFixed(2)} جنيه</div>
            </div>
        </div>

        <div class="results-section">
            <h4>📊 تفاصيل التكاليف</h4>
            <table class="results-table">
                <tr>
                    <td>🐠 زريعة</td>
                    <td>${fingerlingCost.toFixed(2)} جنيه</td>
                    <td>${((fingerlingCost / totalCosts) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>🌾 علف</td>
                    <td>${feedCost.toFixed(2)} جنيه</td>
                    <td>${((feedCost / totalCosts) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>⚡ كهرباء</td>
                    <td>${electricityCost.toFixed(2)} جنيه</td>
                    <td>${((electricityCost / totalCosts) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>👨‍🌾 عمالة</td>
                    <td>${laborCost.toFixed(2)} جنيه</td>
                    <td>${((laborCost / totalCosts) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>🛠️ أخرى</td>
                    <td>${otherCosts.toFixed(2)} جنيه</td>
                    <td>${((otherCosts / totalCosts) * 100).toFixed(1)}%</td>
                </tr>
                <tr class="total-row">
                    <td><strong>إجمالي التكاليف</strong></td>
                    <td><strong>${totalCosts.toFixed(2)} جنيه</strong></td>
                    <td><strong>100%</strong></td>
                </tr>
            </table>
        </div>

        <div class="results-section">
            <h4>💰 ملخص الإنتاج</h4>
            <div class="info-grid">
                <div class="info-item">
                    <span>عدد الأسماك النهائي:</span>
                    <strong>${finalFishCount.toFixed(0)} سمكة</strong>
                </div>
                <div class="info-item">
                    <span>إجمالي الإنتاج:</span>
                    <strong>${totalProduction.toFixed(2)} كجم</strong>
                </div>
                <div class="info-item">
                    <span>إجمالي العلف المطلوب:</span>
                    <strong>${feedRequired.toFixed(2)} كجم</strong>
                </div>
                <div class="info-item">
                    <span>إجمالي الإيرادات:</span>
                    <strong>${totalRevenue.toFixed(2)} جنيه</strong>
                </div>
            </div>
        </div>

        <div class="info-box ${roi > 50 ? 'success' : roi > 20 ? 'info' : 'warning'}">
            <strong>💡 التوصية:</strong>
            <p>${roi > 50 ? 'ممتاز! عائد استثمار مرتفع جداً. مشروع مجدي اقتصادياً.' :
            roi > 20 ? 'جيد. عائد استثمار معقول للمشاريع الزراعية.' :
                roi > 0 ? 'منخفض. قد تحتاج لتحسين الكفاءة أو خفض التكاليف.' :
                    'خاسر. راجع أسعار البيع أو قلل التكاليف.'
        }</p>
        </div>

        <div class="results-section">
            <h4 style="color: #1e3a8a !important; font-weight: 800 !important; font-size: 18px !important; margin-bottom: 15px !important;">📚 الأساس العلمي للحساب</h4>
            <div class="info-box info">
                <ul style="list-style-type: disc !important; padding-right: 20px !important;">
                    <li><strong>صافي الربح:</strong> الإيرادات الكلية - التكاليف الكلية (تشمل الأعلاف، الزريعة، والتشغيل).</li>
                    <li><strong>ROI (العائد على الاستثمار):</strong> (صافي الربح / التكاليف الكلية) × 100. يعتبر المؤشر الأهم لجدوى المشروع.</li>
                    <li><strong>هامش الربح:</strong> (صافي الربح / الإيرادات الكلية) × 100. يوضح نسبة الربح من كل جنيه مبيعات.</li>
                    <li>تم اعتماد متوسط معدلات نفوق 5-10% وتكاليف تشغيلية تقديرية بناءً على دراسات الجدوى الاقتصادية للمزارع السمكية المصرية.</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// 2. FCR CALCULATOR
// ============================================
function calculateFCR() {
    const initialWeight = parseFloat(document.getElementById('fcr-initial-weight').value);
    const finalWeight = parseFloat(document.getElementById('fcr-final-weight').value);
    const feedUsed = parseFloat(document.getElementById('fcr-feed-used').value);
    const mortalityWeight = parseFloat(document.getElementById('fcr-mortality-weight').value) || 0;

    // Calculations
    const actualWeightGain = finalWeight - initialWeight;
    const adjustedWeightGain = actualWeightGain - mortalityWeight;
    const fcr = feedUsed / adjustedWeightGain;

    // FCR Rating
    let rating, ratingClass, recommendation;
    if (fcr < 1.2) {
        rating = "ممتاز";
        ratingClass = "success";
        recommendation = "كفاءة عالية جداً! استمر على نفس النظام الغذائي.";
    } else if (fcr < 1.5) {
        rating = "جيد جداً";
        ratingClass = "success";
        recommendation = "أداء جيد. يمكن تحسينه بتحسين جودة العلف.";
    } else if (fcr < 1.75) {
        rating = "جيد";
        ratingClass = "info";
        recommendation = "مقبول. راجع جودة العلف ومواعيد التغذية.";
    } else if (fcr < 2.0) {
        rating = "متوسط";
        ratingClass = "warning";
        recommendation = "يحتاج تحسين. تحقق من نوع العلف ودرجة حرارة الماء.";
    } else {
        rating = "ضعيف";
        ratingClass = "danger";
        recommendation = "يحتاج تحسين جذري. راجع جودة العلف والإدارة.";
    }

    const resultsDiv = document.getElementById('fcr-results');
    resultsDiv.innerHTML = `
        <div class="results-header">
            <h3>📊 نتائج FCR</h3>
        </div>

        <div class="result-card ${ratingClass}">
            <div class="result-label">📊 FCR النهائي</div>
            <div class="result-value">${fcr.toFixed(3)}</div>
            <div class="result-note">${rating}</div>
        </div>

        <div class="results-grid">
            <div class="result-item">
                <div class="result-icon">📈</div>
                <div class="result-label">الوزن المكتسب</div>
                <div class="result-value">${adjustedWeightGain.toFixed(2)} كجم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">🌾</div>
                <div class="result-label">العلف المستخدم</div>
                <div class="result-value">${feedUsed.toFixed(2)} كجم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">💰</div>
                <div class="result-label">علف لكل كجم سمك</div>
                <div class="result-value">${fcr.toFixed(2)} كجم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">⭐</div>
                <div class="result-label">التقييم</div>
                <div class="result-value">${rating}</div>
            </div>
        </div>

        <div class="results-section">
            <h4>📊 معايير FCR القياسية</h4>
            <table class="results-table">
                <thead>
                    <tr>
                        <th>التقييم</th>
                        <th>FCR Range</th>
                        <th>كفاءة العلف</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="${fcr < 1.2 ? 'highlight' : ''}">
                        <td>🟢 ممتاز</td>
                        <td>1.0 - 1.2</td>
                        <td>عالية جداً</td>
                    </tr>
                    <tr class="${fcr >= 1.2 && fcr < 1.5 ? 'highlight' : ''}">
                        <td>🟢 جيد جداً</td>
                        <td>1.2 - 1.5</td>
                        <td>عالية</td>
                    </tr>
                    <tr class="${fcr >= 1.5 && fcr < 1.75 ? 'highlight' : ''}">
                        <td>🟡 جيد</td>
                        <td>1.5 - 1.75</td>
                        <td>متوسطة</td>
                    </tr>
                    <tr class="${fcr >= 1.75 && fcr < 2.0 ? 'highlight' : ''}">
                        <td>🟠 متوسط</td>
                        <td>1.75 - 2.0</td>
                        <td>منخفضة</td>
                    </tr>
                    <tr class="${fcr >= 2.0 ? 'highlight' : ''}">
                        <td>🔴 ضعيف</td>
                        <td>> 2.0</td>
                        <td>ضعيفة</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box ${ratingClass}">
            <strong>💡 التوصية:</strong>
            <p>${recommendation}</p>
        </div>

        <div class="info-box info">
            <strong>📚 نصائح لتحسين FCR:</strong>
            <ul>
                <li>استخدم علف عالي الجودة (بروتين 30%+)</li>
                <li>حافظ على درجة حرارة الماء 26-30°C</li>
                <li>غذّي عدة وجبات صغيرة بدلاً من وجبة واحدة</li>
                <li>راقب جودة المياه باستمرار</li>
                <li>تجنب الإفراط في التغذية</li>
            </ul>
        </div>

        <div class="results-section">
            <h4 style="color: #1e3a8a !important; font-weight: 800 !important; font-size: 18px !important; margin-bottom: 15px !important;">📚 الأساس العلمي (المعادلة)</h4>
            <div class="info-box info">
                <p><strong>معادلة معامل التحويل الغذائي (FCR):</strong></p>
                <code style="display: block; background: #e2e8f0; padding: 10px; border-radius: 5px; margin: 10px 0; font-weight: bold; text-align: center;">FCR = كمية العلف المستهلكة (كجم) / الزيادة الوزنية للأسماك (كجم)</code>
                <ul style="list-style-type: disc !important; padding-right: 20px !important;">
                    <li>كلما انخفضت القيمة، زادت كفاءة تحويل العلف إلى لحم.</li>
                    <li>المعدل المثالي للبلطي المستزرع عالمياً يتراوح بين 1.2 إلى 1.5.</li>
                    <li>يتم خصم وزن الوفيات (Mortality) للحصول على حساب دقيق للكفاءة الحقيقية.</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// 3. BIOFLOC CALCULATOR
// ============================================
function calculateBiofloc() {
    const volume = parseFloat(document.getElementById('biofloc-volume').value);
    const ammonia = parseFloat(document.getElementById('biofloc-ammonia').value);
    const cnRatio = parseFloat(document.getElementById('biofloc-cn-ratio').value);
    const carbonSource = document.getElementById('biofloc-carbon-source').value;

    // Carbon percentage in each source
    const carbonPercentage = {
        'sugar': 1.0,     // 100%
        'molasses': 0.5,  // 50%
        'tapioca': 0.65   // 65%
    };

    // Calculations
    // TAN (mg/L) to grams of nitrogen in the system
    const nitrogenGrams = (ammonia * volume) / 1000;

    // Required carbon in grams
    const carbonRequired = nitrogenGrams * cnRatio;

    // Amount of carbon source needed
    const sourceRequired = carbonRequired / carbonPercentage[carbonSource];

    // Source names in Arabic
    const sourceNames = {
        'sugar': 'سكر',
        'molasses': 'دبس',
        'tapioca': 'دقيق تابيوكا'
    };

    const resultsDiv = document.getElementById('biofloc-results');
    resultsDiv.innerHTML = `
        <div class="results-header">
            <h3>🦠 نتائج حساب البايوفلوك</h3>
        </div>

        <div class="result-card success">
            <div class="result-label">🍬 كمية ${sourceNames[carbonSource]} المطلوبة</div>
            <div class="result-value">${sourceRequired.toFixed(2)} جرام</div>
            <div class="result-note">${(sourceRequired / 1000).toFixed(3)} كجم</div>
        </div>

        <div class="results-grid">
            <div class="result-item">
                <div class="result-icon">⚖️</div>
                <div class="result-label">C:N Ratio المستهدف</div>
                <div class="result-value">${cnRatio}:1</div>
            </div>

            <div class="result-item">
                <div class="result-icon">☠️</div>
                <div class="result-label">الأمونيا الحالية</div>
                <div class="result-value">${ammonia} ppm</div>
            </div>

            <div class="result-item">
                <div class="result-icon">🏊</div>
                <div class="result-label">حجم الماء</div>
                <div class="result-value">${volume.toLocaleString()} لتر</div>
            </div>

            <div class="result-item">
                <div class="result-icon">🧪</div>
                <div class="result-label">النيتروجين الكلي</div>
                <div class="result-value">${nitrogenGrams.toFixed(2)} جرام</div>
            </div>
        </div>

        <div class="results-section" style="background: #0f172a !important; padding: 25px !important; border-radius: 15px !important; margin-top: 20px !important; box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;">
            <h4 style="color: #ffffff !important; font-weight: 800 !important; font-size: 20px !important; margin-bottom: 20px !important; border-bottom: 1px solid rgba(255,255,255,0.2) !important; padding-bottom: 15px !important;">📋 خطوات التطبيق</h4>
            <ol class="steps-list" style="color: #ffffff !important; opacity: 1 !important; margin: 0 !important;">
                <li style="margin-bottom: 20px !important; color: #ffffff !important;">
                    <strong style="color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; display: block !important; margin-bottom: 5px !important;">1. قس مستوى الأمونيا (TAN)</strong>
                    <p style="color: #e2e8f0 !important; font-weight: 500 !important; font-size: 14px !important; margin: 0 !important; line-height: 1.6 !important;">استخدم kit الفحص للتأكد من مستوى الأمونيا الدقيق</p>
                </li>
                <li style="margin-bottom: 20px !important; color: #ffffff !important;">
                    <strong style="color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; display: block !important; margin-bottom: 5px !important;">2. أحضر ${sourceRequired.toFixed(0)} جرام ${sourceNames[carbonSource]}</strong>
                    <p style="color: #e2e8f0 !important; font-weight: 500 !important; font-size: 14px !important; margin: 0 !important; line-height: 1.6 !important;">اذب الكمية في 1-2 لتر ماء دافئ</p>
                </li>
                <li style="margin-bottom: 20px !important; color: #ffffff !important;">
                    <strong style="color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; display: block !important; margin-bottom: 5px !important;">3. أضف المحلول تدريجياً</strong>
                    <p style="color: #e2e8f0 !important; font-weight: 500 !important; font-size: 14px !important; margin: 0 !important; line-height: 1.6 !important;">وزع المحلول على كامل الحوض بالتساوي</p>
                </li>
                <li style="margin-bottom: 20px !important; color: #ffffff !important;">
                    <strong style="color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; display: block !important; margin-bottom: 5px !important;">4. شغّل التهوية بقوة</strong>
                    <p style="color: #e2e8f0 !important; font-weight: 500 !important; font-size: 14px !important; margin: 0 !important; line-height: 1.6 !important;">الأكسجين ضروري جداً (7-8 ppm)</p>
                </li>
                <li style="margin-bottom: 0 !important; color: #ffffff !important;">
                    <strong style="color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; display: block !important; margin-bottom: 5px !important;">5. راقب اللون</strong>
                    <p style="color: #e2e8f0 !important; font-weight: 500 !important; font-size: 14px !important; margin: 0 !important; line-height: 1.6 !important;">يجب أن يتحول الماء للون البني الفاتح خلال 3-5 أيام</p>
                </li>
            </ol>
        </div>

        <div class="results-section">
            <h4>⚖️ مقارنة مصادر الكربون</h4>
            <table class="results-table">
                <thead>
                    <tr>
                        <th>المصدر</th>
                        <th>نسبة الكربون</th>
                        <th>الكمية المطلوبة</th>
                        <th>السعر التقريبي</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="${carbonSource === 'sugar' ? 'highlight' : ''}">
                        <td>سكر</td>
                        <td>100%</td>
                        <td>${carbonRequired.toFixed(0)} جرام</td>
                        <td>~${(carbonRequired * 0.015).toFixed(1)} جنيه</td>
                    </tr>
                    <tr class="${carbonSource === 'molasses' ? 'highlight' : ''}">
                        <td>دبس</td>
                        <td>50%</td>
                        <td>${(carbonRequired / 0.5).toFixed(0)} جرام</td>
                        <td>~${(carbonRequired / 0.5 * 0.005).toFixed(1)} جنيه</td>
                    </tr>
                    <tr class="${carbonSource === 'tapioca' ? 'highlight' : ''}">
                        <td>دقيق تابيوكا</td>
                        <td>65%</td>
                        <td>${(carbonRequired / 0.65).toFixed(0)} جرام</td>
                        <td>~${(carbonRequired / 0.65 * 0.008).toFixed(1)} جنيه</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box warning">
            <strong>⚠️ ملاحظات مهمة:</strong>
            <ul>
                <li>تأكد من مستوى الأكسجين (7-8 ppm) قبل وبعد الإضافة</li>
                <li>ابدأ بـ 50% من الكمية أول مرة ثم راقب النتائج</li>
                <li>افحص الأمونيا يومياً خلال أول أسبوع</li>
                <li>حافظ على pH بين 7-8.5</li>
                <li>قلّب الماء جيداً بعد الإضافة</li>
            </ul>
        </div>

        <div class="info-box success">
            <strong>✅ فوائد البايوفلوك:</strong>
            <ul>
                <li>توفير 90% من المياه (لا حاجة للتغيير)</li>
                <li>تحويل الأمونيا الضارة لبروتين نافع</li>
                <li>توفير 20-30% من تكلفة العلف</li>
                <li>زيادة النمو ومناعة الأسماك</li>
                <li>صديق للبيئة ومستدام</li>
            </ul>
        </div>

        <div class="results-section">
            <h4 style="color: #1e3a8a !important; font-weight: 800 !important; font-size: 18px !important; margin-bottom: 15px !important;">📚 المعادلة العلمية (Avnimelech Equation)</h4>
            <div class="info-box info">
                <p>تعتمد الحسابات على معادلة البروفيسور <strong>Yoram Avnimelech</strong> لمعالجة الأمونيا:</p>
                <code style="display: block; background: #e2e8f0; padding: 10px; border-radius: 5px; margin: 10px 0; font-weight: bold; text-align: center;">ΔCH = ΔN × Ratio</code>
                <ul style="list-style-type: disc !important; padding-right: 20px !important;">
                    <li>حيث ΔN هو كمية النيتروجين المطلوب إزالتها (مشتقة من الأمونيا TAN).</li>
                    <li>نسبة C:N المثالية هي 15:1 أو 20:1 لنمو البكتيريا غيرية التغذية (Heterotrophic Bacteria).</li>
                    <li>يختلف محتوى الكربون باختلاف المصدر (السكر ~100%، الدبس ~50%).</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// 4. FEEDING SCHEDULE CALCULATOR
// ============================================
function calculateFeedingSchedule() {
    const fishType = document.getElementById('feeding-fish-type').value;
    const fishCount = parseFloat(document.getElementById('feeding-fish-count').value);
    const avgWeight = parseFloat(document.getElementById('feeding-avg-weight').value);
    const waterTemp = parseFloat(document.getElementById('feeding-water-temp').value);

    // Fish feeding data
    const fishData = {
        'tilapia': {
            name: 'البلطي',
            ranges: [
                { minWeight: 0, maxWeight: 5, rate: 10, protein: 40, meals: 6 },
                { minWeight: 5, maxWeight: 20, rate: 7, protein: 35, meals: 4 },
                { minWeight: 20, maxWeight: 50, rate: 5, protein: 32, meals: 3 },
                { minWeight: 50, maxWeight: 150, rate: 4, protein: 30, meals: 3 },
                { minWeight: 150, maxWeight: 350, rate: 3, protein: 28, meals: 2 },
                { minWeight: 350, maxWeight: 1000, rate: 2, protein: 25, meals: 2 }
            ]
        },
        'catfish': {
            name: 'القرموط',
            ranges: [
                { minWeight: 0, maxWeight: 10, rate: 8, protein: 42, meals: 5 },
                { minWeight: 10, maxWeight: 50, rate: 6, protein: 38, meals: 4 },
                { minWeight: 50, maxWeight: 150, rate: 4, protein: 35, meals: 3 },
                { minWeight: 150, maxWeight: 500, rate: 3, protein: 32, meals: 2 },
                { minWeight: 500, maxWeight: 1000, rate: 2.5, protein: 30, meals: 2 }
            ]
        },
        'bass': {
            name: 'القاروص',
            ranges: [
                { minWeight: 0, maxWeight: 5, rate: 12, protein: 48, meals: 6 },
                { minWeight: 5, maxWeight: 20, rate: 8, protein: 45, meals: 5 },
                { minWeight: 20, maxWeight: 100, rate: 5, protein: 42, meals: 4 },
                { minWeight: 100, maxWeight: 300, rate: 3.5, protein: 40, meals: 3 },
                { minWeight: 300, maxWeight: 1000, rate: 2.5, protein: 38, meals: 2 }
            ]
        },
        'mullet': {
            name: 'البوري',
            ranges: [
                { minWeight: 0, maxWeight: 10, rate: 6, protein: 30, meals: 4 },
                { minWeight: 10, maxWeight: 50, rate: 4, protein: 28, meals: 3 },
                { minWeight: 50, maxWeight: 150, rate: 3, protein: 25, meals: 2 },
                { minWeight: 150, maxWeight: 1000, rate: 2, protein: 22, meals: 2 }
            ]
        },
        'carp': {
            name: 'المبروك',
            ranges: [
                { minWeight: 0, maxWeight: 10, rate: 7, protein: 32, meals: 4 },
                { minWeight: 10, maxWeight: 50, rate: 5, protein: 30, meals: 3 },
                { minWeight: 50, maxWeight: 200, rate: 3.5, protein: 28, meals: 3 },
                { minWeight: 200, maxWeight: 1000, rate: 2.5, protein: 25, meals: 2 }
            ]
        }
    };

    const fish = fishData[fishType];
    const range = fish.ranges.find(r => avgWeight >= r.minWeight && avgWeight < r.maxWeight) || fish.ranges[fish.ranges.length - 1];

    // Temperature adjustment
    let tempAdjustment = 1.0;
    if (waterTemp < 20) tempAdjustment = 0.5;
    else if (waterTemp < 24) tempAdjustment = 0.75;
    else if (waterTemp < 26) tempAdjustment = 0.9;
    else if (waterTemp > 32) tempAdjustment = 0.8;

    // Calculations
    const totalBiomass = (fishCount * avgWeight) / 1000; // kg
    const dailyFeed = (totalBiomass * range.rate / 100) * tempAdjustment; // kg/day
    const feedPerMeal = dailyFeed / range.meals; // kg/meal
    const feedPerFish = (dailyFeed / fishCount) * 1000; // grams/fish/day

    // Feeding times
    const feedingTimes = {
        2: ['8:00 صباحاً', '5:00 مساءً'],
        3: ['7:00 صباحاً', '12:00 ظهراً', '6:00 مساءً'],
        4: ['7:00 صباحاً', '11:00 صباحاً', '3:00 عصراً', '7:00 مساءً'],
        5: ['7:00 صباحاً', '10:00 صباحاً', '1:00 ظهراً', '4:00 عصراً', '7:00 مساءً'],
        6: ['6:00 صباحاً', '9:00 صباحاً', '12:00 ظهراً', '3:00 عصراً', '6:00 مساءً', '9:00 مساءً']
    };

    const resultsDiv = document.getElementById('feeding-results');
    resultsDiv.innerHTML = `
        <div class="results-header">
            <h3>📅 جدول التغذية لـ${fish.name}</h3>
        </div>

        <div class="result-card info">
            <div class="result-label">🌾 كمية العلف اليومية</div>
            <div class="result-value">${dailyFeed.toFixed(2)} كجم/يوم</div>
            <div class="result-note">${(dailyFeed * 30).toFixed(1)} كجم/شهر</div>
        </div>

        <div class="results-grid">
            <div class="result-item">
                <div class="result-icon">🍽️</div>
                <div class="result-label">عدد الوجبات</div>
                <div class="result-value">${range.meals} وجبات/يوم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">⚖️</div>
                <div class="result-label">كمية كل وجبة</div>
                <div class="result-value">${feedPerMeal.toFixed(2)} كجم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">🐟</div>
                <div class="result-label">علف لكل سمكة</div>
                <div class="result-value">${feedPerFish.toFixed(2)} جرام/يوم</div>
            </div>

            <div class="result-item">
                <div class="result-icon">💪</div>
                <div class="result-label">البروتين المطلوب</div>
                <div class="result-value">${range.protein}%</div>
            </div>
        </div>

        <div class="results-section">
            <h4>⏰ مواعيد التغذية الموصى بها</h4>
            <div class="feeding-schedule">
                ${feedingTimes[range.meals].map((time, index) => `
                    <div class="schedule-item">
                        <div class="schedule-time">${time}</div>
                        <div class="schedule-amount">${feedPerMeal.toFixed(2)} كجم</div>
                        <div class="schedule-meal">الوجبة ${index + 1}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="results-section">
            <h4>📊 التكلفة المتوقعة (بسعر متوسط 12 جنيه/كجم)</h4>
            <table class="results-table">
                <tr>
                    <td>التكلفة اليومية</td>
                    <td>${(dailyFeed * 12).toFixed(2)} جنيه</td>
                </tr>
                <tr>
                    <td>التكلفة الأسبوعية</td>
                    <td>${(dailyFeed * 12 * 7).toFixed(2)} جنيه</td>
                </tr>
                <tr>
                    <td>التكلفة الشهرية</td>
                    <td>${(dailyFeed * 12 * 30).toFixed(2)} جنيه</td>
                </tr>
            </table>
        </div>

        <div class="info-box ${waterTemp >= 26 && waterTemp <= 30 ? 'success' : 'warning'}">
            <strong>🌡️ تأثير درجة الحرارة (${waterTemp}°C):</strong>
            <p>${waterTemp < 20 ? 'باردة جداً - قلل العلف 50%' :
            waterTemp < 24 ? 'باردة - قلل العلف 25%' :
                waterTemp < 26 ? 'مقبولة - قلل العلف 10%' :
                    waterTemp <= 30 ? 'مثالية - معدل طبيعي' :
                        waterTemp <= 32 ? 'دافئة - قلل العلف 10%' :
                            'حارة جداً - قلل العلف 20% وزد التهوية'
        }</p>
        </div>

        <div class="info-box info">
            <strong>💡 نصائح التغذية:</strong>
            <ul>
                <li>راقب سلوك الأسماك - توقف عن التغذية عندما تبطئ الأكل</li>
                <li>لا تفرط في التغذية - يسبب تلوث المياه</li>
                <li>وزّع العلف بالتساوي على كامل الحوض</li>
                <li>امنح الأسماك 15-20 دقيقة للأكل</li>
                <li>قلل العلف في الأيام العليلة أو عند المعالجة</li>
            </ul>
        </div>

        <div class="results-section">
            <h4 style="color: #1e3a8a !important; font-weight: 800 !important; font-size: 18px !important; margin-bottom: 15px !important;">📚 الأساس العلمي (Food Tables)</h4>
            <div class="info-box info">
                <ul style="list-style-type: disc !important; padding-right: 20px !important;">
                    <li><strong>جداول التغذية:</strong> مستمدة من جداول مركز البحوث الزراعية (مصر) ومنظمة الفاو (FAO - 2023) لتغذية أسماك المياه الدافئة.</li>
                    <li><strong>تأثير الحرارة:</strong> معدل الأيض (Metabolism) للأسماك يقل ببرودة المياه ويزيد بحرارتها، مما يتطلب تعديل كميات العلف.</li>
                    <li><strong>نسبة البروتين:</strong> الأسماك الصغيرة تحتاج بروتين أعلى للنمو السريع، بينما الكبيرة تحتاج طاقة أكثر.</li>
                </ul>
            </div>
        </div>
    `;
}

console.log('✅ New Calculators Loaded: Profit, FCR, Biofloc, Feeding Schedule');
