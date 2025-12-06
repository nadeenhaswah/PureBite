// Dashboard functionality
let currentForms = [];
let formsToDelete = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupEventListeners();
});

// Load dashboard data
function loadDashboard() {
    loadForms();
    updateStats();
    
    // Set current user name
    const currentUser = getCurrentUser();
    if(currentUser) {
        document.getElementById('current-user').textContent = currentUser.username || 'Admin';
    }
}

// Load forms into table
function loadForms() {
    currentForms = getAllForms();
    const tbody = document.getElementById('formsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if(currentForms.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('formsTable').style.display = 'none';
        return;
    }
    
    document.getElementById('formsTable').style.display = 'table';
    emptyState.style.display = 'none';
    
    let tableHTML = '';
    
    currentForms.forEach((form, index) => {
        const createdDate = new Date(form.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const categoryBadge = getCategoryBadge(form.category);
        
        tableHTML += `
            <tr data-form-id="${form.id}" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">
                    <span class="text-muted small">${form.id.substring(0, 8)}...</span>
                </td>
                <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">
                    <strong>${form.title || 'Untitled Form'}</strong>
                    ${form.description ? `<br><small class="text-muted">${truncateText(form.description, 50)}</small>` : ''}
                </td>
                <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">
                    <span class="badge bg-light text-dark">${form.questions.length} questions</span>
                </td>
                
                <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">
                    <div class="d-flex align-items-center">
                        <span class="status-badge ${form.status === 'active' ? 'status-active' : 'status-inactive'} me-2">
                            ${form.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <label class="toggle-switch">
                            <input type="checkbox" ${form.status === 'active' ? 'checked' : ''} 
                                onchange="toggleFormStatus('${form.id}', this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </td>
                <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">
                    <small class="text-muted">${formattedDate}</small>
                </td>
                <td class="px-4 py-4 text-center">
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-success btn-sm rounded" onclick="viewForm('${form.id}')">View</button>
                        <button class="btn btn-warning btn-sm rounded" onclick="editForm('${form.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm rounded" onclick="showDeleteModal('${form.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = tableHTML;
}

// Get category badge
function getCategoryBadge(category) {
    const categories = {
        'weight-loss': { label: 'Weight Loss', color: 'var(--accent-color)' },
        'weight-gain': { label: 'Weight Gain', color: 'var(--secondary-color)' },
        'diabetes': { label: 'Diabetes', color: '#dc3545' },
        'general': { label: 'General', color: '#6c757d' },
        'habits': { label: 'Habits', color: '#17a2b8' }
    };
    
    const cat = categories[category] || { label: 'Uncategorized', color: '#6c757d' };
    
    return `<span class="badge" style="background-color: ${cat.color}; color: white;">${cat.label}</span>`;
}

// Truncate text
function truncateText(text, maxLength) {
    if(text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Update statistics
function updateStats() {
    const forms = currentForms;
    
    const totalForms = forms.length;
    const activeForms = forms.filter(f => f.status === 'active').length;
    const inactiveForms = forms.filter(f => f.status === 'inactive').length;
    
    let totalQuestions = 0;
    forms.forEach(form => {
        totalQuestions += form.questions.length;
    });
    
    document.getElementById('total-forms').textContent = totalForms;
    document.getElementById('active-forms').textContent = activeForms;
    document.getElementById('inactive-forms').textContent = inactiveForms;
    document.getElementById('total-questions').textContent = totalQuestions;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchForms');
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            filterForms(this.value.toLowerCase());
        });
    }
    
    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteForm);
    }
    
    // Edit form button in view modal
    const editFormBtn = document.getElementById('editFormBtn');
    if(editFormBtn) {
        editFormBtn.addEventListener('click', function() {
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
            viewModal.hide();
            
            if(formsToDelete) {
                editForm(formsToDelete);
            }
        });
    }
}

// Filter forms based on search
function filterForms(searchTerm) {
    const rows = document.querySelectorAll('#formsTableBody tr');
    let hasResults = false;
    
    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const description = row.cells[1].querySelector('small')?.textContent.toLowerCase() || '';
        const category = row.cells[3].textContent.toLowerCase();
        
        if(title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
            hasResults = true;
        } else {
            row.style.display = 'none';
        }
    });
    
    const emptyState = document.getElementById('emptyState');
    if(!hasResults && searchTerm) {
        emptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h4>No Matching Forms</h4>
            <p class="text-muted">No forms found matching "${searchTerm}"</p>
            <button class="btn btn-primary" onclick="clearSearch()">
                <i class="fas fa-times me-1"></i> Clear Search
            </button>
        `;
        emptyState.style.display = 'block';
    } else if(!hasResults) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Clear search
function clearSearch() {
    document.getElementById('searchForms').value = '';
    filterForms('');
    loadForms();
}

// Refresh forms
function refreshForms() {
    loadForms();
    updateStats();
    
    // Show refresh feedback
    const refreshBtn = document.querySelector('[onclick="refreshForms()"]');
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-check me-1"></i> Refreshed';
    refreshBtn.classList.remove('btn-outline-primary');
    refreshBtn.classList.add('btn-success');
    
    setTimeout(() => {
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.classList.remove('btn-success');
        refreshBtn.classList.add('btn-outline-primary');
    }, 1500);
}

// Toggle form status
function toggleFormStatus(formId, isActive) {
    const status = isActive ? 'active' : 'inactive';
    const success = updateFormStatus(formId, status);
    
    if(success) {
        // Update the badge in the table
        const row = document.querySelector(`tr[data-form-id="${formId}"]`);
        if(row) {
            const badge = row.querySelector('.status-badge');
            badge.textContent = isActive ? 'Active' : 'Inactive';
            badge.className = `status-badge ${isActive ? 'status-active' : 'status-inactive'} me-2`;
        }
        
        updateStats();
        
        // Show notification
        showNotification(`Form status updated to ${status}`, 'success');
    } else {
        showNotification('Failed to update form status', 'error');
        
        // Revert toggle
        const toggle = document.querySelector(`tr[data-form-id="${formId}"] input[type="checkbox"]`);
        if(toggle) {
            toggle.checked = !isActive;
        }
    }
}

// Show delete confirmation modal
function showDeleteModal(formId) {
    const form = currentForms.find(f => f.id === formId);
    if(!form) return;
    
    formsToDelete = formId;
    document.getElementById('deleteFormTitle').textContent = form.title || 'Untitled Form';
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete form
function deleteForm() {
    if(!formsToDelete) return;
    
    const success = deleteFormFromStorage(formsToDelete);
    
    if(success) {
        // Remove from table
        const row = document.querySelector(`tr[data-form-id="${formsToDelete}"]`);
        if(row) {
            row.remove();
        }
        
        // Update stats
        currentForms = currentForms.filter(f => f.id !== formsToDelete);
        updateStats();
        
        // Show notification
        showNotification('Form deleted successfully', 'success');
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
        
        // Check if no forms left
        if(currentForms.length === 0) {
            document.getElementById('formsTable').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
        }
    } else {
        showNotification('Failed to delete form', 'error');
    }
    
    formsToDelete = null;
}

// View form details
function viewForm(formId) {
    const form = currentForms.find(f => f.id === formId);
    if(!form) return;
    
    const modalBody = document.getElementById('viewModalBody');
    
    // Calculate statistics
    const stats = getFormStatistics(formId);
    const categoryInfo = getCategoryInfo(form.category);
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h4>${form.title || 'Untitled Form'}</h4>
                ${form.description ? `<p class="text-muted">${form.description}</p>` : ''}
                
                <div class="row mt-4">
                    <div class="col-md-6">
                        <h6>Form Details</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <i class="fas fa-hashtag me-2 text-muted"></i>
                                <strong>ID:</strong> ${form.id}
                            </li>
                            
                            <li class="mb-2">
                                <i class="fas fa-calendar me-2 text-muted"></i>
                                <strong>Created:</strong> ${new Date(form.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-toggle-${form.status === 'active' ? 'on' : 'off'} me-2 text-muted"></i>
                                <strong>Status:</strong> 
                                <span class="status-badge ${form.status === 'active' ? 'status-active' : 'status-inactive'}">
                                    ${form.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="col-md-6">
                        <h6>Statistics</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <i class="fas fa-question-circle me-2 text-muted"></i>
                                <strong>Questions:</strong> ${form.questions.length}
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-chart-bar me-2 text-muted"></i>
                                <strong>Score Ranges:</strong> ${form.ranges.length}
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-users me-2 text-muted"></i>
                                <strong>Submissions:</strong> ${stats.totalSubmissions}
                            </li>
                            
                        </ul>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6>Questions Preview</h6>
                    <div class="list-group" style="max-height: 200px; overflow-y: auto;">
                        ${form.questions.slice(0, 5).map((q, index) => `
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <span>${index + 1}. ${truncateText(q.text || 'Question without text', 60)}</span>
                                    <span class="badge bg-light text-dark">${q.type}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${form.questions.length > 5 ? `<p class="text-muted mt-2">+ ${form.questions.length - 5} more questions</p>` : ''}
                </div>
            </div>
            
            
        </div>
    `;
    
    formsToDelete = formId;
    
    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    viewModal.show();
}

// Get category info
function getCategoryInfo(category) {
    const categories = {
        'weight-loss': { label: 'Weight Loss', color: 'var(--accent-color)' },
        'weight-gain': { label: 'Weight Gain', color: 'var(--secondary-color)' },
        'diabetes': { label: 'Diabetes', color: '#dc3545' },
        'general': { label: 'General', color: '#6c757d' },
        'habits': { label: 'Habits', color: '#17a2b8' }
    };
    
    return categories[category] || { label: 'Uncategorized', color: '#6c757d' };
}

// Copy form URL
function copyFormUrl(formId) {
    const input = document.getElementById(`formUrl-${formId}`);
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(input.value).then(() => {
        showNotification('Form URL copied to clipboard', 'success');
    });
}

// Edit form
function editForm(formId) {
    // Store the form ID to edit
    sessionStorage.setItem('editFormId', formId);
    
    // Redirect to form builder
    window.location.href = 'index.html';
}

// Preview form for patient
function previewFormForPatient(formId) {
    // Store the form ID for preview
    sessionStorage.setItem('previewFormId', formId);
    
    // Open in new tab
    window.open(`fill-form.html?id=${formId}`, '_blank');
}

// View submissions
function viewSubmissions(formId) {
    // TODO: Implement submissions view
    showNotification('Submissions view coming soon!', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification-toast');
    if(existingNotification) {
        existingNotification.remove();
    }
    
    const typeClasses = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    };
    
    const icon = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const notificationHTML = `
        <div class="notification-toast position-fixed bottom-0 end-0 m-3" style="z-index: 1050;">
            <div class="toast show" role="alert">
                <div class="toast-header text-white ${typeClasses[type] || 'bg-info'}">
                    <i class="fas fa-${icon[type] || 'info-circle'} me-2"></i>
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close btn-close-white" onclick="this.parentElement.parentElement.parentElement.remove()"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        const notification = document.querySelector('.notification-toast');
        if(notification) {
            notification.remove();
        }
    }, 3000);
}