document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing User Form List...");
    // Slight delay to ensure DOM is ready
    setTimeout(loadAvailableForms, 100);
});

function loadAvailableForms() {
    const container = document.querySelector('.dashboard-container');
    
    if (!container) {
        console.error("Error: .dashboard-container not found!");
        return;
    }

    try {
        // Ensure helper function exists
        if (typeof getAllForms !== 'function') {
            throw new Error("getAllForms function is missing. Check formStorage.js");
        }

        const allForms = getAllForms(); 
        console.log("Forms loaded from storage:", allForms);
        
        // Filter only ACTIVE forms
        const activeForms = Array.isArray(allForms) ? allForms.filter(f => f && f.status === 'active') : [];
        
        // Build HTML
        let html = `
            <div class="container mt-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                     <h2 class="text-2xl font-bold text-gray-800">Available Forms</h2>
                </div>
                <div class="row">
        `;
        
        if(activeForms.length === 0) {
            html += `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-clipboard-list fa-3x text-gray-300 mb-3"></i>
                    <p class="text-gray-500">No active forms available.</p>
                </div>
            `;
        } else {
            activeForms.forEach(form => {
                const questionCount = form.questions ? form.questions.length : 0;
                const desc = form.description || 'No description provided.';
                const shortDesc = desc.length > 90 ? desc.substring(0, 90) + '...' : desc;

                html += `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-md  hover:shadow-lg hover:h-190 transition-all "style=" border-left: 0 solid #EE7229; transition: 0.3s;"
     onmouseover="this.style.borderLeft='4px solid #EE7229'; "
     onmouseout="this.style.borderLeft='0 solid #EE7229'; ">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title fw-bold text-[#EE7229] mb-2">${form.title || 'Untitled'}</h5>
                                <p class="card-text text-muted flex-grow-1">
                                    ${shortDesc}
                                </p>
                                <a href="fill-form.html?id=${form.id}" class="btn text-white mt-3" style="background-color: #EE7229;">
                                    Start Assessment <i class="fas fa-arrow-right ms-2"></i>
                                </a>
                            </div>
                            <div class="card-footer bg-transparent text-muted small">
                                <i class="fas fa-list-ul me-1"></i> ${questionCount} Questions
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `</div></div>`;
        
        // IMPORTANT: Replace the loading spinner
        container.innerHTML = html;

    } catch (error) {
        console.error("Error building form list:", error);
        container.innerHTML = `
            <div class="alert alert-danger text-center m-5">
                <h4>Error Loading Forms</h4>
                <p>Please try clearing your browser cache.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}