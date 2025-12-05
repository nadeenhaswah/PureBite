import { StorageManager, STORAGE_KEYS } from "./storge.js"

// Select the form element
let formLogin = document.querySelector("form")


// Select the note element to show messages
let note = document.querySelector(".note")

// Select the submit button inside the form
let logIn = document.querySelector(".loginBtn")

// Add click event listener to the submit button
logIn.addEventListener("click", function(event) {
    // event.preventDefault() // Prevent the form from submitting / reloading the page

    // Get users array from StorageManager
    let users = StorageManager.get(STORAGE_KEYS.USERS)

    if ("admin@gmail.com" === formLogin[1].value  &&  "12345678" === formLogin[2].value ){
            window.location.href = "../../admin/dashbord.html";   
            console.log("go admin");
    }


    // Using some() to check if there is at least one user true
    // If any user matches, some() returns true immediately.
    let isFoundEmailAndPasswordInLocalStorage  = users.some((user) => {
        return formLogin[1].value === user.email && formLogin[2].value === user.password
        });

    // Check if the entered email and password match the  user
    if (isFoundEmailAndPasswordInLocalStorage) {
        // go page
        note.textContent = "";
    } else if(formLogin[1].value === "" || formLogin[2].value === ""){
        note.style.color = "red";
        note.textContent = "Please enter your username/email";
    }
    else {
        // Show error message in red
        note.style.color = "red";
        note.textContent = "Email or password is incorrect";
    }


})