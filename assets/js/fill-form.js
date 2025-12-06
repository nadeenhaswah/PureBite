let currentForm = null;
let answers = {};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    
    if(!formId) {
        alert('No form ID provided!');
        window.location.href = 'allForms.html';
        return;
    }
    
    loadForm(formId);
    
    const submitBtn = document.getElementById('submit-assessment');
    if(submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
});

function loadForm(id) {
    if (typeof getFormById !== 'function') {
        console.error("getFormById missing");
        return;
    }

    currentForm = getFormById(id);
    const container = document.getElementById('questions-wrapper');

    if(!currentForm) {
        container.innerHTML = '<div class="alert alert-danger">Form not found. It may have been deleted by the admin.</div>';
        document.getElementById('submit-assessment').style.display = 'none';
        return;
    }
    
    // Set Header
    document.getElementById('form-title').textContent = currentForm.title;
    document.getElementById('form-description').textContent = currentForm.description;
    document.getElementById('question-count').textContent = `${currentForm.questions.length} Questions`;
    
    // Render Questions
    container.innerHTML = '';
    
    currentForm.questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'card mb-4 shadow-sm border-0';
        div.innerHTML = `
            <div class="card-body p-4">
                <h5 class="card-title text-lg font-semibold mb-3">
                    <span class="badge bg-light text-dark me-2">Q${index+1}</span>
                    ${q.text} ${q.required ? '<span class="text-danger">*</span>' : ''}
                </h5>
                <div class="mt-3">
                    ${getQuestionInputHTML(q)}
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function getQuestionInputHTML(q) {
    switch(q.type) {
        case 'text':
            return `<input type="text" class="form-control" onchange="saveAnswer('${q.id}', this.value)">`;
        case 'number':
            return `<input type="number" class="form-control" onchange="saveAnswer('${q.id}', this.value)">`;
        case 'select':
            let opts = `<select class="form-select" onchange="saveAnswer('${q.id}', this.value)"><option value="">Select an option...</option>`;
            q.options.forEach(o => opts += `<option value="${o.id}">${o.text}</option>`);
            return opts + `</select>`;
        case 'radio':
            let radios = '';
            q.options.forEach(o => {
                radios += `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="q_${q.id}" id="${o.id}" value="${o.id}" onchange="saveAnswer('${q.id}', this.value)">
                    <label class="form-check-label" for="${o.id}">${o.text}</label>
                </div>`;
            });
            return radios;
        default: return '';
    }
}

function saveAnswer(qId, val) {
    answers[qId] = val;
}

function submitForm() {
    // Validation
    let isValid = true;
    currentForm.questions.forEach(q => {
        if(q.required && !answers[q.id]) {
            isValid = false;
        }
    });
    
    if(!isValid) {
        Swal.fire('Incomplete Form', 'Please answer all required questions marked with *', 'warning');
        return;
    }
    
    // Save
    const result = saveFormAnswers(currentForm.id, answers);
    
    if(result.success) {
        let rangeMsg = result.score.range ? 
            `<div class="alert alert-success mt-3"><strong>${result.score.range.label}:</strong> ${result.score.range.description}</div>` : '';

        Swal.fire({
            title: 'Submitted Successfully!',
            html: `
                <h3>Score: ${result.score.percentage}%</h3>
                <p>Correct Answers: ${result.score.correctCount}/${result.score.totalQuestions}</p>
                ${rangeMsg}
            `,
            icon: 'success',
            confirmButtonText: 'Back to Forms',
            confirmButtonColor: '#EE7229'
        }).then(() => {
            window.location.href = 'allForms.html';
        });
    } else {
        Swal.fire('Error', result.message, 'error');
    }
}