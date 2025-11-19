// Dashboard JavaScript Functionality

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
