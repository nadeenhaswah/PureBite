import { StorageManager } from './storge.js'; 

const usersTableBody = document.getElementById("usersTableBody");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let userIndexToDelete = null; // لتخزين index المستخدم المراد حذفه مؤقتاً

const users = StorageManager.getUsers();

function renderUsers() {
    usersTableBody.innerHTML = ""; 

    users.forEach((user, index) => {
        if (user.email === "admin@gmail.com") return; // تجاهل الادمن

        const tr = document.createElement("tr");
        tr.classList.add("bg-white", "border-b", "dark:bg-gray-800", "dark:border-gray-700");
        
        tr.innerHTML = `
            <td class="px-4 py-4 text-center font-medium text-gray-600 dark:text-white">${index + 1}</td>
            <td class="px-4 py-4 text-center">${user.username}</td>
            <td class="px-4 py-4 text-center whitespace-nowrap">${user.email}</td>
            <td class="px-4 py-4 text-center space-x-2">
                <button class="btn btn-danger btn-sm delete-btn" 
                        data-index="${index}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteUser">
                    Delete
                </button>
            </td>
        `;
        usersTableBody.appendChild(tr);
    });
}

renderUsers();

// عند الضغط على زر Delete داخل الجدول، خزني index المستخدم
usersTableBody.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        userIndexToDelete = e.target.getAttribute("data-index");
    }
});

// عند الضغط على Confirm Delete داخل الـ Modal
confirmDeleteBtn.addEventListener("click", function() {
    if (userIndexToDelete !== null) {
        users.splice(userIndexToDelete, 1); // حذف المستخدم
        StorageManager.set("purebite_users", users); // تحديث localStorage
        renderUsers(); // إعادة عرض الجدول
        userIndexToDelete = null; // إعادة تعيين المتغير
        // إغلاق الـ Modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUser'));
        deleteModal.hide();


        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
        });
    }
});
