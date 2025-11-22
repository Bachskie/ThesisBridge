// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
        }
        throw error;
    }
}

// Auth API
const authAPI = {
    async register(userData) {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(email, password) {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async getCurrentUser() {
        return apiCall('/auth/me');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
};

// Projects API
const projectsAPI = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return apiCall(`/projects?${params}`);
    },

    async getById(id) {
        return apiCall(`/projects/${id}`);
    },

    async create(projectData) {
        return apiCall('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    },

    async update(id, projectData) {
        return apiCall(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    },

    async delete(id) {
        return apiCall(`/projects/${id}`, {
            method: 'DELETE'
        });
    },

    async getByCompany(companyId) {
        return apiCall(`/projects/company/${companyId}`);
    }
};

// Applications API
const applicationsAPI = {
    async getAll() {
        return apiCall('/applications');
    },

    async getById(id) {
        return apiCall(`/applications/${id}`);
    },

    async create(applicationData) {
        return apiCall('/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    },

    async updateStatus(id, status, notes = '') {
        return apiCall(`/applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    },

    async withdraw(id) {
        return apiCall(`/applications/${id}`, {
            method: 'DELETE'
        });
    }
};

// Users API
const usersAPI = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return apiCall(`/users?${params}`);
    },

    async getById(id) {
        return apiCall(`/users/${id}`);
    },

    async update(id, userData) {
        return apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async delete(id) {
        return apiCall(`/users/${id}`, {
            method: 'DELETE'
        });
    }
};

// Helper to check if user is logged in
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Helper to get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper to save user session
function saveUserSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authAPI,
        projectsAPI,
        applicationsAPI,
        usersAPI,
        isAuthenticated,
        getCurrentUser,
        saveUserSession
    };
}
