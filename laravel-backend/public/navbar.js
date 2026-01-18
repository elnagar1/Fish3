// Navbar Visibility Controller
// This script manages the visibility of navbar links based on admin settings

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔗 Navbar: Initializing...');

    // Ensure API is available
    if (typeof API === 'undefined') {
        console.error('❌ Navbar: API not loaded');
        return;
    }

    try {
        // Load settings from database
        const content = await API.getContent();
        console.log('✅ Navbar: Settings loaded', content);

        // Define navbar items with their selectors
        const navItems = [
            {
                name: 'الرئيسية',
                key: 'nav_show_home',
                selector: '.nav-links a[href="index.html"]'
            },
            {
                name: 'المقالات',
                key: 'nav_show_articles',
                selector: '.nav-links a[href="articles.html"]'
            },
            {
                name: 'الأدوات',
                key: 'nav_show_tools',
                selector: '.nav-links a[href="tools.html"]'
            },
            {
                name: 'من نحن',
                key: 'nav_show_about',
                selector: '.nav-links a[href*="#about"]'
            },
            {
                name: 'استشارة',
                key: 'nav_show_consult',
                selector: '.nav-links a[href*="#consult"]'
            }
        ];

        // Apply visibility to each navbar item
        navItems.forEach(item => {
            const element = document.querySelector(item.selector);

            if (element) {
                // Default to visible (true) if not set
                const shouldShow = content[item.key] !== 'false';

                // Apply visibility
                element.style.display = shouldShow ? '' : 'none';

                console.log(`📍 Navbar: ${item.name} -> ${shouldShow ? 'visible' : 'hidden'}`);
            } else {
                console.warn(`⚠️ Navbar: Element not found for ${item.name}`);
            }
        });

        console.log('✅ Navbar: Initialization complete');

        // Reveal navbar with fade-in effect
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            setTimeout(() => {
                navLinks.classList.add('loaded');
            }, 50);
        }

    } catch (error) {
        console.error('❌ Navbar: Error loading settings:', error);
    }
});
