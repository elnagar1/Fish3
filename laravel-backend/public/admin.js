// ============================================
// Admin Panel - Main Logic
// ============================================

class AdminPanel {
    constructor() {
        this.articles = [];
        this.siteContent = {};
        this.teamMembers = [];
        this.init();
    }

    async init() {
        this.initQuill();
        this.bindEvents();
        await this.loadDashboard();
        await this.loadArticles();
        await this.loadSiteContent();
        await this.loadQuestions();
        await this.loadQuestions();
        await this.loadTeam();
        await this.loadCategories();
        await this.loadToolsSettings();
    }


    initQuill() {
        this.quill = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'اكتب محتوى المقال هنا... استخدم شريط الأدوات للتنسيق',
            modules: {
                toolbar: [
                    // Headers
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    // Font & Size
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],

                    // Text Formatting
                    ['bold', 'italic', 'underline', 'strike'],

                    // Colors
                    [{ 'color': [] }, { 'background': [] }],

                    // Scripts
                    [{ 'script': 'sub' }, { 'script': 'super' }],

                    // Lists
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],

                    // Alignment & Direction
                    [{ 'align': [] }],
                    [{ 'direction': 'rtl' }],

                    // Blocks
                    ['blockquote', 'code-block'],

                    // Media
                    ['link', 'image', 'video'],

                    // Clean
                    ['clean']
                ]
            }
        });

        // Fix for RTL alignment by default
        this.quill.format('direction', 'rtl');
        this.quill.format('align', 'right');

        // Add custom styles for better readability
        const editorElement = document.querySelector('#editor-container .ql-editor');
        if (editorElement) {
            editorElement.style.fontSize = '16px';
            editorElement.style.lineHeight = '1.8';
            editorElement.style.minHeight = '350px';
        }

        // Initialize English Editor
        this.quillEn = new Quill('#editor-container-en', {
            theme: 'snow',
            placeholder: 'Write article content here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            }
        });

        // Default LTR for English
        this.quillEn.format('direction', 'ltr');
        this.quillEn.format('align', 'left');
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Article Management
        document.getElementById('addArticleBtn').addEventListener('click', () => this.openArticleModal());
        document.getElementById('closeArticleModal').addEventListener('click', () => this.closeArticleModal());
        document.getElementById('cancelArticleBtn').addEventListener('click', () => this.closeArticleModal());
        document.getElementById('articleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveArticle();
        });

        // Question Management
        document.getElementById('closeQuestionModal').addEventListener('click', () => this.closeQuestionModal());
        document.getElementById('cancelQuestionBtn').addEventListener('click', () => this.closeQuestionModal());
        document.getElementById('questionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuestion();
        });
        document.getElementById('addOptionBtn').addEventListener('click', () => this.addOptionInput());

        // Content Management
        document.getElementById('saveContentBtn').addEventListener('click', () => this.saveContent());

        // AI Settings
        document.getElementById('saveAISettingsBtn').addEventListener('click', () => this.saveAISettings());

        // Navbar Settings
        document.getElementById('saveNavSettingsBtn').addEventListener('click', () => this.saveNavSettings());

        // Sections Settings
        document.getElementById('saveSectionsSettingsBtn').addEventListener('click', () => this.saveSectionsSettings());

        // Data Management
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });
        document.getElementById('importFileInput').addEventListener('change', (e) => this.importData(e));

        // Image Upload
        document.getElementById('articleImage').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('removeImageBtn').addEventListener('click', () => this.removeImage());

        // Team Member Management
        document.getElementById('addTeamMemberBtn').addEventListener('click', () => this.openTeamMemberModal());
        document.getElementById('closeTeamMemberModal').addEventListener('click', () => this.closeTeamMemberModal());
        document.getElementById('cancelTeamMemberBtn').addEventListener('click', () => this.closeTeamMemberModal());
        document.getElementById('teamMemberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTeamMember();
        });
        document.getElementById('memberImage').addEventListener('change', (e) => this.handleMemberImageUpload(e));
        document.getElementById('removeMemberImageBtn').addEventListener('click', () => this.removeMemberImage());

        // Modal overlay
        document.querySelector('.modal-overlay').addEventListener('click', () => {
            this.closeArticleModal();
            this.closeQuestionModal();
            this.closeTeamMemberModal();
        });

        // Category Management
        const addCategoryBtn = document.getElementById('addNewCategoryBtn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => this.addCategory());
        }

        // Tools Settings
        const saveToolsBtn = document.getElementById('saveToolsBtn');
        if (saveToolsBtn) {
            saveToolsBtn.addEventListener('click', () => this.saveToolsSettings());
        }

        // Logo Upload
        const uploadLogoBtn = document.getElementById('uploadLogoBtn');
        if (uploadLogoBtn) {
            uploadLogoBtn.addEventListener('click', () => this.uploadLogo());
        }
    }

    // ... (rest of methods)

    // ============ Questions Management ============
    async loadQuestions() {
        const container = document.getElementById('questionsList');
        container.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';

        try {
            this.questions = await API.getQuestions({ mode: 'admin' });
            container.innerHTML = '';

            if (this.questions.length === 0) {
                container.innerHTML = '<p style="text-align: center;">لا توجد أسئلة.</p>';
                return;
            }

            this.questions.forEach(q => {
                const item = document.createElement('div');
                item.className = 'question-item';
                item.style.cssText = 'background: white; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05);';

                const optionsHtml = q.options.map(o =>
                    `<span class="badge" style="background: #eee; padding: 2px 8px; border-radius: 4px; margin: 0 2px; font-size: 0.85rem;">${o.option_icon || ''} ${o.option_label}</span>`
                ).join('');

                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="margin: 0 0 5px 0;">السؤال ${q.question_number}: ${q.question_text}</h4>
                            <div style="margin-top: 5px;">${optionsHtml}</div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="adminPanel.editQuestion(${q.id})">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                    </div>
                `;
                container.appendChild(item);
            });

            // Update stats
            const questionsCountEl = document.querySelector('.stat-card:nth-child(2) h3');
            if (questionsCountEl) questionsCountEl.textContent = this.questions.length;

        } catch (error) {
            console.error('Error loading questions:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--admin-danger);">حدث خطأ في تحميل الأسئلة</p>';
        }
    }

    editQuestion(id) {
        const question = this.questions.find(q => q.id === id);
        if (question) {
            this.openQuestionModal(question);
        }
    }

    openQuestionModal(question) {
        document.getElementById('questionId').value = question.id;
        document.getElementById('questionText').value = question.question_text;
        document.getElementById('questionText_en').value = question.question_text_en || '';

        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = '';

        question.options.forEach(opt => {
            this.addOptionInput(opt);
        });

        document.getElementById('questionModal').classList.add('active');
    }

    closeQuestionModal() {
        document.getElementById('questionModal').classList.remove('active');
    }

    addOptionInput(opt = null) {
        const container = document.getElementById('optionsList');
        const div = document.createElement('div');
        div.className = 'option-row';
        div.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';

        div.innerHTML = `
            <div style="flex: 2; display: flex; flex-direction: column; gap: 5px;">
                <input type="text" class="form-control option-label" placeholder="عربي" value="${opt ? opt.option_label : ''}">
                <input type="text" class="form-control option-label-en" placeholder="English" value="${opt ? (opt.option_label_en || '') : ''}">
            </div>
            <input type="text" class="form-control option-value" placeholder="القيمة" value="${opt ? opt.option_value : ''}" style="flex: 1">
            <input type="text" class="form-control option-icon" placeholder="أيقونة" value="${opt ? opt.option_icon : ''}" style="width: 60px; text-align: center;">
            <button type="button" class="btn btn-danger btn-sm remove-option-btn"><i class="fas fa-times"></i></button>
        `;

        div.querySelector('.remove-option-btn').addEventListener('click', () => div.remove());
        container.appendChild(div);
    }

    async saveQuestion() {
        const id = document.getElementById('questionId').value;
        const text = document.getElementById('questionText').value;
        const textEn = document.getElementById('questionText_en').value;

        const options = [];
        document.querySelectorAll('#optionsList .option-row').forEach(row => {
            options.push({
                option_label: row.querySelector('.option-label').value,
                option_label_en: row.querySelector('.option-label-en').value,
                option_value: row.querySelector('.option-value').value,
                option_icon: row.querySelector('.option-icon').value
            });
        });

        try {
            await API.updateQuestion(id, {
                question_text: text,
                question_text_en: textEn,
                options: options
            });

            this.showToast('تم تحديث السؤال بنجاح', 'success');
            this.closeQuestionModal();
            this.loadQuestions();
        } catch (error) {
            console.error('Error saving question:', error);
            this.showToast('حدث خطأ في حفظ السؤال', 'error');
        }
    }

    showSection(sectionName) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update title
        const titles = {
            dashboard: 'الرئيسية',
            articles: 'إدارة المقالات',
            content: 'تعديل المحتوى',
            questions: 'إدارة الأسئلة',
            categories: 'إدارة التصنيفات',
            team: 'إدارة الفريق',
            tools: 'إدارة الأدوات',
            settings: 'الإعدادات'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
    }

    // ============ Dashboard ============
    async loadDashboard() {
        try {
            const stats = await API.getStats();
            document.getElementById('articlesCount').textContent = stats.articlesCount || 0;

            // Update other stats if elements exist
            const consultationsEl = document.querySelector('.stat-card:nth-child(2) h3');
            if (consultationsEl) consultationsEl.textContent = stats.consultationsCount || 0;

            const todayEl = document.querySelector('.stat-card:nth-child(3) h3');
            if (todayEl) todayEl.textContent = stats.todayConsultations || 0;
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    // ============ Articles Management ============
    async loadArticles() {
        const container = document.getElementById('articlesList');
        container.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';

        try {
            // Load all articles using admin mode to get both languages
            this.articles = await API.getArticles({ mode: 'admin' });
            container.innerHTML = '';

            // ... (rest of function as is)

            if (this.articles.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--admin-text-light);">لا توجد مقالات. اضغط "إضافة مقال جديد" للبدء.</p>';
                return;
            }

            this.articles.forEach(article => {
                const item = document.createElement('div');
                item.className = 'article-item';
                item.innerHTML = `
                    <div class="article-info">
                        <h3>${article.icon || '📄'} ${article.title}</h3>
                        <div class="article-meta">
                            <span><i class="fas fa-tag"></i> ${article.category}</span>
                            <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                        </div>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminPanel.editArticle(${article.id})">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteArticle(${article.id})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading articles:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--admin-danger);">حدث خطأ في تحميل المقالات</p>';
        }
    }

    openArticleModal(article = null) {
        // Populate Categories Dropdown
        const select = document.getElementById('articleCategorySelect');
        if (select) {
            select.innerHTML = '<option value="">اختر التصنيف...</option>';
            if (this.categories) {
                this.categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = `${cat.name} ${cat.name_en ? '/ ' + cat.name_en : ''}`;
                    option.dataset.name = cat.name;
                    option.dataset.nameEn = cat.name_en || '';
                    select.appendChild(option);
                });
            }
        }

        if (article) {
            document.getElementById('articleModalTitle').textContent = 'تعديل المقال';
            document.getElementById('articleId').value = article.id;
            document.getElementById('articleTitle').value = article.title;
            document.getElementById('articleTitle_en').value = article.title_en || '';

            // Select Category
            // Try to find matching category by name
            if (this.categories) {
                const match = this.categories.find(c => c.name === article.category);
                if (match) select.value = match.id;
            }

            document.getElementById('articleIcon').value = article.icon || '';
            document.getElementById('articleDate').value = article.date;
            document.getElementById('articleSummary').value = article.summary;
            document.getElementById('articleSummary_en').value = article.summary_en || '';
            // document.getElementById('articleContent').value = article.content; // Old Textarea
            this.quill.root.innerHTML = article.content; // Quill
            this.quillEn.root.innerHTML = article.content_en || ''; // Quill English

            // Load image if exists
            if (article.image_url) {
                document.getElementById('articleImageData').value = article.image_url;
                document.getElementById('previewImg').src = article.image_url;
                document.getElementById('imagePreview').style.display = 'block';
            } else {
                this.removeImage();
            }
        } else {
            document.getElementById('articleModalTitle').textContent = 'إضافة مقال جديد';
            document.getElementById('articleForm').reset();
            document.getElementById('articleId').value = '';
            document.getElementById('articleDate').value = new Date().toISOString().split('T')[0];
            this.quill.root.innerHTML = ''; // Clear Quill
            this.quillEn.root.innerHTML = ''; // Clear Quill English
            this.quill.format('direction', 'rtl');
            this.quill.format('align', 'right');
            this.quillEn.format('direction', 'ltr');
            this.quillEn.format('align', 'left');
            this.removeImage();
        }
        document.getElementById('articleModal').classList.add('active');
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('حجم الصورة كبير جداً. الحد الأقصى 2MB', 'error');
            e.target.value = '';
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showToast('يرجى اختيار ملف صورة صحيح', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            document.getElementById('articleImageData').value = imageData;
            document.getElementById('previewImg').src = imageData;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        document.getElementById('articleImage').value = '';
        document.getElementById('articleImageData').value = '';
        document.getElementById('previewImg').src = '';
        document.getElementById('imagePreview').style.display = 'none';
    }

    closeArticleModal() {
        document.getElementById('articleModal').classList.remove('active');
    }

    editArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (article) {
            this.openArticleModal(article);
        }
    }

    async saveArticle() {
        const id = document.getElementById('articleId').value;
        const imageData = document.getElementById('articleImageData').value;

        // Get content from Quill
        const content = this.quill.root.innerHTML;
        const contentEn = this.quillEn.root.innerHTML;

        // Get Category
        const select = document.getElementById('articleCategorySelect');
        if (select.value === "") {
            this.showToast('يرجى اختيار تصنيف للمقال', 'error');
            return;
        }
        const selectedOption = select.options[select.selectedIndex];
        const categoryName = selectedOption.dataset.name;
        const categoryEnName = selectedOption.dataset.nameEn;

        const articleData = {
            title: document.getElementById('articleTitle').value,
            title_en: document.getElementById('articleTitle_en').value,
            category: categoryName,
            category_en: categoryEnName,
            icon: document.getElementById('articleIcon').value,
            date: document.getElementById('articleDate').value,
            summary: document.getElementById('articleSummary').value,
            summary_en: document.getElementById('articleSummary_en').value,
            content: content,
            content_en: contentEn,
            image_url: imageData || null
        };

        try {
            if (id) {
                // Update existing
                await API.updateArticle(parseInt(id), articleData);
                this.showToast('تم تحديث المقال بنجاح', 'success');
            } else {
                // Add new
                await API.createArticle(articleData);
                this.showToast('تم إضافة المقال بنجاح', 'success');
            }

            await this.loadArticles();
            await this.loadDashboard();
            this.closeArticleModal();
        } catch (error) {
            console.error('Error saving article:', error);
            this.showToast('حدث خطأ في حفظ المقال', 'error');
        }
    }

    async deleteArticle(id) {
        if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

        try {
            await API.deleteArticle(id);
            await this.loadArticles();
            await this.loadDashboard();
            this.showToast('تم حذف المقال بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting article:', error);
            this.showToast('حدث خطأ في حذف المقال', 'error');
        }
    }

    getNextArticleId() {
        return Math.max(...this.articles.map(a => a.id), 0) + 1;
    }

    saveArticlesToStorage() {
        localStorage.setItem('articles_data', JSON.stringify(this.articles));
        this.updateArticlesDataFile();
    }

    updateArticlesDataFile() {
        const jsContent = `// ============================================
// Fish Farm Consultant - Articles Data
// Auto-generated from Admin Panel
// ============================================

const ARTICLES_DATA = ${JSON.stringify(this.articles, null, 4)};`;

        // Show download link
        const blob = new Blob([jsContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'articles_data.js';
        a.click();
        URL.revokeObjectURL(url);
    }

    // ============ Content Management ============
    // ============ Content Management ============
    async loadSiteContent() {
        try {
            // Load raw content for admin (includes value and value_en)
            const response = await fetch(`${API_BASE_URL}/content?mode=admin`);
            const rawContent = await response.json();

            // Convert to key-value map for easier access
            const content = {};
            rawContent.forEach(item => {
                content[item.key] = item.value;
                content[item.key + '_en'] = item.value_en;
            });

            this.siteContent = content;

            // Site Title
            if (content.site_title) document.getElementById('siteTitle').value = content.site_title;
            if (content.site_title_en) document.getElementById('siteTitle_en').value = content.site_title_en;

            // Hero Section Content
            if (content.hero_main_title) document.getElementById('heroMainTitle').value = content.hero_main_title;
            if (content.hero_main_title_en) document.getElementById('heroMainTitle_en').value = content.hero_main_title_en;

            if (content.hero_sub_title) document.getElementById('heroSubTitle').value = content.hero_sub_title;
            if (content.hero_sub_title_en) document.getElementById('heroSubTitle_en').value = content.hero_sub_title_en;

            if (content.hero_description) document.getElementById('heroDescriptionField').value = content.hero_description;
            if (content.hero_description_en) document.getElementById('heroDescriptionField_en').value = content.hero_description_en;

            if (content.hero_button_text) document.getElementById('heroButtonTextField').value = content.hero_button_text;
            if (content.hero_button_text_en) document.getElementById('heroButtonTextField_en').value = content.hero_button_text_en;

            // Team Section
            if (document.getElementById('sectionAboutTitle')) document.getElementById('sectionAboutTitle').value = content.section_about_title || '';
            if (document.getElementById('sectionAboutTitle_en')) document.getElementById('sectionAboutTitle_en').value = content.section_about_title_en || '';
            if (document.getElementById('sectionAboutSubtitle')) document.getElementById('sectionAboutSubtitle').value = content.section_about_subtitle || '';
            if (document.getElementById('sectionAboutSubtitle_en')) document.getElementById('sectionAboutSubtitle_en').value = content.section_about_subtitle_en || '';

            // Footer Rights
            if (document.getElementById('footerRightsField')) document.getElementById('footerRightsField').value = content.footer_rights || '';
            if (document.getElementById('footerRightsField_en')) document.getElementById('footerRightsField_en').value = content.footer_rights_en || '';

            // AI Settings
            if (content.ai_provider) {
                const aiProviderSelect = document.getElementById('aiProvider');
                if (aiProviderSelect) aiProviderSelect.value = content.ai_provider;
            }
            if (content.gemini_key) document.getElementById('geminiKey').value = content.gemini_key;
            if (content.groq_key) document.getElementById('groqKey').value = content.groq_key;
            if (content.openai_key) document.getElementById('openaiKey').value = content.openai_key;
            if (content.anthropic_key) document.getElementById('anthropicKey').value = content.anthropic_key;

            // Navbar Settings
            document.getElementById('showNavHome').checked = content.nav_show_home !== 'false';
            document.getElementById('showNavArticles').checked = content.nav_show_articles !== 'false';
            document.getElementById('showNavTools').checked = content.nav_show_tools !== 'false';
            document.getElementById('showNavAbout').checked = content.nav_show_about !== 'false';
            document.getElementById('showNavConsult').checked = content.nav_show_consult !== 'false';

            // Sections Settings
            document.getElementById('showHeroSection').checked = content.section_show_hero !== 'false';
            document.getElementById('showConsultSection').checked = content.section_show_consult !== 'false';
            document.getElementById('showArticlesSection').checked = content.section_show_articles !== 'false';
            document.getElementById('showToolsSection').checked = content.section_show_tools !== 'false';
            document.getElementById('showAboutSection').checked = content.section_show_about !== 'false';

        } catch (error) {
            console.error('Error loading site content:', error);
            this.showToast('فشل تحميل المحتوى', 'error');
        }
    }

    // Helper to avoid null reference errors
    safelyGetValue(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    async saveContent() {
        const updates = [
            // Site Content
            { key: 'site_title', value: this.safelyGetValue('siteTitle'), value_en: this.safelyGetValue('siteTitle_en') },

            // Hero Section Content
            { key: 'hero_main_title', value: this.safelyGetValue('heroMainTitle'), value_en: this.safelyGetValue('heroMainTitle_en') },
            { key: 'hero_sub_title', value: this.safelyGetValue('heroSubTitle'), value_en: this.safelyGetValue('heroSubTitle_en') },
            { key: 'hero_description', value: this.safelyGetValue('heroDescriptionField'), value_en: this.safelyGetValue('heroDescriptionField_en') },
            { key: 'hero_button_text', value: this.safelyGetValue('heroButtonTextField'), value_en: this.safelyGetValue('heroButtonTextField_en') },

            // Team Section Content
            { key: 'section_about_title', value: this.safelyGetValue('sectionAboutTitle'), value_en: this.safelyGetValue('sectionAboutTitle_en') },
            { key: 'section_about_subtitle', value: this.safelyGetValue('sectionAboutSubtitle'), value_en: this.safelyGetValue('sectionAboutSubtitle_en') },

            // Footer Rights
            { key: 'footer_rights', value: this.safelyGetValue('footerRightsField'), value_en: this.safelyGetValue('footerRightsField_en') },

            // AI Settings
            { key: 'ai_provider', value: this.safelyGetValue('aiProvider') },
            { key: 'gemini_key', value: this.safelyGetValue('geminiKey') },
            { key: 'groq_key', value: this.safelyGetValue('groqKey') },
            { key: 'openai_key', value: this.safelyGetValue('openaiKey') },
            { key: 'anthropic_key', value: this.safelyGetValue('anthropicKey') }
        ];

        console.log('💾 Saving content updates:', updates);

        try {
            const promises = updates.map(item => {
                const payload = { value: item.value, value_en: item.value_en };
                console.log(`📤 Sending ${item.key}:`, payload);
                return API.updateContent(item.key, payload);
            });
            await Promise.all(promises);

            // Update local cache
            updates.forEach(item => {
                this.siteContent[item.key] = item.value;
                if (item.value_en) this.siteContent[item.key + '_en'] = item.value_en;
            });

            console.log('✅ Content saved successfully');
            this.showToast('تم حفظ الإعدادات والمحتوى بنجاح', 'success');
        } catch (error) {
            console.error('❌ Error saving content:', error);
            // Try to get validation details if available
            if (error.response) {
                // log response body if possible, assuming specific error handling capability
            }
            this.showToast('حدث خطأ في الحفظ: ' + error.message, 'error');
        }
    }

    async saveAISettings() {
        const aiUpdates = [
            { key: 'ai_provider', value: document.getElementById('aiProvider').value },
            { key: 'gemini_key', value: document.getElementById('geminiKey').value },
            { key: 'groq_key', value: document.getElementById('groqKey').value },
            { key: 'openai_key', value: document.getElementById('openaiKey').value },
            { key: 'anthropic_key', value: document.getElementById('anthropicKey').value }
        ];

        try {
            const promises = aiUpdates.map(item => API.updateContent(item.key, item.value));
            await Promise.all(promises);

            // Update local cache
            aiUpdates.forEach(item => {
                this.siteContent[item.key] = item.value;
            });

            this.showToast('✅ تم حفظ إعدادات الذكاء الاصطناعي بنجاح', 'success');
        } catch (error) {
            console.error('Error saving AI settings:', error);
            this.showToast('❌ حدث خطأ في حفظ إعدادات الذكاء الاصطناعي', 'error');
        }
    }

    async saveNavSettings() {
        const navUpdates = [
            { key: 'nav_show_home', value: document.getElementById('showNavHome').checked },
            { key: 'nav_show_articles', value: document.getElementById('showNavArticles').checked },
            { key: 'nav_show_tools', value: document.getElementById('showNavTools').checked },
            { key: 'nav_show_about', value: document.getElementById('showNavAbout').checked },
            { key: 'nav_show_consult', value: document.getElementById('showNavConsult').checked }
        ];

        try {
            const promises = navUpdates.map(item => API.updateContent(item.key, item.value.toString()));
            await Promise.all(promises);

            // Update local cache
            navUpdates.forEach(item => {
                this.siteContent[item.key] = item.value.toString();
            });

            this.showToast('✅ تم حفظ إعدادات القائمة بنجاح', 'success');
        } catch (error) {
            console.error('Error saving navbar settings:', error);
            this.showToast('❌ حدث خطأ في حفظ إعدادات القائمة', 'error');
        }
    }

    async saveSectionsSettings() {
        const sectionsUpdates = [
            { key: 'section_show_hero', value: document.getElementById('showHeroSection').checked },
            { key: 'section_show_consult', value: document.getElementById('showConsultSection').checked },
            { key: 'section_show_articles', value: document.getElementById('showArticlesSection').checked },
            { key: 'section_show_tools', value: document.getElementById('showToolsSection').checked },
            { key: 'section_show_about', value: document.getElementById('showAboutSection').checked }
        ];

        try {
            const promises = sectionsUpdates.map(item => API.updateContent(item.key, item.value.toString()));
            await Promise.all(promises);

            // Update local cache
            sectionsUpdates.forEach(item => {
                this.siteContent[item.key] = item.value.toString();
            });

            this.showToast('✅ تم حفظ إعدادات الأقسام بنجاح', 'success');
        } catch (error) {
            console.error('Error saving sections settings:', error);
            this.showToast('❌ حدث خطأ في حفظ إعدادات الأقسام', 'error');
        }
    }

    // ============ Data Management ============
    exportData() {
        const data = {
            articles: this.articles,
            content: this.siteContent,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fish-farm-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('تم تصدير البيانات بنجاح', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (data.articles) {
                    this.articles = data.articles;
                    this.saveArticlesToStorage();
                    this.loadArticles();
                }

                if (data.content) {
                    this.siteContent = data.content;
                    localStorage.setItem('site_content', JSON.stringify(data.content));
                }

                this.showToast('تم استيراد البيانات بنجاح', 'success');
                this.loadDashboard();
            } catch (error) {
                this.showToast('خطأ في قراءة الملف', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ============ Utilities ============
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        toast.className = 'toast ' + type;
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ============ Team Management ============
    async loadTeam() {
        const container = document.getElementById('teamList');
        container.innerHTML = '<p style="text-align: center;">جاري التحميل...</p>';

        try {
            this.teamMembers = await API.getTeamMembers({ mode: 'admin' });
            container.innerHTML = '';

            if (this.teamMembers.length === 0) {
                container.innerHTML = '<p style="text-align: center;">لا يوجد أعضاء في الفريق.</p>';
                return;
            }

            this.teamMembers.forEach(member => {
                const item = document.createElement('div');
                item.className = 'article-item';
                item.style.cssText = 'display: flex; align-items: center; gap: 15px;';

                const imageHtml = member.image_url
                    ? `<img src="${member.image_url}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">`
                    : `<div style="width: 60px; height: 60px; border-radius: 50%; background: #ddd; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👤</div>`;

                item.innerHTML = `
                    ${imageHtml}
                    <div class="article-info" style="flex: 1;">
                        <h3>${member.name}</h3>
                        <div class="article-meta">
                            <span><i class="fas fa-briefcase"></i> ${member.position}</span>
                            <span><i class="fas fa-sort"></i> ترتيب: ${member.display_order}</span>
                        </div>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminPanel.editTeamMember(${member.id})">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteTeamMember(${member.id})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                `;
                container.appendChild(item);
            });

        } catch (error) {
            console.error('Error loading team:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--admin-danger);">حدث خطأ في تحميل الفريق</p>';
        }
    }

    openTeamMemberModal(member = null) {
        if (member) {
            document.getElementById('teamMemberModalTitle').textContent = 'تعديل عضو الفريق';
            document.getElementById('teamMemberId').value = member.id;
            document.getElementById('memberName').value = member.name;
            document.getElementById('memberName_en').value = member.name_en || '';
            document.getElementById('memberPosition').value = member.position;
            document.getElementById('memberPosition_en').value = member.position_en || '';
            document.getElementById('memberBio').value = member.bio || '';
            document.getElementById('memberBio_en').value = member.bio_en || '';
            document.getElementById('memberOrder').value = member.display_order || 0;

            if (member.image_url) {
                document.getElementById('memberImageData').value = member.image_url;
                document.getElementById('memberPreviewImg').src = member.image_url;
                document.getElementById('memberImagePreview').style.display = 'block';
            } else {
                this.removeMemberImage();
            }
        } else {
            document.getElementById('teamMemberModalTitle').textContent = 'إضافة عضو جديد';
            document.getElementById('teamMemberForm').reset();
            document.getElementById('teamMemberId').value = '';
            this.removeMemberImage();
        }
        document.getElementById('teamMemberModal').classList.add('active');
    }

    closeTeamMemberModal() {
        document.getElementById('teamMemberModal')?.classList.remove('active');
    }

    editTeamMember(id) {
        const member = this.teamMembers.find(m => m.id === id);
        if (member) {
            this.openTeamMemberModal(member);
        }
    }

    async saveTeamMember() {
        const id = document.getElementById('teamMemberId').value;
        const imageData = document.getElementById('memberImageData').value;

        const memberData = {
            name: document.getElementById('memberName').value,
            name_en: document.getElementById('memberName_en').value,
            position: document.getElementById('memberPosition').value,
            position_en: document.getElementById('memberPosition_en').value,
            bio: document.getElementById('memberBio').value,
            bio_en: document.getElementById('memberBio_en').value,
            image_url: imageData || null,
            display_order: parseInt(document.getElementById('memberOrder').value) || 0
        };

        try {
            if (id) {
                await API.updateTeamMember(parseInt(id), memberData);
                this.showToast('تم تحديث العضو بنجاح', 'success');
            } else {
                await API.createTeamMember(memberData);
                this.showToast('تم إضافة العضو بنجاح', 'success');
            }

            await this.loadTeam();
            this.closeTeamMemberModal();
        } catch (error) {
            console.error('Error saving team member:', error);
            this.showToast('حدث خطأ في حفظ العضو', 'error');
        }
    }

    async deleteTeamMember(id) {
        if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;

        try {
            await API.deleteTeamMember(id);
            await this.loadTeam();
            this.showToast('تم حذف العضو بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting team member:', error);
            this.showToast('حدث خطأ في حذف العضو', 'error');
        }
    }

    handleMemberImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            this.showToast('حجم الصورة كبير جداً. الحد الأقصى 2MB', 'error');
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.showToast('يرجى اختيار ملف صورة صحيح', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            document.getElementById('memberImageData').value = imageData;
            document.getElementById('memberPreviewImg').src = imageData;
            document.getElementById('memberImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeMemberImage() {
        document.getElementById('memberImage').value = '';
        document.getElementById('memberImageData').value = '';
        document.getElementById('memberPreviewImg').src = '';
        document.getElementById('memberImagePreview').style.display = 'none';
    }

    // ============ Categories ============

    async loadCategories() {
        try {
            this.categories = await API.getCategories();
            this.renderCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showToast('فشل تحميل التصنيفات', 'error');
        }
    }

    renderCategories() {
        // Render in Categories Section
        const container = document.getElementById('categoriesList');
        if (!container) return;

        container.innerHTML = this.categories.map(cat => `
            <div class="category-card" style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${cat.name}</strong>
                    <div style="font-size: 0.9em; color: gray;">${cat.name_en || '-'}</div>
                </div>
                <button onclick="adminPanel.deleteCategory(${cat.id})" class="btn-icon delete" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    async addCategory() {
        const nameInput = document.getElementById('newCategoryName');
        const nameEnInput = document.getElementById('newCategoryNameEn');

        const name = nameInput.value.trim();
        const name_en = nameEnInput.value.trim();

        if (!name) {
            this.showToast('يرجى إدخال اسم التصنيف بالعربية', 'error');
            return;
        }

        try {
            await API.createCategory({ name, name_en });
            this.showToast('تم إضافة التصنيف بنجاح', 'success');
            nameInput.value = '';
            nameEnInput.value = '';
            await this.loadCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            this.showToast('حدث خطأ في إضافة التصنيف', 'error');
        }
    }

    async deleteCategory(id) {
        if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

        try {
            await API.deleteCategory(id);
            this.showToast('تم حذف التصنيف بنجاح', 'success');
            await this.loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showToast('حدث خطأ في حذف التصنيف', 'error');
        }
    }

    // ============ Tools Management ============
    async loadToolsSettings() {
        try {
            const content = await API.getContent();
            let visibleTools = {};
            if (content.visible_tools) {
                try {
                    visibleTools = JSON.parse(content.visible_tools);
                } catch (e) {
                    console.error('Error parsing visible_tools', e);
                }
            } else {
                // Default all visible
                visibleTools = {
                    'feed-calculator': true,
                    'water-quality': true,
                    'fish-density': true,
                    'profit-calculator': true,
                    'fcr-calculator': true,
                    'biofloc-calculator': true,
                    'feeding-schedule': true
                };
            }
            this.renderToolsSettings(visibleTools);
        } catch (error) {
            console.error('Error loading tools settings:', error);
        }
    }

    renderToolsSettings(visibleTools) {
        const container = document.getElementById('toolsToggles');
        if (!container) return;

        const toolsList = [
            { id: 'feed-calculator', name: 'حاسبة العلف والأمونيا' },
            { id: 'water-quality', name: 'حاسبة جودة المياه' },
            { id: 'fish-density', name: 'حاسبة الكثافة السمكية' },
            { id: 'profit-calculator', name: 'حاسبة الربح والخسارة' },
            { id: 'fcr-calculator', name: 'حاسبة FCR' },
            { id: 'biofloc-calculator', name: 'حاسبة البايوفلوك' },
            { id: 'feeding-schedule', name: 'جدول التغذية التلقائي' }
        ];

        container.innerHTML = toolsList.map(tool => {
            const isChecked = visibleTools[tool.id] !== false; // Default true
            return `
                <div class="tool-toggle-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; background: #f9f9f9;">
                    <span style="font-weight: bold; font-size: 1.1em;">${tool.name}</span>
                    <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                        <input type="checkbox" class="tool-visibility-toggle" data-tool-id="${tool.id}" ${isChecked ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; border-radius: 34px;"></span>
                        <style>
                            .tool-visibility-toggle:checked + .slider { background-color: #2196F3; }
                            .tool-visibility-toggle:focus + .slider { box-shadow: 0 0 1px #2196F3; }
                            .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; border-radius: 50%; }
                            .tool-visibility-toggle:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); }
                        </style>
                    </label>
                </div>
            `;
        }).join('');
    }

    async saveToolsSettings() {
        const toggles = document.querySelectorAll('.tool-visibility-toggle');
        const visibleTools = {};

        toggles.forEach(toggle => {
            visibleTools[toggle.dataset.toolId] = toggle.checked;
        });

        try {
            await API.updateContent('visible_tools', JSON.stringify(visibleTools));
            this.showToast('تم حفظ إعدادات الأدوات بنجاح', 'success');
        } catch (error) {
            console.error('Error saving tools settings:', error);
            this.showToast('حدث خطأ في حفظ الإعدادات', 'error');
        }
    }

    // ============ Logo Upload ============
    async uploadLogo() {
        const fileInput = document.getElementById('logoUpload');
        const file = fileInput.files[0];

        if (!file) {
            this.showToast('الرجاء اختيار صورة أولاً', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('الرجاء اختيار ملف صورة صحيح', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('حجم الصورة كبير جداً. الحد الأقصى 2MB', 'error');
            return;
        }

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result;

                // Save to database
                await API.updateContent('site_logo', base64Image);

                // Update preview
                document.getElementById('currentLogo').src = base64Image;

                // Update all navbar logos
                document.querySelectorAll('.logo-image').forEach(img => {
                    img.src = base64Image;
                });

                // Update favicon
                const favicon = document.getElementById('favicon');
                if (favicon) {
                    favicon.href = base64Image;
                }

                this.showToast('تم رفع الشعار بنجاح', 'success');
                fileInput.value = ''; // Clear input
            };

            reader.onerror = () => {
                this.showToast('حدث خطأ في قراءة الصورة', 'error');
            };

            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Error uploading logo:', error);
            this.showToast('حدث خطأ في رفع الشعار', 'error');
        }
    }
}

// Initialize Admin Panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Load articles from localStorage if available
    const savedArticles = localStorage.getItem('articles_data');
    if (savedArticles) {
        try {
            ARTICLES_DATA = JSON.parse(savedArticles);
        } catch (e) {
            console.error('Error loading saved articles:', e);
        }
    }

    adminPanel = new AdminPanel();
});
