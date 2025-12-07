// Application State
let currentStep = 1;
let formData = {
    id: generateId(),
    title: '',
    description: '',
    status: 'active',
    category: '',
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
// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadStep(currentStep);
    setupEventListeners();
});

// Check if we're editing an existing form
const editFormId = sessionStorage.getItem('editFormId');
if(editFormId) {
    const existingForm = getFormById(editFormId);
    if(existingForm) {
        formData = existingForm;
    }
    // Clear the edit flag
    sessionStorage.removeItem('editFormId');
}

// Generate Unique ID
function generateId() {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Load Step
function loadStep(step) {
    const content = document.getElementById('wizard-content');
    
    // Update active steps
    updateActiveStep(step);
    
    // Load step content
    switch(step) {
        case 1:
            content.innerHTML = getStep1Content();
            break;
        case 2:
            content.innerHTML = getStep2Content();
            loadQuestions();
            break;
        case 3:
            content.innerHTML = getStep3Content();
            loadRanges();
            break;
        case 4:
            content.innerHTML = getStep4Content();
            previewForm();
            break;
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update active steps
function updateActiveStep(step) {
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
        if(parseInt(s.dataset.step) <= step) {
            s.classList.add('active');
        }
    });
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const saveBtn = document.getElementById('save-btn');
    
    prevBtn.disabled = currentStep === 1;
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    
    if(currentStep === 4) {
        nextBtn.style.display = 'none';
        saveBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        nextBtn.textContent = currentStep === 3 ? 'Preview' : 'Next';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', goToPreviousStep);
    document.getElementById('next-btn').addEventListener('click', goToNextStep);
    document.getElementById('save-btn').addEventListener('click', saveForm);
    
    // Save form data on input
    document.addEventListener('input', function(e) {
        if(e.target.matches('#form-title')) {
            formData.title = e.target.value;
        } else if(e.target.matches('#form-description')) {
            formData.description = e.target.value;
        } else if(e.target.matches('#form-category')) {
            formData.category = e.target.value;
        }
    });
}

// Navigation between steps
function goToPreviousStep() {
    if(currentStep > 1) {
        currentStep--;
        loadStep(currentStep);
    }
}

function goToNextStep() {
    if(currentStep < 4) {
        // Validate data before moving
        if(validateStep(currentStep)) {
            currentStep++;
            loadStep(currentStep);
        }
    }
}

// Validate step
function validateStep(step) {
    switch(step) {
        case 1:
            const title = document.getElementById('form-title').value;
            if(!title.trim()) {
                // alert('Please enter form title');
                Swal.fire({
                    icon: 'warning',
                    title: 'Missing Title',
                    text: 'Please enter form title',
                    confirmButtonColor: '#EE7229'
                });

                return false;
            }
            break;
        case 2:
            if(formData.questions.length === 0) {
                // alert('Please add at least one question');
                Swal.fire({
                icon: 'warning',
                title: 'Missing Question',
                text: 'Please add at least one question',
                confirmButtonColor: '#EE7229'
            });

                return false;
            }
            break;
    }
    return true;
}

// === STEP 1: Form Details ===
function getStep1Content() {
    return `
        <div class="step-content">
            <h4 class="mb-4" style="color: var(--accent-color);">
                <i class="fas fa-info-circle me-2"></i>Basic Form Information
            </h4>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="mb-4">
                        <label for="form-title" class="form-label fw-bold">
                            Form Title 
                        </label>
                        <input type="text" class="form-control form-control-lg" 
                               id="form-title" 
                               value="${formData.title}" required>
                    </div>
                    
                    <div class="mb-4">
                        <label for="form-description" class="form-label fw-bold">
                            Form Description
                        </label>
                        <textarea class="form-control" id="form-description" 
                                  rows="4" 
                                  >${formData.description}</textarea>
                    </div>
                    
                    
                </div>
                
                <div class="col-md-4">
                    <div class="card border-primary">
                        <div class="card-header text-white" style="background-color: var(--accent-color);">
                            <i class="fas fa-lightbulb me-1"></i>Tips
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <i class="fas fa-check-circle me-2" style="color: var(--accent-color);"></i>
                                    Choose a clear title
                                </li>
                                <li class="mb-2">
                                    <i class="fas fa-check-circle me-2" style="color: var(--accent-color);"></i>
                                    Write a brief description
                                </li>
                                <li class="mb-2">
                                    <i class="fas fa-check-circle me-2" style="color: var(--accent-color);"></i>
                                    Select appropriate category
                                </li>
                                <li>
                                    <i class="fas fa-check-circle me-2" style="color: var(--accent-color);"></i>
                                    Consider the form's purpose
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// === STEP 2: Questions ===
function getStep2Content() {
    return `
        <div class="step-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="m-0" style="color: var(--accent-color);">
                    <i class="fas fa-question-circle me-2"></i>Form Questions
                </h4>
                <button class="btn btn-primary" onclick="addQuestion()">
                    <i class="fas fa-plus me-1"></i>Add Question
                </button>
            </div>
            
            <div id="questions-container">
                <!-- Questions added dynamically -->
            </div>
            
            <div class="text-center mt-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <span id="questions-count">${formData.questions.length}</span> questions added
                </div>
            </div>
        </div>
    `;
}

// Add new question
function addQuestion() {
    const questionId = 'q_' + Date.now();
    const question = {
        id: questionId,
        text: '',
        type: 'text',
        required: true,
        options: [],
        correctAnswer: '',
        formatting: {
            font: 'kantumruy',
            bold: false,
            italic: false,
            color: '#000000'
        }
    };
    
    formData.questions.push(question);
    renderQuestion(question);
    updateQuestionsCount();
}

// Render question
function renderQuestion(question) {
    const container = document.getElementById('questions-container');
    
    const questionHTML = `
        <div class="question-card" data-id="${question.id}">
            <div class="question-header p-3 rounded-top">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="m-0">
                        <i class="fas fa-question me-2"></i>
                        Question ${formData.questions.indexOf(question) + 1}
                    </h6>
                    <div>
                        <button class="btn btn-sm btn-outline-secondary me-2" 
                                onclick="formatQuestionText('${question.id}')"
                                title="Format Text">
                            <i class="fas fa-font"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="removeQuestion('${question.id}')"
                                title="Delete Question">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="p-3">
                <div class="mb-3">
                    <label class="form-label">Question Text *</label>
                    <input type="text" class="form-control question-text" 
                           data-id="${question.id}" 
                           placeholder="Enter question text..."
                           value="${question.text}"
                           oninput="updateQuestionText('${question.id}', this.value)">
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Answer Type</label>
                        <select class="form-select question-type" 
                                data-id="${question.id}"
                                onchange="changeQuestionType('${question.id}', this.value)">
                            <option value="text" ${question.type === 'text' ? 'selected' : ''}>Text</option>
                            <option value="number" ${question.type === 'number' ? 'selected' : ''}>Number</option>
                            <option value="date" ${question.type === 'date' ? 'selected' : ''}>Date</option>
                            <option value="radio" ${question.type === 'radio' ? 'selected' : ''}>Multiple Choice</option>
                            <option value="select" ${question.type === 'select' ? 'selected' : ''}>Dropdown</option>
                        </select>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="form-check mt-4">
                            <input class="form-check-input question-required" 
                                   type="checkbox" 
                                   data-id="${question.id}"
                                   ${question.required ? 'checked' : ''}
                                   onchange="toggleQuestionRequired('${question.id}', this.checked)">
                            <label class="form-check-label">Required</label>
                        </div>
                    </div>
                </div>
                
                <!-- MCQ Options -->
                <div id="options-${question.id}" class="mb-3" 
                     style="${question.type === 'radio' || question.type === 'select' ? '' : 'display: none;'}">
                    <label class="form-label">Options</label>
                    <div id="options-list-${question.id}">
                        ${renderOptions(question.id, question.options)}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary mt-2"
                            onclick="addOption('${question.id}')">
                        <i class="fas fa-plus me-1"></i>Add Option
                    </button>
                </div>
                
                <!-- Correct Answer -->
                <div id="correct-answer-${question.id}" 
                     style="${question.type === 'radio' || question.type === 'select' ? '' : 'display: none;'}">
                    <label class="form-label">Correct Answer (Optional)</label>
                    <select class="form-select correct-answer" 
                            data-id="${question.id}"
                            onchange="updateCorrectAnswer('${question.id}', this.value)">
                        <option value="">Select correct answer...</option>
                        ${question.options.map((opt, idx) => `
                            <option value="${opt.id}" ${question.correctAnswer === opt.id ? 'selected' : ''}>
                                ${opt.text}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHTML);
}

// Render options
function renderOptions(questionId, options) {
    if(options.length === 0) {
        return '<div class="text-muted mb-2">No options added</div>';
    }
    
    let html = '';
    options.forEach((option, index) => {
        html += `
            <div class="input-group mb-2 option-item" data-id="${option.id}">
                <input type="text" class="form-control option-text" 
                       value="${option.text}"
                       oninput="updateOptionText('${questionId}', '${option.id}', this.value)"
                       placeholder="Option text...">
                <button class="btn btn-outline-danger" type="button"
                        onclick="removeOption('${questionId}', '${option.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    return html;
}

// Update question text
function updateQuestionText(questionId, text) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.text = text;
    }
}

// Change question type
function changeQuestionType(questionId, type) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.type = type;
        
        // Show/hide options
        const optionsDiv = document.getElementById(`options-${questionId}`);
        const correctAnswerDiv = document.getElementById(`correct-answer-${questionId}`);
        
        if(type === 'radio' || type === 'select') {
            optionsDiv.style.display = 'block';
            correctAnswerDiv.style.display = 'block';
            
            // Add default options if none exist
            if(question.options.length === 0) {
                addOption(questionId);
                addOption(questionId);
            }
        } else {
            optionsDiv.style.display = 'none';
            correctAnswerDiv.style.display = 'none';
            question.options = [];
            question.correctAnswer = '';
        }
    }
}

// Toggle question required
function toggleQuestionRequired(questionId, required) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.required = required;
    }
}

// Add option
function addOption(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        const optionId = 'opt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const option = {
            id: optionId,
            text: ''
        };
        
        question.options.push(option);
        
        // Update display
        const optionsList = document.getElementById(`options-list-${questionId}`);
        const newOptionHTML = `
            <div class="input-group mb-2 option-item" data-id="${optionId}">
                <input type="text" class="form-control option-text" 
                       oninput="updateOptionText('${questionId}', '${optionId}', this.value)"
                       placeholder="Option text...">
                <button class="btn btn-outline-danger" type="button"
                        onclick="removeOption('${questionId}', '${optionId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        optionsList.insertAdjacentHTML('beforeend', newOptionHTML);
        
        // Update correct answer options
        updateCorrectAnswerOptions(questionId);
    }
}

// Update option text
function updateOptionText(questionId, optionId, text) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        const option = question.options.find(o => o.id === optionId);
        if(option) {
            option.text = text;
            updateCorrectAnswerOptions(questionId);
        }
    }
}

// Remove option
function removeOption(questionId, optionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.options = question.options.filter(o => o.id !== optionId);
        
        // Remove from display
        const optionElement = document.querySelector(`.option-item[data-id="${optionId}"]`);
        if(optionElement) {
            optionElement.remove();
        }
        
        // Update correct answer options
        updateCorrectAnswerOptions(questionId);
    }
}

// Update correct answer options
function updateCorrectAnswerOptions(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    const select = document.querySelector(`.correct-answer[data-id="${questionId}"]`);
    
    if(select && question) {
        let optionsHTML = '<option value="">Select correct answer...</option>';
        question.options.forEach(opt => {
            optionsHTML += `<option value="${opt.id}">${opt.text}</option>`;
        });
        select.innerHTML = optionsHTML;
        
        // Reselect value if exists
        if(question.correctAnswer) {
            select.value = question.correctAnswer;
        }
    }
}

// Update correct answer
function updateCorrectAnswer(questionId, answerId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.correctAnswer = answerId;
    }
}

// Remove question
function removeQuestion(questionId) {
    if(confirm('Are you sure you want to delete this question?')) {
        formData.questions = formData.questions.filter(q => q.id !== questionId);
        const questionElement = document.querySelector(`.question-card[data-id="${questionId}"]`);
        if(questionElement) {
            questionElement.remove();
        }
        updateQuestionsCount();
    }
}

// Load questions
function loadQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    formData.questions.forEach(question => {
        renderQuestion(question);
    });
    
    updateQuestionsCount();
}

// Update questions count
function updateQuestionsCount() {
    const countElement = document.getElementById('questions-count');
    if(countElement) {
        countElement.textContent = formData.questions.length;
    }
}

// Format question text
function formatQuestionText(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(!question) return;
    
    const modal = new bootstrap.Modal(document.getElementById('textFormatModal'));
    const modalBody = document.querySelector('#textFormatModal .modal-body');
    
    modalBody.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Current Text</label>
            <div class="text-formatted" id="text-preview-${questionId}"
                 style="font-family: ${question.formatting.font === 'kantumruy' ? 'Kantumruy Pro' : 'inherit'};
                        font-weight: ${question.formatting.bold ? 'bold' : 'normal'};
                        font-style: ${question.formatting.italic ? 'italic' : 'normal'};
                        color: ${question.formatting.color};">
                ${question.text || 'Question text will appear here'}
            </div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Font</label>
            <select class="form-select" id="font-select-${questionId}"
                    onchange="changeTextFont('${questionId}', this.value)">
                <option value="kantumruy" ${question.formatting.font === 'kantumruy' ? 'selected' : ''}>Kantumruy Pro</option>
                <option value="arial" ${question.formatting.font === 'arial' ? 'selected' : ''}>Arial</option>
                <option value="times" ${question.formatting.font === 'times' ? 'selected' : ''}>Times New Roman</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Formatting</label>
            <div class="d-flex gap-2">
                <button class="btn ${question.formatting.bold ? 'btn-primary' : 'btn-outline-secondary'}"
                        onclick="toggleTextBold('${questionId}')">
                    <i class="fas fa-bold"></i> Bold
                </button>
                <button class="btn ${question.formatting.italic ? 'btn-primary' : 'btn-outline-secondary'}"
                        onclick="toggleTextItalic('${questionId}')">
                    <i class="fas fa-italic"></i> Italic
                </button>
            </div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Text Color</label>
            <input type="color" class="form-control form-control-color" 
                   id="color-picker-${questionId}"
                   value="${question.formatting.color}"
                   onchange="changeTextColor('${questionId}', this.value)">
        </div>
        
        <div class="text-center">
            <button class="btn btn-primary" onclick="saveTextFormatting('${questionId}')">
                Save Formatting
            </button>
        </div>
    `;
    
    modal.show();
}

// Change font
function changeTextFont(questionId, font) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.formatting.font = font;
        updateTextPreview(questionId);
    }
}

// Toggle bold
function toggleTextBold(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.formatting.bold = !question.formatting.bold;
        updateTextPreview(questionId);
        
        // Update button
        const btn = document.querySelector(`[onclick="toggleTextBold('${questionId}')"]`);
        if(btn) {
            btn.className = question.formatting.bold ? 
                'btn btn-primary' : 'btn btn-outline-secondary';
        }
    }
}

// Toggle italic
function toggleTextItalic(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.formatting.italic = !question.formatting.italic;
        updateTextPreview(questionId);
        
        // Update button
        const btn = document.querySelector(`[onclick="toggleTextItalic('${questionId}')"]`);
        if(btn) {
            btn.className = question.formatting.italic ? 
                'btn btn-primary' : 'btn btn-outline-secondary';
        }
    }
}

// Change color
function changeTextColor(questionId, color) {
    const question = formData.questions.find(q => q.id === questionId);
    if(question) {
        question.formatting.color = color;
        updateTextPreview(questionId);
    }
}

// Update text preview
function updateTextPreview(questionId) {
    const question = formData.questions.find(q => q.id === questionId);
    if(!question) return;
    
    const preview = document.getElementById(`text-preview-${questionId}`);
    if(preview) {
        preview.style.fontFamily = question.formatting.font === 'kantumruy' ? 'Kantumruy Pro' : 
                                  question.formatting.font === 'arial' ? 'Arial' : 
                                  question.formatting.font === 'times' ? 'Times New Roman' : 'inherit';
        preview.style.fontWeight = question.formatting.bold ? 'bold' : 'normal';
        preview.style.fontStyle = question.formatting.italic ? 'italic' : 'normal';
        preview.style.color = question.formatting.color;
        preview.textContent = question.text || 'Question text will appear here';
    }
}

// Save formatting
function saveTextFormatting(questionId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById('textFormatModal'));
    modal.hide();
}

// === STEP 3: Results Scoring ===
function getStep3Content() {
    return `
        <div class="step-content">
            <h4 class="mb-4" style="color: var(--accent-color);">
                <i class="fas fa-chart-line me-2"></i>Results Scoring
            </h4>
            
            <div class="alert alert-info mb-4">
                <i class="fas fa-info-circle me-2"></i>
                Here you define score ranges for evaluating patients' results
            </div>
            
            <div class="mb-4">
                <button class="btn btn-primary" onclick="addRange()">
                    <i class="fas fa-plus me-1"></i>Add Score Range
                </button>
            </div>
            
            <div id="ranges-container">
                <!-- Ranges added dynamically -->
            </div>
            
            <div class="mt-4">
                <div class="card border-info">
                    <div class="card-header text-white" style="background-color: var(--secondary-color);">
                        <i class="fas fa-calculator me-1"></i>Score Calculation
                    </div>
                    <div class="card-body">
                        <p>Final score will be calculated based on:</p>
                        <ul>
                            <li>Correct answers: <strong>${countCorrectAnswers()}</strong></li>
                            <li>Defined ranges: <span id="ranges-count">${formData.ranges.length}</span></li>
                        </ul>
                        <p class="text-muted mb-0">
                            <small>
                                <i class="fas fa-lightbulb me-1"></i>
                                Score will be shown to patients after form submission
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Count correct answers
function countCorrectAnswers() {
    return formData.questions.filter(q => q.correctAnswer).length;
}

// Add score range
function addRange() {
    const rangeId = 'range_' + Date.now();
    const range = {
        id: rangeId,
        min: 0,
        max: 100,
        label: '',
        description: '',
        color: '#4A9337'
    };
    
    formData.ranges.push(range);
    renderRange(range);
    updateRangesCount();
}

// Render range
function renderRange(range) {
    const container = document.getElementById('ranges-container');
    const index = formData.ranges.indexOf(range);
    
    const rangeHTML = `
        <div class="range-item" data-id="${range.id}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="m-0">
                    <i class="fas fa-layer-group me-2"></i>
                    Range ${index + 1}
                </h6>
                <button class="btn btn-sm btn-danger" 
                        onclick="removeRange('${range.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">From</label>
                    <input type="number" class="form-control range-min" 
                           value="${range.min}"
                           oninput="updateRangeValue('${range.id}', 'min', this.value)"
                           min="0" max="100">
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">To</label>
                    <input type="number" class="form-control range-max" 
                           value="${range.max}"
                           oninput="updateRangeValue('${range.id}', 'max', this.value)"
                           min="0" max="100">
                </div>
                
                <div class="col-md-4">
                    <label class="form-label">Label</label>
                    <input type="text" class="form-control range-label" 
                           value="${range.label}"
                           oninput="updateRangeLabel('${range.id}', this.value)"
                           placeholder="Example: Excellent, Good...">
                </div>
                
                <div class="col-md-2">
                    <label class="form-label">Color</label>
                    <input type="color" class="form-control form-control-color range-color" 
                           value="${range.color}"
                           onchange="updateRangeColor('${range.id}', this.value)">
                </div>
            </div>
            
            <div class="mt-3">
                <label class="form-label">Description</label>
                <textarea class="form-control range-description" 
                          rows="2"
                          oninput="updateRangeDescription('${range.id}', this.value)"
                          placeholder="Detailed description for this range...">${range.description}</textarea>
            </div>
            
            <div class="mt-2 text-end">
                <span class="badge" style="background-color: ${range.color}; color: white;">
                    ${range.min} - ${range.max}: ${range.label || 'No label'}
                </span>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', rangeHTML);
}

// Update range values
function updateRangeValue(rangeId, field, value) {
    const range = formData.ranges.find(r => r.id === rangeId);
    if(range) {
        range[field] = parseInt(value) || 0;
        
        // Update badge
        const badge = document.querySelector(`.range-item[data-id="${rangeId}"] .badge`);
        if(badge) {
            badge.textContent = `${range.min} - ${range.max}: ${range.label || 'No label'}`;
        }
    }
}

function updateRangeLabel(rangeId, label) {
    const range = formData.ranges.find(r => r.id === rangeId);
    if(range) {
        range.label = label;
        
        // Update badge
        const badge = document.querySelector(`.range-item[data-id="${rangeId}"] .badge`);
        if(badge) {
            badge.textContent = `${range.min} - ${range.max}: ${range.label || 'No label'}`;
        }
    }
}

function updateRangeDescription(rangeId, description) {
    const range = formData.ranges.find(r => r.id === rangeId);
    if(range) {
        range.description = description;
    }
}

function updateRangeColor(rangeId, color) {
    const range = formData.ranges.find(r => r.id === rangeId);
    if(range) {
        range.color = color;
        
        // Update badge
        const badge = document.querySelector(`.range-item[data-id="${rangeId}"] .badge`);
        if(badge) {
            badge.style.backgroundColor = color;
        }
    }
}

// Remove range
function removeRange(rangeId) {
    if(confirm('Are you sure you want to delete this range?')) {
        formData.ranges = formData.ranges.filter(r => r.id !== rangeId);
        const rangeElement = document.querySelector(`.range-item[data-id="${rangeId}"]`);
        if(rangeElement) {
            rangeElement.remove();
        }
        updateRangesCount();
    }
}

// Load ranges
function loadRanges() {
    const container = document.getElementById('ranges-container');
    container.innerHTML = '';
    
    formData.ranges.forEach(range => {
        renderRange(range);
    });
    
    updateRangesCount();
}

// Update ranges count
function updateRangesCount() {
    const countElement = document.getElementById('ranges-count');
    if(countElement) {
        countElement.textContent = formData.ranges.length;
    }
}

// === STEP 4: Preview ===
function getStep4Content() {
    return `
        <div class="step-content">
            <h4 class="mb-4" style="color: var(--accent-color);">
                <i class="fas fa-eye me-2"></i>Form Preview
            </h4>
            
            <div class="alert alert-success mb-4">
                <i class="fas fa-check-circle me-2"></i>
                This is the final form as it will appear to patients
            </div>
            
            <div id="form-preview">
                <!-- Form displayed dynamically -->
            </div>
            
            <div class="mt-4">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-cogs me-2"></i>Form Settings
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" 
                                           id="form-status" ${formData.status === 'active' ? 'checked' : ''}
                                           onchange="toggleFormStatus(this.checked)">
                                    <label class="form-check-label" for="form-status">
                                        Form is active
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-0">
                                    <strong>Created:</strong> 
                                    ${new Date(formData.createdAt).toLocaleDateString('en-US')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Preview form
function previewForm() {
    const container = document.getElementById('form-preview');
    
    let previewHTML = `
        <div class="card shadow">
            <div class="card-header text-white" style="background-color: var(--accent-color);">
                <h4 class="mb-0">${formData.title || 'Form Title'}</h4>
                ${formData.description ? `<p class="mb-0 mt-2">${formData.description}</p>` : ''}
            </div>
            <div class="card-body">
                <form id="preview-form">
    `;
    
    // Add questions
    formData.questions.forEach((question, index) => {
        const fontFamily = question.formatting.font === 'kantumruy' ? 'Kantumruy Pro' : 
                          question.formatting.font === 'arial' ? 'Arial' : 
                          question.formatting.font === 'times' ? 'Times New Roman' : 'inherit';
        
        const formattedStyle = `
            font-family: ${fontFamily};
            font-weight: ${question.formatting.bold ? 'bold' : 'normal'};
            font-style: ${question.formatting.italic ? 'italic' : 'normal'};
            color: ${question.formatting.color};
        `;
        
        previewHTML += `
            <div class="preview-question">
                <div class="mb-3">
                    <label class="form-label fw-bold">
                        <span style="${formattedStyle}">
                            ${question.text || 'Question without text'}
                            ${question.required ? '<span class="text-danger">*</span>' : ''}
                        </span>
                    </label>
                    
                    ${renderPreviewInput(question)}
                </div>
            </div>
        `;
    });
    
    previewHTML += `
                <div class="mt-4 pt-4 border-top">
                    <button type="button" class="btn btn-primary btn-lg">
                        <i class="fas fa-paper-plane me-2"></i>Submit Form
                    </button>
                    <p class="text-muted mt-2">
                        <small>Score will be calculated automatically after submission</small>
                    </p>
                </div>
            </form>
        </div>
    `;
    
    container.innerHTML = previewHTML;
}

// Render input in preview
function renderPreviewInput(question) {
    switch(question.type) {
        case 'text':
            return `<input type="text" class="form-control" ${question.required ? 'required' : ''}>`;
        
        case 'number':
            return `<input type="number" class="form-control" ${question.required ? 'required' : ''}>`;
        
        case 'date':
            return `<input type="date" class="form-control" ${question.required ? 'required' : ''}>`;
        
        case 'radio':
            let radioHTML = '';
            question.options.forEach(option => {
                radioHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" 
                               name="q_${question.id}" 
                               id="opt_${option.id}"
                               value="${option.id}"
                               ${question.required ? 'required' : ''}>
                        <label class="form-check-label" for="opt_${option.id}">
                            ${option.text || 'Option without text'}
                        </label>
                    </div>
                `;
            });
            return radioHTML;
        
        case 'select':
            let selectHTML = `<select class="form-select" ${question.required ? 'required' : ''}>`;
            selectHTML += '<option value="">Choose...</option>';
            question.options.forEach(option => {
                selectHTML += `<option value="${option.id}">${option.text || 'Option without text'}</option>`;
            });
            selectHTML += '</select>';
            return selectHTML;
        
        default:
            return `<input type="text" class="form-control">`;
    }
}

// Toggle form status
function toggleFormStatus(active) {
    formData.status = active ? 'active' : 'inactive';
}

// Save form
function saveForm() {
    // Validate data
    if(!formData.title.trim()) {
        alert('Please enter form title');
        return;
    }
    
    if(formData.questions.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    // Sort ranges
    formData.ranges.sort((a, b) => a.min - b.min);
    
    // Save to localStorage
    saveFormToStorage(formData);
    
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Form saved successfully!',
        confirmButtonColor: '#EE7229'
    });
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'listForm.html';
    }, 1500);
}