const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchResults = document.getElementById('searchResults');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.querySelector('html');

// Menu Lateral
function openMenu() {
    sidebar.classList.add('side-open');
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('opacity-100');
}

function closeMenu() {
    sidebar.classList.remove('side-open');
    overlay.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-100');
}

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.contains('side-open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('side-open')) {
        closeMenu();
    }
});

// Tema Claro/Escuro
function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
}

themeToggle.addEventListener('click', toggleTheme);

// Carregar tema salvo
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        html.classList.remove('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});