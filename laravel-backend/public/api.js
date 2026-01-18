// ============================================
// API Helper - Frontend to Backend Communication
// ============================================

// Auto-detect API URL
let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development Mode
    API_BASE_URL = 'http://localhost:8000/api';
} else {
    // Production Mode (Railway, Vercel, etc.)
    // Use relative path so it works on any domain/port
    API_BASE_URL = '/api';
}

console.log('🔗 API Base URL:', API_BASE_URL);

console.log('📍 Current Location:', window.location.href);

function getHeaders() {
    const lang = localStorage.getItem('appLang') || 'ar';
    return {
        'Content-Type': 'application/json',
        'Accept-Language': lang
    };
}


class API {
    // ============ Articles ============

    static async getArticles(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/articles${query ? '?' + query : ''}`;
            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to fetch articles');
            return await response.json();
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }

    // ... (rest)

    static async getQuestions(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/questions${query ? '?' + query : ''}`;
            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to fetch questions');
            return await response.json();
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    // ... (rest)

    static async getTeamMembers(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/team${query ? '?' + query : ''}`;
            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to fetch team members');
            return await response.json();
        } catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    }

    static async getArticle(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${id}`);
            if (!response.ok) throw new Error('Failed to fetch article');
            return await response.json();
        } catch (error) {
            console.error('Error fetching article:', error);
            return null;
        }
    }

    static async createArticle(articleData) {
        try {
            const response = await fetch(`${API_BASE_URL}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });
            if (!response.ok) throw new Error('Failed to create article');
            return await response.json();
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    }

    static async updateArticle(id, articleData) {
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });
            if (!response.ok) throw new Error('Failed to update article');
            return await response.json();
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    }

    static async deleteArticle(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete article');
            return await response.json();
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    }

    // ============ Site Content ============

    static async getContent() {
        try {
            const response = await fetch(`${API_BASE_URL}/content`, { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to fetch content');
            return await response.json();
        } catch (error) {
            console.error('Error fetching content:', error);
            return {};
        }
    }

    static async updateContent(key, value) {
        try {
            const response = await fetch(`${API_BASE_URL}/content/${key}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(typeof value === 'object' ? value : { value })
            });
            if (!response.ok) throw new Error('Failed to update content');
            return await response.json();
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    }

    // ============ Questions ============



    static async updateQuestion(id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update question');
            return await response.json();
        } catch (error) {
            console.error('Error updating question:', error);
            throw error;
        }
    }

    // ============ Consultations ============

    static async saveConsultation(answers, aiResponse, provider) {
        try {
            const response = await fetch(`${API_BASE_URL}/consultations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    ai_response: aiResponse,
                    provider
                })
            });
            if (!response.ok) throw new Error('Failed to save consultation');
            return await response.json();
        } catch (error) {
            console.error('Error saving consultation:', error);
            // Don't throw - consultation saving is not critical
            return null;
        }
    }

    static async getConsultations(limit = 50) {
        try {
            const response = await fetch(`${API_BASE_URL}/consultations?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch consultations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching consultations:', error);
            return [];
        }
    }

    // ============ Statistics ============

    static async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                articlesCount: 0,
                consultationsCount: 0,
                todayConsultations: 0
            };
        }
    }

    // ============ Team Members ============



    static async createTeamMember(memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (!response.ok) throw new Error('Failed to create team member');
            return await response.json();
        } catch (error) {
            console.error('Error creating team member:', error);
            throw error;
        }
    }

    static async updateTeamMember(id, memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/team/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (!response.ok) throw new Error('Failed to update team member');
            return await response.json();
        } catch (error) {
            console.error('Error updating team member:', error);
            throw error;
        }
    }

    static async deleteTeamMember(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/team/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete team member');
            return await response.json();
        } catch (error) {
            console.error('Error deleting team member:', error);
            throw error;
        }
    }

    // ============ Categories ============

    static async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async createCategory(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create category');
            return await response.json();
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static async deleteCategory(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete category');
            return await response.json();
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}
