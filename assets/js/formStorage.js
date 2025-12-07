// Storage Management using localStorage

// --- Constants ---
const FORMS_KEY = 'nutritionForms';
const USERS_KEY = 'purebite_users'; 
const CURRENT_USER_KEY = 'purebite_current_user'; 

// --- Form Management ---

// Save or Update form
function saveFormToStorage(form) {
    try {
        const forms = getAllForms();
        
        // Check if form exists (update)
        const existingIndex = forms.findIndex(f => f.id === form.id);
        
        if(existingIndex > -1) {
            forms[existingIndex] = form;
            console.log('Form updated:', form.id);
        } else {
            forms.push(form);
            console.log('New form created:', form.id);
        }
        
        localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
        return true;
    } catch (error) {
        console.error('Error saving form:', error);
        return false;
    }
}

// Get all forms (SAFE VERSION - Fixes Spinner Issue)
function getAllForms() {
    try {
        const raw = localStorage.getItem(FORMS_KEY);
        if (!raw) return [];
        
        const parsed = JSON.parse(raw);
        // Ensure result is always an array
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error loading forms:', error);
        // Reset storage if corrupt to prevent crash
        localStorage.setItem(FORMS_KEY, '[]');
        return []; 
    }
}

// Get form by ID
function getFormById(formId) {
    const forms = getAllForms();
    return forms.find(form => form.id === formId);
}

// Delete form
function deleteFormFromStorage(formId) {
    try {
        let forms = getAllForms();
        const initialLength = forms.length;
        
        forms = forms.filter(form => form.id !== formId);
        
        if (forms.length < initialLength) {
            localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
            // Optional: Clean answers
            localStorage.removeItem(`formAnswers_${formId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting form:', error);
        return false;
    }
}

// Update form status
function updateFormStatus(formId, status) {
    try {
        const forms = getAllForms();
        const formIndex = forms.findIndex(form => form.id === formId);
        
        if(formIndex > -1) {
            forms[formIndex].status = status;
            localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating form status:', error);
        return false;
    }
}

// --- Submission & Scoring Management ---

function saveFormAnswers(formId, answers) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.error("No user logged in.");
            return { success: false, message: 'User not logged in' };
        }

        const key = `formAnswers_${formId}`;
        const allAnswers = JSON.parse(localStorage.getItem(key)) || [];
        
        const scoreData = calculateScore(formId, answers);

        const submission = {
            id: 'sub_' + Date.now(),
            formId: formId,
            userId: currentUser.email,
            username: currentUser.username,
            answers: answers,
            submittedAt: new Date().toISOString(),
            score: scoreData
        };
        
        allAnswers.push(submission);
        localStorage.setItem(key, JSON.stringify(allAnswers));
        
        return { success: true, score: scoreData };
    } catch (error) {
        console.error('Error saving answers:', error);
        return { success: false, message: 'Error saving answers' };
    }
}

function calculateScore(formId, answers) {
    const form = getFormById(formId);
    if(!form) return 0;
    
    let correctCount = 0;
    let totalCorrectQuestions = 0;
    
    form.questions.forEach(question => {
        if(question.correctAnswer) {
            totalCorrectQuestions++;
            const userAnswer = answers[question.id];
            if(userAnswer === question.correctAnswer) {
                correctCount++;
            }
        }
    });
    
    let percentage = 0;
    if(totalCorrectQuestions > 0) {
        percentage = (correctCount / totalCorrectQuestions) * 100;
    }
    
    const range = form.ranges ? form.ranges.find(r => 
        percentage >= r.min && percentage <= r.max
    ) : null;
    
    return {
        percentage: Math.round(percentage),
        correctCount: correctCount,
        totalQuestions: totalCorrectQuestions,
        range: range || null
    };
}

function getFormStatistics(formId) {
    try {
        const key = `formAnswers_${formId}`;
        const answers = JSON.parse(localStorage.getItem(key)) || [];
        
        const totalScore = answers.reduce((sum, a) => sum + (a.score ? a.score.percentage : 0), 0);
        
        return {
            totalSubmissions: answers.length,
            averageScore: answers.length > 0 ? Math.round(totalScore / answers.length) : 0,
            latestSubmissions: answers.slice(-5).reverse()
        };
    } catch (error) {
        return { totalSubmissions: 0, averageScore: 0, latestSubmissions: [] };
    }
}

function getAllSubmissionsForForm(formId) {
    try {
        const key = `formAnswers_${formId}`;
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

// --- Auth Helper ---
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        return null;
    }

    
}
document.querySelector('.formNumber').textContent = getAllForms().length;
