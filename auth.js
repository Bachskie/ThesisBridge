// Authentication Page Functionality

// Account Type Toggle
const typeButtons = document.querySelectorAll('.type-btn');
const studentForm = document.getElementById('studentForm');
const companyForm = document.getElementById('companyForm');

if (typeButtons.length > 0) {
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            
            if (type === 'student') {
                studentForm.style.display = 'block';
                companyForm.style.display = 'none';
                // Update required fields
                updateRequiredFields(studentForm, true);
                updateRequiredFields(companyForm, false);
            } else {
                studentForm.style.display = 'none';
                companyForm.style.display = 'block';
                // Update required fields
                updateRequiredFields(studentForm, false);
                updateRequiredFields(companyForm, true);
            }
        });
    });
}

function updateRequiredFields(formSection, isRequired) {
    const inputs = formSection.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (isRequired) {
            input.setAttribute('required', '');
        } else {
            input.removeAttribute('required');
        }
    });
}

// Password Strength Indicator
const passwordInput = document.getElementById('password');
const strengthBar = document.querySelector('.strength-bar');

if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-bar';
        
        if (strength >= 80) {
            strengthBar.classList.add('strong');
        } else if (strength >= 50) {
            strengthBar.classList.add('medium');
        } else if (password.length > 0) {
            strengthBar.classList.add('weak');
        }
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
}

// Login Form Submission
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');
        
        console.log('Login attempt:', { email });
        
        // Simulate login
        showAuthNotification('Signing in...', 'info');
        
        setTimeout(() => {
            // Redirect based on email domain
            if (email.includes('company') || email.includes('corp')) {
                window.location.href = 'company-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        }, 1000);
    });
}

// Signup Form Submission
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validate password match
        if (password !== confirmPassword) {
            showAuthNotification('Passwords do not match!', 'error');
            return;
        }
        
        // Check password strength
        const strength = calculatePasswordStrength(password);
        if (strength < 50) {
            showAuthNotification('Please use a stronger password', 'error');
            return;
        }
        
        // Get account type
        const activeType = document.querySelector('.type-btn.active');
        const accountType = activeType ? activeType.getAttribute('data-type') : 'student';
        
        console.log('Signup data:', {
            type: accountType,
            data: Object.fromEntries(formData)
        });
        
        // Simulate signup
        showAuthNotification('Creating your account...', 'info');
        
        setTimeout(() => {
            showAuthNotification('Account created successfully!', 'success');
            
            setTimeout(() => {
                if (accountType === 'company') {
                    window.location.href = 'company-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            }, 1000);
        }, 1500);
    });
}

// Social Auth Buttons
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google-btn') ? 'Google' : 'LinkedIn';
        showAuthNotification(`Connecting with ${provider}...`, 'info');
        
        // In a real app, this would initiate OAuth flow
        setTimeout(() => {
            showAuthNotification(`${provider} authentication would happen here`, 'info');
        }, 1000);
    });
});

// Email validation
const emailInputs = document.querySelectorAll('input[type="email"]');

emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        const email = this.value;
        
        // Student email validation
        if (this.id === 'email' && studentForm && studentForm.style.display !== 'none') {
            if (email && !email.includes('.nl') && !email.includes('.edu')) {
                this.setCustomValidity('Please use your university email address');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        }
    });
});

// Notification system
function showAuthNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'auth-notification';
    notification.textContent = message;
    
    let bgColor;
    switch(type) {
        case 'success':
            bgColor = 'var(--success-color)';
            break;
        case 'error':
            bgColor = '#ef4444';
            break;
        case 'info':
        default:
            bgColor = 'var(--primary-color)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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

// Real-time validation feedback
const allInputs = document.querySelectorAll('.auth-form input, .auth-form select');

allInputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.validity.valid) {
            this.style.borderColor = 'var(--success-color)';
        } else if (this.value.length > 0) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });
    
    input.addEventListener('blur', function() {
        if (this.value.length === 0) {
            this.style.borderColor = 'var(--border-color)';
        }
    });
});

// Prevent multiple form submissions
let isSubmitting = false;

document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', function() {
        if (isSubmitting) {
            return false;
        }
        isSubmitting = true;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
        }
        
        setTimeout(() => {
            isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }, 3000);
    });
});

console.log('Authentication functionality loaded! 🔐');
