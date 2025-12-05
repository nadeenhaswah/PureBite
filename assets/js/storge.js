/* هون محدد ايميل الادمن وباسورد ثابتين */
export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "12345678";

/* هون بس بجهز اسماء المفاتيح اللي بخزن فيها البيانات */
export const STORAGE_KEYS = {
    USERS: "purebite_users",
    CURRENT_USER: "purebite_current_user"
};

/*  
    هون عامل اوبجكت اسمه StorageManager 
    هو المسؤول عن كل التعاملات مع localStorage
*/
export const StorageManager = {

    // هون بس بجيب الداتا من localStorage
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    // هون بخزن داتا داخل localStorage
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // بجيب كل اليوزرز
    getUsers() {
        return this.get(STORAGE_KEYS.USERS);
    },

    // هون بضيف يوزر جديد
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.set(STORAGE_KEYS.USERS, users);
    },

    // هون بدور على يوزر من خلال الايميل
    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    },

    // هون بتأكد من تسجيل الدخول
    loginUser(email, password) {
        const users = this.getUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (user) {
            // بخزن مين اليوزر اللي دخل حاليا
            localStorage.setItem(
                STORAGE_KEYS.CURRENT_USER,
                JSON.stringify(user)
            );
            return user;
        }

        return null;
    },

    // هون بجيب اليوزر اللي مسجل دخوله حاليا
    getCurrentUser() {
        const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return raw ? JSON.parse(raw) : null;
    },

    // تسجيل خروج بسيط
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};

/* 
    هون بس بتأكد اذا الادمن موجود، 
    لو مش موجود بخلقه بشكل تلقائي 
*/
(() => {
    const users = StorageManager.getUsers();
    const adminExists = users.some(
        user => user.email === ADMIN_EMAIL
    );

    if (!adminExists) {
        StorageManager.addUser({
            username: "Admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        console.log("✔ Admin Added");
    }
})();
