import { StorageManager } from './storge.js'; 

const usersTableBody = document.getElementById("usersTableBody");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const usersCountSpan = document.querySelector(".usersNumber");

let userIndexToDelete = null; 
let users = StorageManager.getUsers();

function renderUsers() {
    usersTableBody.innerHTML = ""; 
    let displayIndex = 0;

    users.forEach((user, index) => {
        if (user.email === "admin@gmail.com") return;
        displayIndex++;

        const tr = document.createElement("tr");
        tr.classList.add("bg-white", "border-b", "dark:bg-gray-800", "dark:border-gray-700");
        
        tr.innerHTML = `
            <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">${displayIndex}</td>
            <td class="px-4 py-4 text-center">${user.username}</td>
            <td class="px-4 py-4 text-center whitespace-nowrap">${user.email}</td>
            <td class="px-4 py-4 text-center space-x-2">
                <button class="btn btn-danger btn-sm delete-btn" 
                        data-index="${index}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteUser">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        usersTableBody.appendChild(tr);
    });

    const totalUsers = users.filter(u => u.email !== "admin@gmail.com").length;
    usersCountSpan.textContent = totalUsers;
}

renderUsers();

usersTableBody.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        userIndexToDelete = parseInt(e.target.getAttribute("data-index"));
    }
});

confirmDeleteBtn.addEventListener("click", function() {
    if (userIndexToDelete !== null) {
        users.splice(userIndexToDelete, 1); 
        StorageManager.set("purebite_users", users); 
        renderUsers(); 
        userIndexToDelete = null; 

        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUser'));
        deleteModal.hide();

        // SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
        });
    }
});
