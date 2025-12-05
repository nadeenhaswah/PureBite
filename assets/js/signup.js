import { StorageManager ,STORAGE_KEYS } from "./storge.js";
let formRegister = document.querySelector("form");
let logIn = document.querySelector(".logIn");

console.log("Inside module:", formRegister);
console.log(window.formRegister);
let note = document.querySelectorAll(".note");

logIn.addEventListener("click", function (event) {
  let isCheckTrueAllInputs = true;

  // Prevent the form from submitting and reloading the page
  event.preventDefault();
  let user = {};

  // check is input user name match to my requerment()
  const usernameRegex = /^[A-Za-z0-9_]+$/;
  if (formRegister[1].value === "") {
    // empty input message
    note[0].textContent = "This Is Input required";
    isCheckTrueAllInputs = false;
  } else if (!usernameRegex.test(formRegister[1].value.trim())) {
    // message invalid username
    note[0].textContent = "Use letters and numbers only, no spaces";
    isCheckTrueAllInputs = false;
  } else {
    // remove message if input username true
    note[0].textContent = "";
    user.username = formRegister[1].value;
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

  if (formRegister[2].value === "") {
    // empty input message
    note[1].textContent = "This input is required";
    isCheckTrueAllInputs = false;
  } else if (!emailRegex.test(formRegister[2].value.trim())) {
    // invalid email message
    note[1].textContent = "Enter a valid email address";
    isCheckTrueAllInputs = false;
  } else {
    // console.log(formRegister[1].value === user.email)
    let users = StorageManager.get(STORAGE_KEYS.USERS);
  
    let isFoundEmailInLocalStorage = users.some((user) => {
      return formRegister[2].value === user.email;
    });
      console.log(isFoundEmailInLocalStorage)
      console.log(isCheckTrueAllInputs)
      console.log(users);

    if (isFoundEmailInLocalStorage) {
      note[1].textContent = "this is email found";
      isCheckTrueAllInputs = false;
    } else {
      // clear message if email is valid
      note[1].textContent = "";
      user.email = formRegister[2].value;
    }
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;

  if (formRegister[3].value === "") {
    // empty input message
    note[2].textContent = "This input is required";
    isCheckTrueAllInputs = false;
  } else if (!passwordRegex.test(formRegister[3].value)) {
    // invalid password message
    note[2].textContent =
      "Password must be 6-20 chars, include uppercase, lowercase & number";
    isCheckTrueAllInputs = false;
  } else {
    // clear message if password is valid
    note[2].textContent = "";
  }

  // Check if confirm password matches password
  if (formRegister[4].value === formRegister[4].value) {
    // message if passwords match
    note[3].textContent = "";
    user.password = formRegister[4].value;
  } else if (
    formRegister[4].value !== formRegister[3].value &&
    passwordRegex.test(formRegister[3].value) === true
  ) {
    if (formRegister[4].value === "") {
      note[3].textContent = "please confirm password";
    }
    // message if passwords do not match
    else note[3].textContent = "⚠ Passwords do not match";
    isCheckTrueAllInputs = false;
  } else {
    isCheckTrueAllInputs = false;
  }

  if (isCheckTrueAllInputs === true) {
    // Add the new user to storage
    StorageManager.addUser(user);

        // window.location.href ="http://127.0.0.1:64532/auth/login.html";
        window.location.href = "auth/login.html";

  }
});

