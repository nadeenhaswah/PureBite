// هون بستورد التخزين والادمن
import { StorageManager, ADMIN_EMAIL } from "./storge.js";

document.addEventListener("DOMContentLoaded", () => {

  // عناصر الفورم اللي بدي اشتغل عليها
  const form = document.querySelector("form");
  const usernameInput = form.querySelector('input[name="username"]');
  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const confirmInput = form.querySelector('input[name="confirm_password"]');
  const signupBtn = form.querySelector(".logIn");
  const notes = form.querySelectorAll(".note");

  // تنظيف الأخطاء
  function clearNotes() {
    notes.forEach(n => n.textContent = "");
  }

  // عرض خطأ لحقل معيّن
  function setError(i, msg) {
    notes[i].style.color = "red";
    notes[i].textContent = msg;
  }

  signupBtn.addEventListener("click", (event) => {
    event.preventDefault(); // ما يعمل refresh

    clearNotes();

    let isValid = true;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    // فحص اليوزرنيم
    if (!username) {
      setError(0, "Username required");
      isValid = false;
    }

    // فحص الايميل
    if (!email) {
      setError(1, "Email required");
      isValid = false;
    }

    // منع تسجيل الادمن
    if (email === ADMIN_EMAIL) {
      setError(1, "You can't use admin email");
      isValid = false;
    }

    // فحص الباسورد
    if (!password) {
      setError(2, "Password required");
      isValid = false;
    }

    // فحص confirm
    if (password !== confirm) {
      setError(3, "Passwords not match");
      isValid = false;
    }

    if (!isValid) return;

    // فحص اذا الايميل موجود
    const exists = StorageManager.getUsers().some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      setError(1, "Email already exists");
      return;
    }

    // عمل اوبجكت اليوزر
    const user = { username, email, password };

    // تخزين اليوزر داخل localStorage
    StorageManager.addUser(user);

    // رسالة نجاح
    alert("Account created. You can login now.");

    // تحويل لصفحة اللوجين
    window.location.href = "login.html";
  });

});
