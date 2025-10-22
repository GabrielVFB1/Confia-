// --- SELETORES GLOBAIS (MENU, TEMA) ---
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.querySelector('html');

// --- SELETORES DA PÁGINA DO EDITOR ---
const imageUpload = document.getElementById('image-upload');
const fileNameSpan = document.getElementById('file-name');
const imagePreview = document.getElementById('image-preview');
const publishButton = document.getElementById('publish-button');
const articleTitle = document.getElementById('article-title');
const articleCategory = document.getElementById('article-category');
const articleTags = document.getElementById('article-tags');
const textEditor = document.getElementById('text-editor');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// --- LÓGICA DO TEMPLATE (MENU, TEMA) ---
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

function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark'); 
        html.classList.add('light');
        themeIcon.classList.remove('fa-moon'); 
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light'); 
        html.classList.add('dark');
        themeIcon.classList.remove('fa-sun'); 
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
}

function carregarTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.add(savedTheme);
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-sun'); 
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon'); 
        themeIcon.classList.add('fa-sun');
    }
}

function performSearch() {
    console.log("A busca foi acionada.");
    searchResults.innerHTML = `<div class="p-4 text-gray-500 dark:text-gray-400">Funcionalidade de busca não disponível no modo de edição.</div>`;
}

async function publicarNoticia() {
    const titulo = articleTitle.value;
    const categoria = articleCategory.value;
    const conteudo = textEditor.innerHTML;
    const tags = articleTags.value;
    const imagemArquivo = imageUpload.files[0];
    
    if (!titulo || !categoria || !conteudo) {
        alert('Por favor, preencha o título, a categoria e o conteúdo.');
        return;
    }
    
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('categoria', categoria);
    formData.append('tags', tags);
    formData.append('conteudo', conteudo);
    if (imagemArquivo) {
        formData.append('imagemCapa', imagemArquivo);
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/noticias', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            const noticiaSalva = await response.json();
            alert('Notícia publicada com sucesso! Redirecionando...');
            window.location.href = `artigo.html?id=${noticiaSalva._id}`;
        } else {
            const errorData = await response.json();
            alert(`Erro ao publicar notícia: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro de conexão. Verifique se o servidor backend está rodando.');
    }
}

// --- EVENT LISTENERS ---
menuToggle.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    sidebar.classList.contains('side-open') ? closeMenu() : openMenu(); 
});

overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape' && sidebar.classList.contains('side-open')) closeMenu(); 
});

themeToggle.addEventListener('click', toggleTheme);

if (searchInput && searchButton) {
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
}

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = imagePreview.querySelector('img');
            img.src = e.target.result;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = 'Nenhum arquivo selecionado';
        imagePreview.classList.add('hidden');
    }
});

publishButton.addEventListener('click', publicarNoticia);

textEditor.addEventListener('paste', (event) => {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
});

// --- INICIALIZAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    carregarTema();
});