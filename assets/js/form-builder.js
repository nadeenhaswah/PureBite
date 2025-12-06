let currentStep = 1;
let formData = {
    id: generateId(),
    title: '',
    description: '',
    status: 'active',
    category: 'general',
    questions: [],
    ranges: [],
    createdAt: new Date().toISOString()
};

document.addEventListener('DOMContentLoaded', function() {
    checkForEditMode();
    loadStep(currentStep);
    setupEventListeners();
});

function checkForEditMode() {
    const editFormId = sessionStorage.getItem('editFormId');
    if(editFormId) {
        const existingForm = getFormById(editFormId);
        if(existingForm) {
            console.log("Editing form:", existingForm.title);
            formData = JSON.parse(JSON.stringify(existingForm)); 
        }
    }
}

function generateId() {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadStep(step) {
    const content = document.getElementById('wizard-content');
    updateActiveStep(step);
    
    switch(step) {
        case 1: content.innerHTML = getStep1Content(); break;
        case 2: content.innerHTML = getStep2Content(); loadQuestions(); break;
        case 3: content.innerHTML = getStep3Content(); loadRanges(); break;
        case 4: content.innerHTML = getStep4Content(); previewForm(); break;
    }
    updateNavigationButtons();
}

function updateActiveStep(step) {
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
        if(parseInt(s.dataset.step) <= step) s.classList.add('active');
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const saveBtn = document.getElementById('save-btn');
    
    if(prevBtn) {
        prevBtn.disabled = currentStep === 1;
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    }
    
    if(nextBtn && saveBtn) {
        if(currentStep === 4) {
            nextBtn.style.display = 'none';
            saveBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            saveBtn.style.display = 'none';
            nextBtn.textContent = currentStep === 3 ? 'Preview' : 'Next';
        }
    }
}

function setupEventListeners() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const saveBtn = document.getElementById('save-btn');

    if(prevBtn) prevBtn.addEventListener('click', () => { if(currentStep > 1) { currentStep--; loadStep(currentStep); } });
    if(nextBtn) nextBtn.addEventListener('click', () => { if(validateStep(currentStep) && currentStep < 4) { currentStep++; loadStep(currentStep); } });
    if(saveBtn) saveBtn.addEventListener('click', saveForm);
    
    document.addEventListener('input', function(e) {
        if(e.target.matches('#form-title')) formData.title = e.target.value;
        else if(e.target.matches('#form-description')) formData.description = e.target.value;
        else if(e.target.matches('#form-category')) formData.category = e.target.value;
    });
}

function validateStep(step) {
    if(step === 1) {
        const title = document.getElementById('form-title').value;
        if(!title || !title.trim()) {
            Swal.fire('Error', 'Please enter a form title.', 'warning');
            return false;
        }
    } else if (step === 2 && formData.questions.length === 0) {
        Swal.fire('Error', 'Please add at least one question.', 'warning');
        return false;
    }
    return true;
}

// === TEMPLATES ===
function getStep1Content() {
    return `
        <div class="step-content">
            <h4 class="mb-4 text-[#EE7229]">Basic Info</h4>
            <div class="mb-3"><label class="fw-bold">Title *</label><input type="text" class="form-control" id="form-title" value="${formData.title}" required></div>
            <div class="mb-3"><label class="fw-bold">Description</label><textarea class="form-control" id="form-description" rows="3">${formData.description}</textarea></div>
            <div class="mb-3"><label class="fw-bold">Category</label>
                <select class="form-select" id="form-category">
                    <option value="general" ${formData.category==='general'?'selected':''}>General</option>
                    <option value="weight-loss" ${formData.category==='weight-loss'?'selected':''}>Weight Loss</option>
                    <option value="diabetes" ${formData.category==='diabetes'?'selected':''}>Diabetes</option>
                    <option value="habits" ${formData.category==='habits'?'selected':''}>Habits</option>
                </select>
            </div>
        </div>`;
}

function getStep2Content() {
    return `<div class="step-content"><div class="d-flex justify-content-between mb-3"><h4 class="text-[#EE7229]">Questions</h4><button class="btn btn-primary btn-sm" onclick="addQuestion()">+ Add Question</button></div><div id="questions-container"></div></div>`;
}

function getStep3Content() {
    return `<div class="step-content"><h4 class="text-[#EE7229] mb-3">Scoring Rules</h4><button class="btn btn-primary btn-sm mb-3" onclick="addRange()">+ Add Range</button><div id="ranges-container"></div></div>`;
}

function getStep4Content() {
    return `<div class="step-content"><h4>Preview</h4><div class="card p-4"><h2>${formData.title}</h2><p>${formData.description}</p><hr><div id="preview-questions"></div></div><div class="form-check form-switch mt-3"><input class="form-check-input" type="checkbox" id="status-toggle" ${formData.status==='active'?'checked':''} onchange="toggleStatus(this.checked)"><label>Active</label></div></div>`;
}

// --- Question Logic ---
function addQuestion() {
    formData.questions.push({ id: 'q_'+Date.now(), text: '', type: 'text', required: true, options: [], correctAnswer: '' });
    renderQuestion(formData.questions[formData.questions.length-1]);
}

function renderQuestion(q) {
    const index = formData.questions.indexOf(q);
    const div = document.createElement('div');
    div.className = 'card mb-3 shadow-sm';
    div.innerHTML = `
        <div class="card-header d-flex justify-content-between"><strong>Q${index+1}</strong><button class="btn btn-danger btn-sm" onclick="removeQuestion('${q.id}')">x</button></div>
        <div class="card-body">
            <input type="text" class="form-control mb-2" placeholder="Question Text" value="${q.text}" oninput="updateQ('${q.id}', 'text', this.value)">
            <select class="form-select mb-2" onchange="changeType('${q.id}', this.value)">
                <option value="text" ${q.type==='text'?'selected':''}>Text</option>
                <option value="number" ${q.type==='number'?'selected':''}>Number</option>
                <option value="radio" ${q.type==='radio'?'selected':''}>Radio</option>
                <option value="select" ${q.type==='select'?'selected':''}>Select</option>
            </select>
            ${['radio','select'].includes(q.type) ? renderOptionsUI(q) : ''}
        </div>`;
    document.getElementById('questions-container').appendChild(div);
}

function renderOptionsUI(q) {
    let html = `<div class="bg-light p-2 rounded"><label>Options</label><div id="opts-${q.id}">`;
    q.options.forEach(o => html += `<div class="input-group mb-1"><input class="form-control" value="${o.text}" oninput="updateOpt('${q.id}','${o.id}',this.value)"><button class="btn btn-outline-danger" onclick="remOpt('${q.id}','${o.id}')">x</button></div>`);
    html += `</div><button class="btn btn-sm btn-secondary mt-1" onclick="addOpt('${q.id}')">+ Option</button>
    <div class="mt-2"><label>Correct Answer:</label><select class="form-select" onchange="updateQ('${q.id}','correctAnswer',this.value)"><option value="">None</option>`;
    q.options.forEach(o => html += `<option value="${o.id}" ${q.correctAnswer===o.id?'selected':''}>${o.text}</option>`);
    html += `</select></div></div>`;
    return html;
}

function loadQuestions() { document.getElementById('questions-container').innerHTML = ''; formData.questions.forEach(renderQuestion); }
function removeQuestion(id) { formData.questions = formData.questions.filter(q => q.id !== id); loadQuestions(); }
function updateQ(id, field, val) { const q = formData.questions.find(x => x.id === id); if(q) q[field] = val; }
function changeType(id, val) { const q = formData.questions.find(x => x.id === id); if(q) { q.type = val; loadQuestions(); } }
function addOpt(id) { const q = formData.questions.find(x => x.id === id); if(q) { q.options.push({id:'o_'+Date.now(), text:'Opt'}); loadQuestions(); } }
function remOpt(qid, oid) { const q = formData.questions.find(x => x.id === qid); if(q) { q.options = q.options.filter(o => o.id !== oid); loadQuestions(); } }
function updateOpt(qid, oid, val) { const q = formData.questions.find(x => x.id === qid); const o = q.options.find(op => op.id === oid); if(o) o.text = val; } // Note: Select options need re-render to update text in dropdown, doing lazy way here for brevity or trigger re-render on blur.

// --- Range Logic ---
function addRange() { formData.ranges.push({id:'r_'+Date.now(), min:0, max:100, label:'', description:''}); loadRanges(); }
function loadRanges() { 
    const c = document.getElementById('ranges-container'); c.innerHTML = '';
    formData.ranges.forEach(r => {
        const d = document.createElement('div'); d.className = 'card p-2 mb-2';
        d.innerHTML = `<div class="row g-2"><div class="col-3"><input type="number" class="form-control" placeholder="Min" value="${r.min}" onchange="updR('${r.id}','min',this.value)"></div>
        <div class="col-3"><input type="number" class="form-control" placeholder="Max" value="${r.max}" onchange="updR('${r.id}','max',this.value)"></div>
        <div class="col-6"><input type="text" class="form-control" placeholder="Label" value="${r.label}" onchange="updR('${r.id}','label',this.value)"></div>
        <div class="col-12"><input type="text" class="form-control" placeholder="Desc" value="${r.description}" onchange="updR('${r.id}','description',this.value)"></div>
        <div class="col-12 text-end"><button class="btn btn-danger btn-sm" onclick="remR('${r.id}')">Remove</button></div></div>`;
        c.appendChild(d);
    });
}
function updR(id, f, v) { const r = formData.ranges.find(x => x.id === id); if(r) r[f] = v; }
function remR(id) { formData.ranges = formData.ranges.filter(r => r.id !== id); loadRanges(); }

// --- Final ---
function previewForm() {
    let h = ''; formData.questions.forEach((q,i) => h+=`<div class="mb-2"><strong>${i+1}. ${q.text}</strong> [${q.type}]</div>`);
    document.getElementById('preview-questions').innerHTML = h;
}
function toggleStatus(v) { formData.status = v ? 'active' : 'inactive'; }
function saveForm() {
    if(saveFormToStorage(formData)) {
        sessionStorage.removeItem('editFormId');
        Swal.fire('Saved!', 'Form saved successfully.', 'success').then(() => window.location.href = 'listForm.html');
    } else Swal.fire('Error', 'Save failed', 'error');
}