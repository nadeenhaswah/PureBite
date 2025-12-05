const mainLinks = document.querySelectorAll('.main-item');
const branchLinks = document.querySelectorAll('.main-item ul li');

mainLinks.forEach(element => {
    element.addEventListener("click", function () {
        mainLinks.forEach(item => {
            if (item !== element) {
                item.classList.remove('active');
            }
        });

        element.classList.toggle('active');
    });
});
branchLinks.forEach(element => {
    element.addEventListener("click", function () {
        mainLinks.forEach(item => {
            if (item !== element) {
                item.classList.remove('active');
            }
        });

        element.classList.toggle('active');
    });
});
