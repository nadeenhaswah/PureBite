// Storage Management using localStorage

// Save form
function saveFormToStorage(form) {
    try {
        // Get current forms
        const forms = JSON.parse(localStorage.getItem('nutritionForms')) || [];
        
        // Check if form exists (update)
        const existingIndex = forms.findIndex(f => f.id === form.id);
        
        if(existingIndex > -1) {
            forms[existingIndex] = form;
        } else {
            forms.push(form);
        }
        
        // Save to localStorage
        localStorage.setItem('nutritionForms', JSON.stringify(forms));
        
        console.log('Form saved:', form);
        return true;
    } catch (error) {
        console.error('Error saving form:', error);
        return false;
    }
}

// Get all forms
function getAllForms() {
    try {
        return JSON.parse(localStorage.getItem('nutritionForms')) || [];
    } catch (error) {
        console.error('Error loading forms:', error);
        return [];
    }
}

// Get form by ID
function getFormById(formId) {
    const forms = getAllForms();
    return forms.find(form => form.id === formId);
}

// Delete form
function deleteForm(formId) {
    try {
        let forms = getAllForms();
        forms = forms.filter(form => form.id !== formId);
        localStorage.setItem('nutritionForms', JSON.stringify(forms));
        return true;
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
            localStorage.setItem('nutritionForms', JSON.stringify(forms));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating form status:', error);
        return false;
    }
}

// User Management
const USERS_KEY = 'nutritionUsers';

// Register new user
function registerUser(userData) {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        
        // Check for duplicate email/username
        if(users.some(u => u.email === userData.email || u.username === userData.username)) {
            return { success: false, message: 'User already exists' };
        }
        
        users.push({
            ...userData,
            id: 'user_' + Date.now(),
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return { success: true, message: 'Registration successful' };
    } catch (error) {
        return { success: false, message: 'Registration error' };
    }
}

// Login user
function loginUser(identifier, password) {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(u => 
            (u.email === identifier || u.username === identifier) && 
            u.password === password
        );
        
        if(user) {
            // Save user session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { 
                success: true, 
                user: user,
                redirect: user.role === 'admin' ? 'dashboard.html' : 'patient-forms.html'
            };
        }
        
        return { success: false, message: 'Invalid login credentials' };
    } catch (error) {
        return { success: false, message: 'Login error' };
    }
}

// Get current user
function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

// Logout user
function logoutUser() {
    sessionStorage.removeItem('currentUser');
}

// Save form answers
function saveFormAnswers(formId, answers, userId) {
    try {
        const key = `formAnswers_${formId}`;
        const allAnswers = JSON.parse(localStorage.getItem(key)) || [];
        
        allAnswers.push({
            id: 'answer_' + Date.now(),
            formId: formId,
            userId: userId,
            answers: answers,
            submittedAt: new Date().toISOString(),
            score: calculateScore(formId, answers)
        });
        
        localStorage.setItem(key, JSON.stringify(allAnswers));
        return { success: true, score: allAnswers[allAnswers.length - 1].score };
    } catch (error) {
        return { success: false, message: 'Error saving answers' };
    }
}

// Calculate score
function calculateScore(formId, answers) {
    const form = getFormById(formId);
    if(!form) return 0;
    
    let correctCount = 0;
    let totalCorrectQuestions = 0;
    
    // Count correct answers
    form.questions.forEach(question => {
        if(question.correctAnswer) {
            totalCorrectQuestions++;
            const userAnswer = answers[question.id];
            if(userAnswer === question.correctAnswer) {
                correctCount++;
            }
        }
    });
    
    if(totalCorrectQuestions === 0) return 0;
    
    // Calculate percentage
    const percentage = (correctCount / totalCorrectQuestions) * 100;
    
    // Find matching range
    const range = form.ranges.find(r => 
        percentage >= r.min && percentage <= r.max
    );
    
    return {
        percentage: Math.round(percentage),
        correctCount: correctCount,
        totalQuestions: totalCorrectQuestions,
        range: range || null
    };
}

// Get form statistics
function getFormStatistics(formId) {
    try {
        const key = `formAnswers_${formId}`;
        const answers = JSON.parse(localStorage.getItem(key)) || [];
        
        return {
            totalSubmissions: answers.length,
            averageScore: answers.length > 0 ? 
                answers.reduce((sum, a) => sum + a.score.percentage, 0) / answers.length : 0,
            latestSubmissions: answers.slice(-5).reverse()
        };
    } catch (error) {
        return { totalSubmissions: 0, averageScore: 0, latestSubmissions: [] };
    }

    // Delete form from storage
function deleteFormFromStorage(formId) {
    try {
        let forms = getAllForms();
        const initialLength = forms.length;
        
        // Filter out the form to delete
        forms = forms.filter(form => form.id !== formId);
        
        // Save updated forms
        localStorage.setItem('nutritionForms', JSON.stringify(forms));
        
        // Also delete form answers if they exist
        const answersKey = `formAnswers_${formId}`;
        localStorage.removeItem(answersKey);
        
        console.log('Form deleted:', formId);
        return forms.length < initialLength; // Return true if something was deleted
    } catch (error) {
        console.error('Error deleting form:', error);
        return false;
    }
}
}