import { StorageManager, ADMIN_EMAIL } from "./storge.js";

document.addEventListener("DOMContentLoaded", () => {

  // عناصر الفورم
  const form = document.querySelector("form");
  const usernameInput = form.querySelector('input[name="username"]');
  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const confirmInput = form.querySelector('input[name="confirm_password"]');
  const signupBtn = form.querySelector(".logIn");
  const notes = form.querySelectorAll(".note");

  // نفس الريجيكسات اللي بعتلي إياهم
  const usernameRegex = /^[A-Za-z0-9_]+$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_.,-])[A-Za-z\d!@#$%^&*?_.,-]{6,20}$/;

  function clearNotes() {
    notes.forEach(n => n.textContent = "");
  }

  function setError(i, msg) {
    notes[i].style.color = "red";
    notes[i].textContent = msg;
  }

  // -------------------- فحص blur --------------------

  usernameInput.addEventListener("blur", () => {
    const val = usernameInput.value.trim();

    if (!val) setError(0, "Username required");
    else if (!usernameRegex.test(val)) setError(0, "Use letters, numbers, underscore only");
    else notes[0].textContent = "";
  });

  emailInput.addEventListener("blur", () => {
    const val = emailInput.value.trim();

    if (!val) setError(1, "Email required");
    else if (!emailRegex.test(val)) setError(1, "Invalid email format");
    else if (val.toLowerCase() === ADMIN_EMAIL.toLowerCase()) setError(1, "You can't use admin email");
    else notes[1].textContent = "";
  });

  passwordInput.addEventListener("blur", () => {
    const val = passwordInput.value;

    if (!val) setError(2, "Password required");
    else if (!passwordRegex.test(val)) setError(2, "Password must contain upper, lower, number (6-20 chars)");
    else notes[2].textContent = "";
  });

  confirmInput.addEventListener("blur", () => {
    const val = confirmInput.value;

    if (!val) setError(3, "Please confirm password");
    else if (val !== passwordInput.value) setError(3, "Passwords do not match");
    else notes[3].textContent = "";
  });

  // -------------------- عند الضغط على SignUp --------------------

  signupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearNotes();

    let isValid = true;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (!username) {
      setError(0, "Username required");
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      setError(0, "Use letters, numbers, underscore only");
      isValid = false;
    }

    if (!email) {
      setError(1, "Email required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError(1, "Invalid email format");
      isValid = false;
    } else if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setError(1, "You can't use admin email");
      isValid = false;
    }

    if (!password) {
      setError(2, "Password required");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setError(2, "Password must contain upper, lower, number (6-20 chars)");
      isValid = false;
    }

    if (!confirm) {
      setError(3, "Please confirm password");
      isValid = false;
    } else if (password !== confirm) {
      setError(3, "Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    const exists = StorageManager.getUsers().some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      setError(1, "Email already exists");
      return;
    }

    const user = { username, email, password };
    StorageManager.addUser(user);

    // alert("Account created. You can login now.");
    
    Swal.fire({
  title: "🎉 Account Created!",
  text: "Your account has been successfully created. You can log in now.",
  icon: "success",
  confirmButtonColor: "#4CAF50",
  confirmButtonText: "Great!"
  }).then(() => {
    window.location.href = "login.html";
  });

    // window.location.href = "login.html";
  });

});