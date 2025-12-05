// هون بستورد الستورج والادمن
import { StorageManager, ADMIN_EMAIL } from "./storge.js";

document.addEventListener("DOMContentLoaded", () => {

    // هون بمسك العناصر اللي بدي اشتغل عليها
    const form = document.querySelector("form");
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const loginBtn = document.querySelector(".logIn");
    const note = document.querySelector(".note");

    // تنظيف الرسالة
    function clearNote() {
        note.textContent = "";
    }

    // عرض رسالة خطأ
    function showError(msg) {
        note.style.color = "red";
        note.textContent = msg;
    }

    // لما اضغط على زر login
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault(); // عشان ما يعمل refresh للصفحة

        clearNote();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // هون بتأكد اذا الحقول فاضية
        if (!email || !password) {
            showError("Enter email and password");
            return;
        }

        // هون بحاول اسجل دخول
        const user = StorageManager.loginUser(email, password);

        // لو البيانات غلط
        if (!user) {
            showError("Email or password incorrect");
            return;
        }

        // لو الادمن دخل
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            window.location.href = "../admin/dashbord.html";
            return;
        }

        // لو يوزر عادي
        window.location.href = "../user/user.html";
    });
});
