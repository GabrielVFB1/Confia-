document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const pagesList = document.getElementById('pages');
    
    menuButton.addEventListener('click', function() {
        if (pagesList.style.display === 'block') {
            pagesList.style.display = 'none';
        } else {
            pagesList.style.display = 'block';
        }
    });
    
    const header = document.getElementById('header');
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && event.target !== menuButton) {
            pagesList.style.display = 'none';
        }
    });
});
document.getElementById("modeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark");
   
});