// Browse Projects Page Functionality

let allProjects = [];
let filteredProjects = [];

// Load projects from API on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    setupFilters();
    setupSearch();
});

// Load projects from API
async function loadProjects() {
    try {
        const response = await projectsAPI.getAll({ status: 'open' });
        if (response.success) {
            allProjects = response.data;
            filteredProjects = allProjects;
            renderProjects(filteredProjects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to existing static projects if API fails
        allProjects = Array.from(document.querySelectorAll('.project-card')).map(card => ({
            _id: card.dataset.id || Math.random().toString(),
            title: card.querySelector('h3')?.textContent || '',
            companyName: card.querySelector('.company-name')?.textContent || '',
            category: '',
            description: card.querySelector('p')?.textContent || '',
            location: 'Nijmegen, Netherlands',
            duration: '6 months',
            compensation: 'Negotiable',
            requiredSkills: []
        }));
        filteredProjects = allProjects;
    }
}

// Render projects to DOM
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6b7280;">No projects found matching your criteria.</p>';
        updateResultsCount(0);
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project._id}">
            <div class="project-header">
                <div>
                    <span class="project-category">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p class="company-name">${project.companyName}</p>
                </div>
                <button class="bookmark-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <p class="project-description">${project.description.substring(0, 150)}...</p>
            <div class="project-meta">
                <span>📍 ${project.location}</span>
                <span>⏰ ${project.duration}</span>
                <span>💰 ${project.compensation}</span>
            </div>
            <div class="project-skills">
                ${project.requiredSkills.slice(0, 3).map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
                ${project.requiredSkills.length > 3 ? `<span class="skill-tag">+${project.requiredSkills.length - 3}</span>` : ''}
            </div>
            <button class="btn btn-secondary btn-full" onclick="viewProject('${project._id}')">View Details</button>
        </div>
    `).join('');

    updateResultsCount(projects.length);
}

// View project details
function viewProject(projectId) {
    // In a real app, navigate to project detail page
    window.location.href = `project-details.html?id=${projectId}`;
}

// Update results count
function updateResultsCount(count) {
    const resultsHeader = document.querySelector('.results-header h2');
    if (resultsHeader) {
        resultsHeader.textContent = `${count} Project${count !== 1 ? 's' : ''} Available`;
    }
}

// Setup filter functionality
function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Clear all filters
    const clearFiltersBtn = document.querySelector('.filters-header .btn-link');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            applyFilters();
        });
    }
}

// Apply filters
function applyFilters() {
    const selectedFilters = {
        field: [],
        location: [],
        duration: [],
        compensation: [],
        companyType: []
    };

    // Collect selected filters
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const filterType = checkbox.name;
            const filterValue = checkbox.value;
            if (selectedFilters[filterType]) {
                selectedFilters[filterType].push(filterValue);
            }
        }
    });

    // Filter projects
    filteredProjects = allProjects.filter(project => {
        // Filter by field/category
        if (selectedFilters.field.length > 0) {
            if (!selectedFilters.field.includes(project.category)) return false;
        }

        // Filter by location
        if (selectedFilters.location.length > 0) {
            const isRemote = selectedFilters.location.includes('Remote');
            const isNijmegen = selectedFilters.location.includes('Nijmegen');
            if (isRemote && !project.remote) return false;
            if (isNijmegen && !project.location.includes('Nijmegen')) return false;
        }

        // Filter by duration
        if (selectedFilters.duration.length > 0) {
            if (!selectedFilters.duration.includes(project.duration)) return false;
        }

        // Filter by compensation
        if (selectedFilters.compensation.length > 0) {
            if (!selectedFilters.compensation.includes(project.compensation)) return false;
        }

        return true;
    });

    renderProjects(filteredProjects);
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const searchBtn = document.querySelector('.search-bar .btn-primary');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';

    if (!searchTerm) {
        filteredProjects = allProjects;
    } else {
        filteredProjects = allProjects.filter(project => {
            return project.title.toLowerCase().includes(searchTerm) ||
                   project.description.toLowerCase().includes(searchTerm) ||
                   project.companyName.toLowerCase().includes(searchTerm) ||
                   project.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
                   (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        });
    }

    renderProjects(filteredProjects);
}

// Filter functionality (keeping old code as fallback)
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
const projectCards = document.querySelectorAll('.project-card');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

function applyFilters() {
    const selectedFilters = {
        field: [],
        location: [],
        duration: [],
        compensation: [],
        companyType: []
    };

    // Collect selected filters
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const filterType = checkbox.name;
            const filterValue = checkbox.value;
            if (selectedFilters[filterType]) {
                selectedFilters[filterType].push(filterValue);
            }
        }
    });

    // Filter projects (in a real app, this would make an API call)
    console.log('Applied filters:', selectedFilters);
    
    // Update results count
    const resultsHeader = document.querySelector('.results-header h2');
    const visibleProjects = document.querySelectorAll('.project-card:not([style*="display: none"])').length;
    resultsHeader.textContent = `${visibleProjects} Projects Available`;
}

// Clear all filters
const clearFiltersBtn = document.querySelector('.filters-header .btn-link');
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        applyFilters();
    });
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-bar .btn');

if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        return;
    }

    console.log('Searching for:', query);
    
    // In a real application, this would make an API call
    // For now, we'll just filter the visible cards
    projectCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(query) || 
                       description.includes(query) || 
                       tags.some(tag => tag.includes(query));
        
        card.style.display = matches ? 'block' : 'none';
    });

    // Update results count
    const visibleProjects = document.querySelectorAll('.project-card:not([style*="display: none"])').length;
    document.querySelector('.results-header h2').textContent = `${visibleProjects} Projects Available`;
}

// Sort functionality
const sortSelect = document.getElementById('sortSelect');

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        console.log('Sorting by:', sortBy);
        
        // In a real application, this would make an API call
        // For demonstration, we'll just log it
        alert(`Sorting projects by: ${sortBy}`);
    });
}

// Save/Favorite functionality
const saveBtns = document.querySelectorAll('.save-btn');

saveBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (this.classList.contains('saved')) {
            this.classList.remove('saved');
            this.textContent = '♡';
            showNotification('Project removed from saved list');
        } else {
            this.classList.add('saved');
            this.textContent = '❤';
            showNotification('Project saved successfully!');
        }
    });
});

// Apply Now buttons
const applyBtns = document.querySelectorAll('.project-card .btn-primary');

applyBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const projectCard = this.closest('.project-card');
        const projectTitle = projectCard.querySelector('h3').textContent;
        
        // TEMPORARILY DISABLED - Login requirement on hold
        // In a real app, this would open an application modal or redirect
        // if (confirm(`Apply for "${projectTitle}"?\n\nYou need to be signed in to apply.`)) {
        //     window.location.href = 'login.html';
        // }
        
        alert(`Application for "${projectTitle}" submitted! (Demo mode - login disabled)`);
    });
});

// Pagination
const pageNumbers = document.querySelectorAll('.page-number');
const prevBtn = document.querySelector('.pagination .page-btn:first-child');
const nextBtn = document.querySelector('.pagination .page-btn:last-child');

let currentPage = 1;

pageNumbers.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.textContent === '...') return;
        
        pageNumbers.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        currentPage = parseInt(this.textContent);
        scrollToTop();
        loadPage(currentPage);
    });
});

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            scrollToTop();
            loadPage(currentPage);
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentPage++;
        updatePagination();
        scrollToTop();
        loadPage(currentPage);
    });
}

function updatePagination() {
    prevBtn.disabled = currentPage === 1;
    pageNumbers.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === currentPage) {
            btn.classList.add('active');
        }
    });
}

function loadPage(page) {
    console.log('Loading page:', page);
    // In a real app, this would fetch new projects from the API
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Browse projects page loaded! 🔍');
