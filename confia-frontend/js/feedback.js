// Lógica do Template (Menu, Tema)
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.querySelector('html');

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
    if (e.key === 'Escape' && sidebar.classList.contains('side-open')) closeMenu(); 
});

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

themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.add(savedTheme);
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-sun'); 
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon'); 
        themeIcon.classList.add('fa-sun');
    }
});

// Código para o formulário de feedback
const feedbackForm = document.getElementById('feedback-form');

feedbackForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const artigoAvaliado = document.getElementById('article').value;
    const avaliacao = document.getElementById('rating').value;
    const comentario = document.getElementById('comment').value;

    if (!avaliacao || !comentario) {
        alert('Por favor, preencha sua avaliação e o comentário.');
        return;
    }

    const feedbackData = {
        artigoAvaliado,
        avaliacao,
        comentario
    };

    try {
        const response = await fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            alert('Obrigado pelo seu feedback!');
            feedbackForm.reset(); // Limpa o formulário
        } else {
            alert('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão com o servidor.');
    }
});

const articleInput = document.getElementById('article');
const searchResultsContainer = document.getElementById('feedback-search-results');

// Adiciona um "escutador" para o evento de digitação no campo
articleInput.addEventListener('input', async () => {
    const query = articleInput.value.trim();
    searchResultsContainer.innerHTML = ''; // Limpa resultados anteriores
    searchResultsContainer.style.display = 'none';

    if (query.length < 3) {
        return; // Só busca com 3+ caracteres
    }

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${query}`);
        const resultados = await response.json();

        if (resultados.length > 0) {
            searchResultsContainer.style.display = 'block';
            resultados.forEach(noticia => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerText = noticia.titulo;

                // Ação de clique: preenche o campo e limpa os resultados
                resultItem.addEventListener('click', () => {
                    articleInput.value = noticia.titulo;
                    searchResultsContainer.innerHTML = '';
                    searchResultsContainer.style.display = 'none';
                });

                searchResultsContainer.appendChild(resultItem);
            });
        } else {
            searchResultsContainer.style.display = 'block';
            searchResultsContainer.innerHTML = '<div class="search-result-item">Nenhum artigo encontrado.</div>';
        }

    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
    }
});

// Opcional: esconde os resultados quando o usuário clica fora
articleInput.addEventListener('blur', () => {
    // Adiciona um pequeno atraso para permitir que o clique no resultado seja registrado
    setTimeout(() => {
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.style.display = 'none';
    }, 200);
});