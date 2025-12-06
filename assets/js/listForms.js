// Dashboard functionality
let currentForms = [];
let formsToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    loadForms();
});

// Load forms into table
function loadForms() {
    currentForms = getAllForms();
    const tbody = document.getElementById('formsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if(!tbody) return;

    if(currentForms.length === 0) {
        tbody.innerHTML = '';
        if(emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if(emptyState) emptyState.style.display = 'none';
    
    let tableHTML = '';
    
    currentForms.forEach((form) => {
        const stats = getFormStatistics(form.id);
        
        tableHTML += `
            <tr data-form-id="${form.id}" class="bg-white border-b align-middle">
                <td class="px-4 py-3 text-center text-muted small">${form.id.substring(0, 8)}...</td>
                <td class="px-4 py-3 text-center fw-bold text-dark">
                    ${form.title}
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="badge bg-light text-dark border">${form.questions.length} Questions</span>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="badge ${form.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                        ${form.status}
                    </span>
                </td>
                <td class="px-4 py-3 text-center text-muted">
                    ${new Date(form.createdAt).toLocaleDateString()}
                </td>
                <td class="px-4 py-3 text-center">
                    <button class="btn btn-info btn-sm text-white me-1" title="View Submissions" onclick="viewSubmissions('${form.id}')">
                        <i class="fas fa-eye"></i> (${stats.totalSubmissions})
                    </button>
                    <button class="btn btn-warning btn-sm text-white me-1" title="Edit" onclick="editForm('${form.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm text-white" title="Delete" onclick="confirmDelete('${form.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = tableHTML;
}

// Edit form
window.editForm = function(formId) {
    sessionStorage.setItem('editFormId', formId);
    window.location.href = 'addForm.html';
};

// Delete Confirmation
window.confirmDelete = function(formId) {
    formsToDelete = formId;
    const form = currentForms.find(f => f.id === formId);
    const titleSpan = document.getElementById('deleteFormTitle');
    if(titleSpan) titleSpan.textContent = form ? form.title : 'Form';
    
    const deleteModalEl = document.getElementById('deleteModal');
    if(deleteModalEl) {
        const deleteModal = new bootstrap.Modal(deleteModalEl);
        deleteModal.show();
        
        const confirmBtn = document.getElementById('confirmDelete');
        // Prevent stacking event listeners
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        document.getElementById('confirmDelete').onclick = function() {
            if(deleteFormFromStorage(formsToDelete)) {
                loadForms(); 
                deleteModal.hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        };
    }
};

// View Submissions Logic
window.viewSubmissions = function(formId) {
    const submissions = getAllSubmissionsForForm(formId);
    const form = getFormById(formId);
    
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Submissions: ${form.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            ${submissions.length === 0 ? '<p class="text-center text-muted my-3">No submissions yet.</p>' : `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.map(sub => `
                            <tr>
                                <td>${sub.username || sub.userId}</td>
                                <td>${new Date(sub.submittedAt).toLocaleDateString()}</td>
                                <td><span class="fw-bold">${sub.score.percentage}%</span></td>
                                <td><span class="badge bg-info text-white">${sub.score.range ? sub.score.range.label : '-'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            `}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;
    
    const viewModalEl = document.getElementById('viewModal');
    if(viewModalEl) {
        viewModalEl.querySelector('.modal-content').innerHTML = modalContent;
        const modal = new bootstrap.Modal(viewModalEl);
        modal.show();
    }
};