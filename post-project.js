// Post New Project functionality

// Open project creation modal
function openPostProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content post-project-modal">
            <div class="modal-header">
                <h2>Post New Project</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <form id="postProjectForm" class="modal-body">
                <div class="form-group">
                    <label for="projectTitle">Project Title *</label>
                    <input type="text" id="projectTitle" required placeholder="e.g., AI-Powered Customer Service Analysis">
                </div>

                <div class="form-group">
                    <label for="projectDescription">Description *</label>
                    <textarea id="projectDescription" rows="4" required placeholder="Describe the research question or challenge you want students to explore..."></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="projectCategory">Category *</label>
                        <select id="projectCategory" required>
                            <option value="">Select category...</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="IoT">IoT</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="AI">AI</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="projectDuration">Duration *</label>
                        <select id="projectDuration" required>
                            <option value="">Select duration...</option>
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                            <option value="9 months">9 months</option>
                            <option value="12 months">12 months</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="projectSkills">Required Skills (comma-separated) *</label>
                    <input type="text" id="projectSkills" required placeholder="e.g., Python, Machine Learning, NLP">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="projectLocation">Location</label>
                        <input type="text" id="projectLocation" value="Nijmegen, Netherlands">
                    </div>

                    <div class="form-group">
                        <label for="projectCompensation">Compensation</label>
                        <select id="projectCompensation">
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Negotiable">Negotiable</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="projectStartDate">Start Date *</label>
                        <input type="date" id="projectStartDate" required>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="projectRemote">
                            Remote work possible
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="projectTags">Tags (comma-separated, optional)</label>
                    <input type="text" id="projectTags" placeholder="e.g., research, innovation, startup">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Post Project</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('projectStartDate').min = today;

    // Handle form submission
    document.getElementById('postProjectForm').addEventListener('submit', handlePostProject);
}

// Handle project posting
async function handlePostProject(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        category: document.getElementById('projectCategory').value,
        duration: document.getElementById('projectDuration').value,
        requiredSkills: document.getElementById('projectSkills').value.split(',').map(s => s.trim()),
        location: document.getElementById('projectLocation').value,
        compensation: document.getElementById('projectCompensation').value,
        startDate: document.getElementById('projectStartDate').value,
        remote: document.getElementById('projectRemote').checked,
        tags: document.getElementById('projectTags').value.split(',').map(s => s.trim()).filter(t => t)
    };

    try {
        const response = await projectsAPI.create(formData);
        
        if (response.success) {
            closeModal();
            showDashboardNotification('Project posted successfully!', 'success');
            // Reload dashboard to show new project
            await loadDashboardData();
        }
    } catch (error) {
        showDashboardNotification(error.message || 'Failed to post project', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Add event listeners for Post Project buttons
document.addEventListener('DOMContentLoaded', () => {
    // Find all "Post New Project" buttons
    const postProjectButtons = document.querySelectorAll('button');
    postProjectButtons.forEach(btn => {
        if (btn.textContent.includes('Post New Project')) {
            btn.addEventListener('click', openPostProjectModal);
        }
    });
});

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    border-bottom: 2px solid var(--border-color);
}

.modal-header h2 {
    margin: 0;
    color: var(--text-dark);
}

.modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-gray);
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: var(--bg-light);
    color: var(--text-dark);
}

.modal-body {
    padding: 2rem;
}

.modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding: 1.5rem 2rem;
    border-top: 2px solid var(--border-color);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="date"]:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group input[type="checkbox"] {
    margin-right: 0.5rem;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}
`;
document.head.appendChild(modalStyles);
