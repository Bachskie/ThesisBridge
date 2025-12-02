// Student Dashboard - Load recommended projects from projects.json

async function loadRecommendedProjects() {
    try {
        const response = await fetch('projects.json');
        const allProjects = await response.json();
        
        // Get first 3 projects as recommendations
        const recommended = allProjects.slice(0, 3);
        
        const projectsList = document.querySelector('.projects-list');
        if (!projectsList) return;
        
        projectsList.innerHTML = recommended.map((project, index) => {
            const badges = index === 0 ? '<span class="badge badge-new">New</span>' : 
                          index === 1 ? '<span class="badge badge-match">95% Match</span>' : '';
            
            return `
                <div class="project-card">
                    <div class="project-header">
                        <div class="company-logo">${project.icon}</div>
                        <div class="project-meta">
                            <h3>${project.title}</h3>
                            <p class="company-name">${project.company}</p>
                        </div>
                        ${badges}
                    </div>
                    <p class="project-description">${project.description.substring(0, 120)}...</p>
                    <div class="project-tags">
                        ${project.skills.slice(0, 3).map(skill => 
                            `<span class="tag">${skill}</span>`
                        ).join('')}
                    </div>
                    <div class="project-footer">
                        <div class="project-info">
                            <span>📍 ${project.location}</span>
                            <span>💰 ${project.compensation}</span>
                            <span>⏱️ ${project.duration}</span>
                        </div>
                        <button class="btn btn-primary btn-small" onclick="viewProject('${project.id}')">Apply Now</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading recommended projects:', error);
    }
}

function viewProject(projectId) {
    window.location.href = `browse-projects.html?project=${projectId}`;
}

// Load projects when page loads
if (document.querySelector('.projects-list')) {
    document.addEventListener('DOMContentLoaded', loadRecommendedProjects);
}
