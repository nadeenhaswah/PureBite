// هون بستورد الستورج والادمن
import { StorageManager, ADMIN_EMAIL, STORAGE_KEYS } from "./storge.js";

document.addEventListener("DOMContentLoaded", () => {

    // هون بجيب اليوزر الحالي (الادمن)
    const currentUser = StorageManager.getCurrentUser();

    // لو ما في حد مسجل دخوله، بوديه على صفحة اللوجن
    if (!currentUser) {
        window.location.href = "../auth/login.html";
        return;
    }

    // هون بمسك العناصر من تاب الـ Profile (العرض)
    const profileNameDisplay = document.querySelector('#styled-profile dd.text-capitalize');
    const profileEmailDisplay = document.querySelectorAll('#styled-profile dd')[1];

    // هون بمسك الفورم تبع Update Information
    const updateForm = document.querySelector('#styled-dashboard form');
    const usernameInput = updateForm.querySelector('input[name="username"]');
    
    // هون بمسك الفورم تبع Change Password
    const passwordForm = document.querySelector('#styled-settings form');
    const emailInputPassword = passwordForm.querySelector('input[name="email"]');
    const newPasswordInput = passwordForm.querySelector('input[name="password"]');
    const confirmPasswordInput = passwordForm.querySelector('input[name="confirm_password"]');

    // هون بحمل البيانات الحالية للادمن
    function loadProfileData() {
        if (profileNameDisplay) {
            profileNameDisplay.textContent = currentUser.username || 'Admin';
        }
        if (profileEmailDisplay) {
            profileEmailDisplay.textContent = currentUser.email || ADMIN_EMAIL;
        }
        if (usernameInput) {
            usernameInput.value = currentUser.username || 'Admin';
        }
        if (emailInputPassword) {
            emailInputPassword.value = currentUser.email || ADMIN_EMAIL;
        }
    }

    // هون بنفذ التحميل لما الصفحة تفتح
    loadProfileData();

    // هون بعالج تحديث المعلومات الشخصية (Username)
    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newUsername = usernameInput.value.trim();

            // هون بتأكد اذا الاسم مش فاضي
            if (!newUsername) {
                showMessage('Please enter a valid username', 'error');
                return;
            }

            // هون بحدث بيانات الادمن
            currentUser.username = newUsername;

            // هون بحدث الادمن في قائمة اليوزرز
            const allUsers = StorageManager.getUsers();
            const adminIndex = allUsers.findIndex(u => u.email === ADMIN_EMAIL);
            
            if (adminIndex !== -1) {
                allUsers[adminIndex].username = newUsername;
                StorageManager.set(STORAGE_KEYS.USERS, allUsers);
            }

            // هون بحدث اليوزر الحالي في localStorage
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

            // هون بحدث العرض
            loadProfileData();

            // هون بعرض رسالة نجاح
            showMessage('Profile updated successfully!', 'success');
        });
    }

    // هون بعالج تغيير الباسورد
    if (passwordForm) {
        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = emailInputPassword.value.trim();
            const newPassword = newPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            // هون بتأكد من صحة الإيميل
            if (email !== currentUser.email) {
                showMessage('Email does not match your account', 'error');
                return;
            }

            // هون بتأكد من طول الباسورد
            if (newPassword.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }

            // هون بتأكد من تطابق الباسوردات
            if (newPassword !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            // هون بحدث الباسورد
            currentUser.password = newPassword;

            // هون بحدث الادمن في قائمة اليوزرز
            const allUsers = StorageManager.getUsers();
            const adminIndex = allUsers.findIndex(u => u.email === ADMIN_EMAIL);
            
            if (adminIndex !== -1) {
                allUsers[adminIndex].password = newPassword;
                StorageManager.set(STORAGE_KEYS.USERS, allUsers);
            }

            // هون بحدث اليوزر الحالي في localStorage
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

            // هون بنظف الحقول
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';

            // هون بعرض رسالة نجاح
            showMessage('Password changed successfully!', 'success');
        });
    }

    // هون دالة لعرض الرسائل
    function showMessage(message, type) {
        // هون بستخدم SweetAlert2 لو موجود، وإلا بستخدم alert عادي
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: type === 'success' ? '✓ Success' : '✗ Error',
                text: message,
                icon: type,
                confirmButtonColor: type === 'success' ? '#4CAF50' : '#EE7229',
                confirmButtonText: 'OK'
            });
        } else {
            alert(message);
        }
    }
});
