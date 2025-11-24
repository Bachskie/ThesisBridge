// Dashboard JavaScript Functionality

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Small delay to ensure all scripts are loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TEMPORARILY DISABLED - Authentication check on hold
    // if (!isAuthenticated()) {
    //     console.log('Not authenticated, redirecting to login');
    //     window.location.href = 'login.html';
    //     return;
    // }

    console.log('Loading dashboard data');
    
    // Load user data and dashboard content
    try {
        await loadDashboardData();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Don't redirect on error, just show notification
        showDashboardNotification('Unable to load all data. Please check your connection.', 'error');
    }
});

// Load dashboard data from API
async function loadDashboardData() {
    try {
        let user = getCurrentUser();
        
        // TEMPORARILY DISABLED - Mock user for development
        if (!user) {
            // console.log('No user in session, redirecting');
            // window.location.href = 'login.html';
            // return;
            
            // Mock user based on current page
            const isStudentDashboard = window.location.pathname.includes('student-dashboard');
            user = {
                name: isStudentDashboard ? 'Test Student' : 'Test Company',
                email: isStudentDashboard ? 'student@test.com' : 'company@test.com',
                userType: isStudentDashboard ? 'student' : 'company'
            };
        }

        // Update user info in header
        updateUserHeader(user);

        // Check which dashboard we're on
        const isStudentDashboard = window.location.pathname.includes('student-dashboard');
        const isCompanyDashboard = window.location.pathname.includes('company-dashboard');
        
        // Load appropriate dashboard content based on current page
        // Admin can access both dashboards
        if (isStudentDashboard) {
            await loadStudentDashboard();
        } else if (isCompanyDashboard) {
            await loadCompanyDashboard();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showDashboardNotification('Error loading dashboard data', 'error');
    }
}

// Update user header
function updateUserHeader(user) {
    const userNameEl = document.querySelector('.user-name');
    const userAvatarEl = document.querySelector('.user-avatar');
    const welcomeText = document.querySelector('.welcome-section h1');

    if (userNameEl) {
        userNameEl.textContent = user.userType === 'company' ? user.companyName : user.name;
    }

    if (userAvatarEl && user.userType === 'company') {
        const initials = user.companyName.split(' ').map(w => w[0]).join('').substring(0, 2);
        userAvatarEl.textContent = initials.toUpperCase();
    } else if (userAvatarEl) {
        const initials = user.name.split(' ').map(w => w[0]).join('').substring(0, 2);
        userAvatarEl.textContent = initials.toUpperCase();
    }

    if (welcomeText) {
        const displayName = user.userType === 'company' ? user.companyName : user.name.split(' ')[0];
        welcomeText.textContent = `Welcome, ${displayName}! 🚀`;
    }
}

// Load student dashboard
async function loadStudentDashboard() {
    try {
        // Load recommended projects
        const projectsResponse = await projectsAPI.getAll({ status: 'open' });
        if (projectsResponse.success) {
            renderRecommendedProjects(projectsResponse.data.slice(0, 3));
        }

        // Load applications
        const applicationsResponse = await applicationsAPI.getAll();
        if (applicationsResponse.success) {
            updateApplicationStats(applicationsResponse.data);
        }
    } catch (error) {
        console.error('Error loading student dashboard:', error);
    }
}

// Load company dashboard
async function loadCompanyDashboard() {
    try {
        const user = getCurrentUser();
        
        // Load company's projects
        const projectsResponse = await projectsAPI.getByCompany(user._id);
        if (projectsResponse.success) {
            renderCompanyProjects(projectsResponse.data);
        }

        // Load applications for company's projects
        const applicationsResponse = await applicationsAPI.getAll();
        if (applicationsResponse.success) {
            renderApplications(applicationsResponse.data);
            updateCompanyStats(applicationsResponse.data);
        }
    } catch (error) {
        console.error('Error loading company dashboard:', error);
    }
}

// Render recommended projects for students
function renderRecommendedProjects(projects) {
    const projectsList = document.querySelector('.recommended-projects .projects-list');
    if (!projectsList || projects.length === 0) return;

    projectsList.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project._id}">
            <div class="project-header">
                <div>
                    <span class="project-category">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p class="company-name">${project.companyName}</p>
                </div>
            </div>
            <p class="project-description">${project.description.substring(0, 120)}...</p>
            <div class="project-meta">
                <span>📍 ${project.location}</span>
                <span>⏰ ${project.duration}</span>
            </div>
            <button class="btn btn-primary btn-full" onclick="applyToProject('${project._id}')">Apply Now</button>
        </div>
    `).join('');
}

// Render company projects
function renderCompanyProjects(projects) {
    const projectsList = document.querySelector('.projects-list');
    if (!projectsList || projects.length === 0) return;

    projectsList.innerHTML = projects.slice(0, 3).map(project => `
        <div class="company-project-card" data-id="${project._id}">
            <div class="project-header">
                <div class="project-meta">
                    <h3>${project.title}</h3>
                    <p class="project-status">Posted ${getTimeAgo(project.createdAt)}</p>
                </div>
                <span class="badge badge-${project.status === 'open' ? 'active' : 'new'}">${project.status}</span>
            </div>
            <p class="project-description">${project.description.substring(0, 120)}...</p>
            <div class="project-stats">
                <div class="stat-item">
                    <span class="stat-label">Applications</span>
                    <span class="stat-value">${project.applicants?.length || 0}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Views</span>
                    <span class="stat-value">${project.views || 0}</span>
                </div>
            </div>
            <div class="project-footer">
                <button class="btn btn-outline btn-small" onclick="viewApplications('${project._id}')">View Applications</button>
                <button class="btn btn-primary btn-small" onclick="editProject('${project._id}')">Edit Project</button>
            </div>
        </div>
    `).join('');
}

// Apply to project
async function applyToProject(projectId) {
    const coverLetter = prompt('Please enter a brief cover letter for your application:');
    
    if (!coverLetter || coverLetter.trim() === '') {
        showDashboardNotification('Application cancelled', 'info');
        return;
    }

    try {
        const response = await applicationsAPI.create({
            projectId,
            coverLetter
        });

        if (response.success) {
            showDashboardNotification('Application submitted successfully!', 'success');
            // Refresh dashboard
            await loadDashboardData();
        }
    } catch (error) {
        showDashboardNotification(error.message || 'Failed to submit application', 'error');
    }
}

// View applications for a project
function viewApplications(projectId) {
    // In a real app, this would open a modal or navigate to applications page
    window.location.href = `applications.html?project=${projectId}`;
}

// Edit project
function editProject(projectId) {
    window.location.href = `edit-project.html?id=${projectId}`;
}

// Helper: Get time ago
function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Update application stats
function updateApplicationStats(applications) {
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        accepted: applications.filter(a => a.status === 'accepted').length
    };

    // Update stat cards if they exist
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const label = card.querySelector('p')?.textContent;
        const valueEl = card.querySelector('h3');
        
        if (label?.includes('Applications') && valueEl) {
            valueEl.textContent = stats.total;
        }
    });
}

// Update company stats
function updateCompanyStats(applications) {
    const stats = {
        totalApplicants: applications.length,
        newApplications: applications.filter(a => a.status === 'pending').length
    };

    // Update welcome section
    const welcomeDesc = document.querySelector('.welcome-section p');
    if (welcomeDesc) {
        welcomeDesc.textContent = `You have ${stats.newApplications} new applications`;
    }
}

// Show notification
function showDashboardNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// User menu dropdown
const userMenu = document.querySelector('.user-menu');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (userMenu && dropdownMenu) {
    let timeout;
    
    userMenu.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        dropdownMenu.style.display = 'block';
    });
    
    userMenu.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            dropdownMenu.style.display = 'none';
        }, 200);
    });

    // Handle dropdown menu clicks
    const dropdownLinks = dropdownMenu.querySelectorAll('a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.textContent.includes('Logout')) {
                e.preventDefault();
                authAPI.logout();
            }
        });
    });
}

// Quick actions functionality
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const actionText = this.querySelector('span:last-child').textContent;
        console.log('Action clicked:', actionText);
        
        // Handle different actions
        switch(actionText) {
            case 'Update Resume':
                alert('Opening resume upload dialog...');
                break;
            case 'Search Projects':
                window.location.href = 'browse-projects.html';
                break;
            case 'Schedule Interview':
                alert('Opening calendar...');
                break;
            case 'Get Tips':
                alert('Opening tips and resources...');
                break;
            case 'Post New Project':
                alert('Opening project creation form...');
                break;
            case 'Browse Students':
                alert('Opening student directory...');
                break;
            case 'View Analytics':
                alert('Opening analytics dashboard...');
                break;
            case 'Settings':
                alert('Opening settings...');
                break;
        }
    });
});

// Project application buttons
const applyButtons = document.querySelectorAll('.project-card .btn-primary');

applyButtons.forEach(btn => {
    if (btn.textContent.includes('Apply Now')) {
        btn.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const companyName = projectCard.querySelector('.company-name').textContent;
            
            if (confirm(`Apply for "${projectTitle}" at ${companyName}?`)) {
                // Simulate application
                this.textContent = 'Applied ✓';
                this.disabled = true;
                this.style.opacity = '0.6';
                
                showDashboardNotification('Application submitted successfully!');
            }
        });
    }
});

// View details buttons
const viewDetailsButtons = document.querySelectorAll('.btn-link, .btn-outline');

viewDetailsButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.textContent.includes('View')) {
            e.preventDefault();
            alert('Opening detailed view...');
        }
    });
});

// Activity items click
const activityItems = document.querySelectorAll('.activity-item');

activityItems.forEach(item => {
    item.addEventListener('click', function() {
        this.style.background = 'var(--bg-light)';
        setTimeout(() => {
            this.style.background = '';
        }, 300);
    });
});

// Event items click
const eventItems = document.querySelectorAll('.event-item');

eventItems.forEach(item => {
    item.addEventListener('click', function() {
        const eventTitle = this.querySelector('h4').textContent;
        alert(`Event: ${eventTitle}\n\nClick to view more details or add to calendar.`);
    });
});

// Table row click
const tableRows = document.querySelectorAll('.applications-table tbody tr');

tableRows.forEach(row => {
    row.addEventListener('click', function() {
        this.style.background = 'var(--bg-light)';
        setTimeout(() => {
            this.style.background = '';
        }, 300);
    });
});

// Notification system for dashboard
function showDashboardNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'dashboard-notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' ? 'var(--success-color)' : 'var(--primary-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Stats animation on load
const statValues = document.querySelectorAll('.stat-info h3');
statValues.forEach(stat => {
    const value = stat.textContent;
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        stat.style.transition = 'all 0.6s ease';
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
    }, 100);
});

// Welcome section animation
const welcomeSection = document.querySelector('.welcome-section');
if (welcomeSection) {
    welcomeSection.style.opacity = '0';
    welcomeSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        welcomeSection.style.transition = 'all 0.6s ease';
        welcomeSection.style.opacity = '1';
        welcomeSection.style.transform = 'translateY(0)';
    }, 200);
}

// Candidate cards for company dashboard
const candidateCards = document.querySelectorAll('.candidate-card');

candidateCards.forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            const candidateName = this.querySelector('h3').textContent;
            alert(`Viewing profile: ${candidateName}`);
        }
    });
});

// Contact buttons in candidate cards
const contactButtons = document.querySelectorAll('.candidate-card .btn-primary');

contactButtons.forEach(btn => {
    if (btn.textContent.includes('Contact')) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const candidateName = this.closest('.candidate-card').querySelector('h3').textContent;
            alert(`Opening message dialog with ${candidateName}...`);
        });
    }
});

// Edit project buttons
const editButtons = document.querySelectorAll('.company-project-card .btn-primary');

editButtons.forEach(btn => {
    if (btn.textContent.includes('Edit')) {
        btn.addEventListener('click', function() {
            const projectTitle = this.closest('.company-project-card').querySelector('h3').textContent;
            alert(`Editing project: ${projectTitle}`);
        });
    }
});

// View applications buttons
const viewAppButtons = document.querySelectorAll('.company-project-card .btn-outline');

viewAppButtons.forEach(btn => {
    if (btn.textContent.includes('View Applications')) {
        btn.addEventListener('click', function() {
            const projectCard = this.closest('.company-project-card');
            const appCount = projectCard.querySelector('.stat-item .stat-value').textContent;
            alert(`Viewing ${appCount} applications for this project...`);
        });
    }
});

// Smooth scroll for anchor links within dashboard
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

console.log('Dashboard functionality loaded! 📊');
