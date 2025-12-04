/* SkillForge Storage Manager
 * Handles all interactions with localStorage
 */

export const STORAGE_KEYS = {
    USERS: 'skillforge_users',
    FORMS: 'skillforge_forms',
    RESPONSES: 'skillforge_responses',
    CURRENT_USER: 'skillforge_current_user'
};

export const StorageManager = {  //
    // --- Generic Helpers ---
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // --- User Management ---
    getUsers: () => StorageManager.get(STORAGE_KEYS.USERS),
    addUser: (user) => {
        const users = StorageManager.getUsers();
        users.push(user);
        StorageManager.set(STORAGE_KEYS.USERS, users);
    },
    findUserByEmail: (email) => {
        const users = StorageManager.getUsers();
        return users.find(u => u.email === email);
    },
    loginUser: (email, password) => {
        const user = StorageManager.findUserByEmail(email);
        if (user && user.password === password) {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            return user;
        }
        return null;
    },
    updateUser: (updatedUser) => {
        let users = StorageManager.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            StorageManager.set(STORAGE_KEYS.USERS, users);
            // Update session if it's the current user
            const currentUser = StorageManager.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
            }
        }
    },
    deleteUser: (userId) => {
        let users = StorageManager.getUsers();
        users = users.filter(u => u.id !== userId);
        StorageManager.set(STORAGE_KEYS.USERS, users);
    },
    getCurrentUser: () => {
        const user = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },
    logout: () => {
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // --- Form Management ---
    getForms: () => StorageManager.get(STORAGE_KEYS.FORMS),
    saveForm: (form) => {
        const forms = StorageManager.getForms();
        const existingIndex = forms.findIndex(f => f.id === form.id);
        if (existingIndex >= 0) {
            forms[existingIndex] = form;
        } else {
            forms.push(form);
        }
        StorageManager.set(STORAGE_KEYS.FORMS, forms);
    },
    deleteForm: (formId) => {
        let forms = StorageManager.getForms();
        forms = forms.filter(f => f.id !== formId);
        StorageManager.set(STORAGE_KEYS.FORMS, forms);
    },
    getFormById: (formId) => {
        const forms = StorageManager.getForms();
        return forms.find(f => f.id === formId);
    },

    // --- Response Management ---
    getResponses: () => StorageManager.get(STORAGE_KEYS.RESPONSES),
    saveResponse: (response) => {
        const responses = StorageManager.getResponses();
        responses.push(response);
        StorageManager.set(STORAGE_KEYS.RESPONSES, responses);
    },
    getUserResponses: (userId) => {
        const responses = StorageManager.getResponses();
        return responses.filter(r => r.userId === userId);
    }
};

// Initialize default admin if not exists
(() => {
    const users = StorageManager.getUsers();
    if (!users.find(u => u.role === 'admin')) {
        StorageManager.addUser({
            id: 'admin-1',
            username: 'Admin',
            email: 'admin@skillforge.com',
            password: 'admin',
            role: 'admin'
        });
        console.log('Default admin initialized: admin@skillforge.com / admin');
    }})
