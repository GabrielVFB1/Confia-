// js/politica.js (VERSÃO FINAL COMPLETA E CORRIGIDA)

// --- SELETORES GLOBAIS ---
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResultsContainer = document.getElementById('searchResults');
const searchDropdown = document.getElementById('searchDropdown');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.querySelector('html');
const newsListContainer = document.getElementById('news-list'); // Container das notícias
const loadMorePoliticaBtn = document.getElementById('view-all-btn'); // Botão Carregar Mais

// --- VARIÁVEIS DE PAGINAÇÃO ---
let paginaAtualPolitica = 1;
let totalPaginasPolitica = 1;
let carregandoMaisPolitica = false;

// --- LÓGICA DO MENU LATERAL ---
let menuOpenPolitica = false;
function openMenuPolitica() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add('side-open');
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('opacity-100');
    menuOpenPolitica = true;
}
function closeMenuPolitica() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('side-open');
    overlay.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-100');
    menuOpenPolitica = false;
}
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.contains('side-open') ? closeMenuPolitica() : openMenuPolitica();
    });
}
if (overlay) {
    overlay.addEventListener('click', closeMenuPolitica);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('side-open')) {
        closeMenuPolitica();
    }
});

// --- LÓGICA DO TEMA (CLARO/ESCURO) ---
function toggleThemePolitica() {
    if (!html || !themeIcon) return;
    const isDark = html.classList.toggle('dark');
    html.classList.toggle('light', !isDark);

    if (isDark) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
}
if (themeToggle) {
    themeToggle.addEventListener('click', toggleThemePolitica);
}

function carregarTemaPolitica() {
    if (!html || !themeIcon) return;
    const preference = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = preference || (systemPrefersDark ? 'dark' : 'light');

    html.classList.remove('light', 'dark');
    html.classList.add(initialTheme);

    if (initialTheme === 'dark') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// --- FUNÇÃO escapeHtml (Necessária para Segurança) ---
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

// --- LÓGICA DA BARRA DE BUSCA GLOBAL ---
async function performSearchPolitica() {
    if (!searchInput || !searchResultsContainer || !searchDropdown) return;
    const query = searchInput.value.trim();
    searchResultsContainer.innerHTML = '';

    if (query.length < 3) {
        searchDropdown.classList.add('hidden');
        return;
    }

    searchDropdown.classList.remove('hidden');
    searchResultsContainer.innerHTML = '<div class="p-4 text-gray-500 dark:text-gray-400">Buscando...</div>';

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Falha na busca');
        const resultados = await response.json();
        searchResultsContainer.innerHTML = '';

        if (resultados.length === 0) {
            searchResultsContainer.innerHTML = `<div class="p-4 text-gray-500 dark:text-gray-400">Nenhum resultado encontrado para "${escapeHtml(query)}".</div>`;
        } else {
            resultados.forEach(noticia => {
                searchResultsContainer.innerHTML += `
                    <a href="artigo.html?id=${noticia._id}" class="block p-3 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-200 dark:border-slate-600">
                        <div class="font-medium text-gray-800 dark:text-gray-200">${escapeHtml(noticia.titulo)}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>${escapeHtml(noticia.categoria.toUpperCase())}</span>
                        </div>
                    </a>`;
            });
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        searchResultsContainer.innerHTML = `<div class="p-4 text-red-500">Erro ao conectar com a busca.</div>`;
    }
}
let searchTimeoutPolitica;
if (searchInput) {
    searchInput.addEventListener('focus', () => {
         if (searchInput.value.length >= 3 && searchDropdown) searchDropdown.classList.remove('hidden');
    });
    searchInput.addEventListener('blur', () => {
         if (searchDropdown) setTimeout(() => searchDropdown.classList.add('hidden'), 200);
    });
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeoutPolitica);
        searchTimeoutPolitica = setTimeout(performSearchPolitica, 300);
    });
}
if (searchButton) {
    searchButton.addEventListener('click', performSearchPolitica);
}


// --- LÓGICA DE CARREGAMENTO DAS NOTÍCIAS DE POLÍTICA ---
async function carregarNoticiasPolitica(pagina = 1, anexar = false) {
    if (!newsListContainer || carregandoMaisPolitica) {
        return;
    }

    carregandoMaisPolitica = true;
    const limitePorPagina = 6;

    if (loadMorePoliticaBtn && anexar) {
        loadMorePoliticaBtn.textContent = 'Carregando...';
        loadMorePoliticaBtn.disabled = true;
    }
    if (!anexar) newsListContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-6">Carregando notícias de política...</p>';

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/categoria/politica?page=${pagina}&limit=${limitePorPagina}`);
        if (!response.ok) throw new Error(`Falha ao buscar notícias de política (Status: ${response.status})`);
        const dadosPaginados = await response.json();

        const noticias = dadosPaginados.noticias || [];
        paginaAtualPolitica = dadosPaginados.paginaAtual || pagina;
        totalPaginasPolitica = dadosPaginados.totalPaginas || paginaAtualPolitica;

        if (!anexar) {
            newsListContainer.innerHTML = '';
        }

        if (noticias.length === 0 && !anexar) {
            newsListContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-6">Nenhuma notícia de política encontrada.</p>';
            if (loadMorePoliticaBtn) loadMorePoliticaBtn.style.display = 'none';
            return;
        }

        noticias.forEach(noticia => {
            newsListContainer.insertAdjacentHTML('beforeend', renderizarCardNoticiaPolitica(noticia));
        });

        if (loadMorePoliticaBtn) {
            if (paginaAtualPolitica >= totalPaginasPolitica) {
                loadMorePoliticaBtn.style.display = 'none';
            } else {
                loadMorePoliticaBtn.style.display = 'block'; // Ou 'inline-block' dependendo do CSS
                loadMorePoliticaBtn.textContent = 'Carregar mais notícias de Política';
                loadMorePoliticaBtn.disabled = false;
            }
        }

    } catch (error) {
        console.error('Erro ao carregar notícias de política:', error);
        if (!anexar) {
            newsListContainer.innerHTML = `<p class="text-red-500 col-span-full text-center py-6">Não foi possível carregar as notícias (${escapeHtml(error.message)}).</p>`;
        }
        if (loadMorePoliticaBtn) {
             loadMorePoliticaBtn.textContent = 'Tentar carregar mais';
             loadMorePoliticaBtn.disabled = false;
             loadMorePoliticaBtn.style.display = anexar ? 'block' : 'none';
        }
    } finally {
        carregandoMaisPolitica = false;
    }
}

// --- FUNÇÃO AUXILIAR PARA RENDERIZAR CARD NA PÁGINA POLÍTICA (LIMPA) ---
function renderizarCardNoticiaPolitica(noticia) {
    const imagePath = noticia.imagemCapa
        ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}`
        : `https://source.unsplash.com/random/300x200/?politics,government&sig=${noticia._id}`;

    const resumo = (noticia.resumo && !noticia.resumo.includes("não aplicado") && !noticia.resumo.includes("indisponível"))
                   ? noticia.resumo
                   : noticia.conteudo.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

    let scoreColorClasses = 'hidden';
    let scoreDisplay = '';
    if (noticia.taxaConfiabilidade !== undefined && noticia.taxaConfiabilidade !== null) {
         const score = noticia.taxaConfiabilidade;
         scoreDisplay = `${score}%`;
         scoreColorClasses = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
         if (score < 85) scoreColorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
         if (score < 70) scoreColorClasses = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
    }

    return `
        <article class="news-card bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl w-full">
            <div class="news-layout md:flex">
                <div class="news-image md:w-1/3 md:flex-shrink-0">
                    <img src="${imagePath}" alt="Imagem da notícia ${escapeHtml(noticia.titulo)}" class="w-full h-32 md:h-full object-cover">
                </div>
                <div class="news-content p-4 md:w-2/3 flex flex-col justify-between">
                     <div>
                        <div class="news-meta flex flex-wrap justify-between items-center text-xs mb-1 gap-1">
                            <span class="news-category national bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 px-2 py-0.5 rounded font-semibold">${escapeHtml(noticia.categoria.toUpperCase())}</span>
                            <span class="${scoreColorClasses} font-bold px-2 py-0.5 rounded-full text-xs" title="Taxa de Confiabilidade">
                                <i class="fas fa-shield-alt mr-1 opacity-75"></i> ${scoreDisplay}
                            </span>
                            <span class="news-time text-gray-500 dark:text-gray-400">${new Date(noticia.dataPublicacao).toLocaleDateString()}</span>
                        </div>
                        <h4 class="news-title text-md font-bold text-gray-800 dark:text-white mt-1 mb-1 line-clamp-2">
                             <a href="artigo.html?id=${noticia._id}" class="hover:underline">${escapeHtml(noticia.titulo)}</a>
                        </h4>
                    </div>
                    <p class="news-excerpt text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">${escapeHtml(resumo)}</p>
                    <a href="artigo.html?id=${noticia._id}" class="news-link text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm mt-2 self-start">
                        Leia mais <i class="fas fa-arrow-right ml-1 text-xs"></i>
                    </a>
                </div>
            </div>
        </article>
    `;
}


// --- EVENT LISTENER DO BOTÃO "CARREGAR MAIS" ---
if (loadMorePoliticaBtn) {
    loadMorePoliticaBtn.style.display = 'none'; // Começa escondido
    loadMorePoliticaBtn.addEventListener('click', () => {
        if (!carregandoMaisPolitica && paginaAtualPolitica < totalPaginasPolitica) {
            carregarNoticiasPolitica(paginaAtualPolitica + 1, true);
        }
    });
} else {
    const viewAllContainer = document.getElementById('view-all');
    if(viewAllContainer) viewAllContainer.style.display = 'none';
    console.warn("Botão 'view-all-btn' (Carregar Mais) não encontrado no HTML.");
}


// --- FUNÇÃO DE INICIALIZAÇÃO DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    carregarTemaPolitica(); // Carrega o tema
    // Adicione aqui chamadas para inicializar gráficos estáticos, se houver
    carregarNoticiasPolitica(1, false); // Carrega a primeira página de notícias
});