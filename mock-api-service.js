// Mock API Service for FeedbackOS Dashboard (Works without backend)
class MockFeedbackAPI {
    constructor() {
        // Generate mock data that simulates your database
        this.mockData = this.generateMockData();
    }

    generateMockData() {
        const ratings = ['very satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very dissatisfied'];
        const sources = ['document', 'chatbot'];
        const feedbackTexts = [
            "The agent was very helpful in resolving my billing issue quickly.",
            "It was okay, but the response time was a bit slow initially.",
            "My problem is still not fixed. This is very frustrating.",
            "Great service, thanks!",
            "The new feature you deployed is exactly what I needed.",
            "Could be better, but overall satisfied with the help.",
            "Amazing support team! Very responsive and knowledgeable.",
            "The chatbot didn't understand my question at first.",
            "Perfect solution to my problem. Thank you!",
            "Needs improvement in understanding complex queries."
        ];

        const feedback = [];
        const now = new Date();
        
        // Generate 50 mock feedback entries
        for (let i = 0; i < 50; i++) {
            const createdAt = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
            feedback.push({
                _id: `mock_${i}`,
                device_id: `device_${Math.random().toString(36).substr(2, 8)}`,
                feedback: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
                rating: ratings[Math.floor(Math.random() * ratings.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                createdAt: createdAt,
                updatedAt: createdAt
            });
        }

        return feedback.sort((a, b) => b.createdAt - a.createdAt);
    }

    async request(endpoint, options = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        
        // Route to appropriate mock method
        if (endpoint === '/dashboard-stats') return this.getDashboardStats();
        if (endpoint === '/ratings-distribution') return this.getRatingsDistribution();
        if (endpoint.startsWith('/volume-trend')) return this.getVolumeTrend();
        if (endpoint.startsWith('/recent')) return this.getRecentFeedback();
        if (endpoint.startsWith('/?')) return this.getAllFeedback(endpoint);
        
        throw new Error(`Mock endpoint not found: ${endpoint}`);
    }

    async getDashboardStats() {
        const total = this.mockData.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySessions = new Set(
            this.mockData
                .filter(f => f.createdAt >= today)
                .map(f => f.device_id)
        ).size;

        return {
            totalFeedback: total,
            activeSessions: todaySessions,
            feedbackGrowth: "+12.5%",
            sessionGrowth: "+3.2%"
        };
    }

    async getRatingsDistribution() {
        const ratingCounts = {
            'very satisfied': 0,
            'satisfied': 0,
            'neutral': 0,
            'dissatisfied': 0,
            'very dissatisfied': 0
        };

        this.mockData.forEach(item => {
            ratingCounts[item.rating]++;
        });

        const total = this.mockData.length;
        const satisfied = ratingCounts['very satisfied'] + ratingCounts['satisfied'];
        const neutral = ratingCounts['neutral'];
        const dissatisfied = ratingCounts['dissatisfied'] + ratingCounts['very dissatisfied'];

        // Calculate average score
        const scoreMapping = {
            'very dissatisfied': 1,
            'dissatisfied': 2,
            'neutral': 3,
            'satisfied': 4,
            'very satisfied': 5
        };

        let totalScore = 0;
        this.mockData.forEach(item => {
            totalScore += scoreMapping[item.rating];
        });

        return {
            satisfied: Math.round((satisfied / total) * 100),
            neutral: Math.round((neutral / total) * 100),
            dissatisfied: Math.round((dissatisfied / total) * 100),
            averageScore: (totalScore / total).toFixed(1),
            totalResponses: total
        };
    }

    async getVolumeTrend(days = 7) {
        const result = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const count = this.mockData.filter(item => 
                item.createdAt >= date && item.createdAt < nextDay
            ).length;

            result.push({
                date: date.toISOString().split('T')[0],
                count: count,
                label: date.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }

        return result;
    }

    async getRecentFeedback(limit = 5) {
        const recent = this.mockData.slice(0, limit);
        
        return recent.map(item => ({
            id: item._id,
            user: `User ${item.device_id.slice(-4)}`,
            rating: this.mapRatingToSentiment(item.rating),
            comment: item.feedback.length > 60 ? 
                item.feedback.substring(0, 60) + '...' : item.feedback,
            date: this.getTimeAgo(item.createdAt),
            status: 'New'
        }));
    }

    async getAllFeedback(queryString) {
        // Parse query parameters
        const params = new URLSearchParams(queryString.split('?')[1] || '');
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const search = params.get('search') || '';
        
        let filtered = this.mockData;
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter(item => 
                item.device_id.toLowerCase().includes(search.toLowerCase()) ||
                item.feedback.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply pagination
        const total = filtered.length;
        const start = (page - 1) * limit;
        const paginatedData = filtered.slice(start, start + limit);

        // Get message counts per device
        const deviceCounts = {};
        this.mockData.forEach(item => {
            deviceCounts[item.device_id] = (deviceCounts[item.device_id] || 0) + 1;
        });

        const formattedFeedback = paginatedData.map(item => ({
            id: item._id,
            sessionId: item.device_id,
            user: `User ${item.device_id.slice(-4)}`,
            feedback: item.feedback,
            rating: this.mapRatingToSentiment(item.rating),
            source: item.source,
            messageCount: deviceCounts[item.device_id] || 1,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));

        return {
            feedback: formattedFeedback,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
    }

    mapRatingToSentiment(rating) {
        const mapping = {
            'very satisfied': { label: 'Satisfied', color: 'emerald', icon: 'sentiment_satisfied_alt' },
            'satisfied': { label: 'Satisfied', color: 'emerald', icon: 'sentiment_satisfied_alt' },
            'neutral': { label: 'Neutral', color: 'amber', icon: 'sentiment_neutral' },
            'dissatisfied': { label: 'Dissatisfied', color: 'rose', icon: 'sentiment_dissatisfied' },
            'very dissatisfied': { label: 'Dissatisfied', color: 'rose', icon: 'sentiment_dissatisfied' }
        };
        return mapping[rating] || mapping['neutral'];
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    // Maintain same interface as real API
    async submitFeedback(feedbackData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { message: "Feedback submitted successfully (mock)", data: feedbackData };
    }
}

// Create global instance
window.feedbackAPI = new MockFeedbackAPI();