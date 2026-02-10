// API Service for FeedbackOS Dashboard
class FeedbackAPI {
    constructor(baseURL = 'http://localhost:5000/api/feedback') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

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

    // Recent Feedback for Dashboard Table
    async getRecentFeedback(limit = 5) {
        return this.request(`/recent?limit=${limit}`);
    }

    // All Feedback with Pagination and Filtering
    async getAllFeedback(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/?${queryString}`);
    }

    // Submit New Feedback
    async submitFeedback(feedbackData) {
        return this.request('/submit', {
            method: 'POST',
            body: JSON.stringify(feedbackData)
        });
    }
}

// Create global instance
window.feedbackAPI = new FeedbackAPI();