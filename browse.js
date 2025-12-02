// Browse Projects Page - Load from JSON file

let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 6;

// Load projects from JSON file
async function loadProjects() {
    try {
        console.log('Loading projects from projects.json...');
        const response = await fetch('projects.json');
        const projects = await response.json();
        
        // Check for additional projects in localStorage (user-created)
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            const parsedLocal = JSON.parse(localProjects);
            // Merge with default projects (remove duplicates)
            const combinedProjects = [...projects];
            parsedLocal.forEach(localProject => {
                if (!projects.find(p => p.id === localProject.id)) {
                    combinedProjects.push(localProject);
                }
            });
            allProjects = combinedProjects;
        } else {
            allProjects = projects;
        }
        
        console.log('Loaded projects:', allProjects.length);
        filteredProjects = allProjects;
        renderProjects(filteredProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.querySelector('.projects-grid').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: red;">Error loading projects. Please check console.</p>';
    }
}

// Render projects to the page
function renderProjects(projects) {
    console.log('Rendering', projects.length, 'projects');
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }

    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-gray);">No projects found matching your criteria.</p>';
        updateResultsCount(0);
        return;
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    // Render project cards
    projectsGrid.innerHTML = paginatedProjects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-header">
                <div class="project-icon">${project.icon}</div>
                <div class="project-title-area">
                    <span class="project-category">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p class="company-name">${project.company}</p>
                </div>
            </div>
            <p class="project-description">${project.description.substring(0, 150)}...</p>
            <div class="project-meta">
                <span>📍 ${project.location}</span>
                <span>⏰ ${project.duration}</span>
                <span>💰 ${project.compensation}</span>
            </div>
            <div class="project-skills">
                ${project.skills.slice(0, 3).map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
                ${project.skills.length > 3 ? `<span class="skill-tag">+${project.skills.length - 3}</span>` : ''}
            </div>
            <button class="btn btn-primary btn-full" onclick="applyToProject('${project.id}', '${project.title}')">Apply Now</button>
        </div>
    `).join('');

    updateResultsCount(projects.length);
    updatePaginationControls(projects.length);
}

// Update results count
function updateResultsCount(count) {
    const resultsHeader = document.querySelector('.results-header h2');
    if (resultsHeader) {
        resultsHeader.innerHTML = `Projects <span class="results-count">${count} Available</span>`;
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('#searchInput');
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

// Perform search - searches across title, description, company, category, and skills
function performSearch() {
    const searchInput = document.querySelector('#searchInput');
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';

    if (!searchTerm) {
        filteredProjects = allProjects;
    } else {
        filteredProjects = allProjects.filter(project => {
            // Search in multiple fields
            const searchableText = [
                project.title,
                project.description,
                project.company,
                project.category,
                project.location,
                ...project.skills
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
    }

    currentPage = 1;
    renderProjects(filteredProjects);
}

// Setup filter functionality
function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Clear all filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            applyFilters();
        });
    }
}

// Apply filters based on selected categories
function applyFilters() {
    const selectedCategories = [];
    
    document.querySelectorAll('.filter-options input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.name === 'field') {
            selectedCategories.push(checkbox.value);
        }
    });

    if (selectedCategories.length === 0) {
        filteredProjects = allProjects;
    } else {
        filteredProjects = allProjects.filter(project => 
            selectedCategories.includes(project.category)
        );
    }

    currentPage = 1;
    renderProjects(filteredProjects);
}

// Setup pagination
function setupPagination() {
    const prevBtn = document.querySelector('.pagination .page-btn:first-child');
    const nextBtn = document.querySelector('.pagination .page-btn:last-child');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProjects(filteredProjects);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProjects(filteredProjects);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// Update pagination controls
function updatePaginationControls(totalProjects) {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const prevBtn = document.querySelector('.pagination .page-btn:first-child');
    const nextBtn = document.querySelector('.pagination .page-btn:last-child');
    const pageNumbers = document.querySelector('.page-numbers');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    if (pageNumbers) {
        let pagesHTML = '';
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            pagesHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        pageNumbers.innerHTML = pagesHTML;
    }
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderProjects(filteredProjects);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Apply to project
function applyToProject(projectId, projectTitle) {
    alert(`Application submitted for: ${projectTitle}\n\nThis is a demo. In production, this would:\n- Save your application\n- Notify the company\n- Add to your applications list`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Browse page initializing...');
    loadProjects();
    setupSearch();
    setupFilters();
    setupPagination();
});
