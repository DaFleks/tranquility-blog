var navbar = document.querySelector('.navbar-container');
var navbarLinks = document.querySelectorAll('.navbar-item');

window.addEventListener('scroll', event => {
    if (window.scrollY > 50) {
        navbar.classList.remove('navbar-top');
        navbar.classList.add('navbar-scroll');
    } else {
        navbar.classList.remove('navbar-scroll');
        navbar.classList.add('navbar-top');
    }
})