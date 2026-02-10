// API Service for FeedbackOS Dashboard
class FeedbackAPI {
    constructor(baseURL = 'https://edudoc-610o.onrender.com/api/feedback') {
        this.baseURL = baseURL;
    }

    getToken() {
        return localStorage.getItem('dashboard_token');
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                    ...options.headers
                },
                ...options
            });

            if (response.status === 401) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem('dashboard_token');
                localStorage.removeItem('dashboard_admin');
                window.location.href = 'login.html';
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Dashboard Statistics
    async getDashboardStats() {
        return this.request('/dashboard-stats');
    }

    // Ratings Distribution for Donut Chart
    async getRatingsDistribution() {
        return this.request('/ratings-distribution');
    }

    // Volume Trend for Line Chart
    async getVolumeTrend(days = 7) {
        return this.request(`/volume-trend?days=${days}`);
    }

    // Source Distribution (Chatbot vs Document)
    async getSourceDistribution() {
        return this.request('/source-distribution');
    }

    // Recent Feedback for Dashboard Table
    async getRecentFeedback(limit = 5) {
        return this.request(`/recent?limit=${limit}`);
    }

    // All Feedback with Pagination and Filtering
    async getAllFeedback(params = {}) {
        // Filter out empty values to avoid sending empty query params
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );
        const queryString = new URLSearchParams(filteredParams).toString();
        return this.request(`/?${queryString}`);
    }

    // Submit New Feedback (public - no auth needed)
    async submitFeedback(feedbackData) {
        return this.request('/submit', {
            method: 'POST',
            body: JSON.stringify(feedbackData)
        });
    }
}

// Create global instance
window.feedbackAPI = new FeedbackAPI();