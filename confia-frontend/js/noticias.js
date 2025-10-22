// js/noticias.js (VERSÃO FINAL COM PAGINAÇÃO FUNCIONAL)

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
const articlesGrid = document.getElementById('articles-grid');
const loadMoreBtn = document.getElementById('load-more-btn'); // Botão Carregar Mais

// --- VARIÁVEIS DE PAGINAÇÃO ---
let paginaAtual = 1;
let totalPaginas = 1;
let carregandoMais = false; // Flag para evitar cliques múltiplos

// --- LÓGICA DO MENU LATERAL ---
function openMenu() {
    if (sidebar) sidebar.classList.add('side-open');
    if (overlay) {
        overlay.classList.remove('pointer-events-none');
        overlay.classList.add('opacity-100');
    }
}
function closeMenu() {
    if (sidebar) sidebar.classList.remove('side-open');
    if (overlay) {
        overlay.classList.add('pointer-events-none');
        overlay.classList.remove('opacity-100');
    }
}
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.contains('side-open') ? closeMenu() : openMenu();
    });
}
if (overlay) {
    overlay.addEventListener('click', closeMenu);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('side-open')) closeMenu();
});

// --- LÓGICA DO TEMA ---
function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark'); html.classList.add('light');
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light'); html.classList.add('dark');
        if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        localStorage.setItem('theme', 'dark');
    }
}
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
function carregarTema() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    html.classList.add(savedTheme);
    if (themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
        }
    }
}

// --- LÓGICA DA BARRA DE BUSCA ---
if (searchInput) {
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 3 && searchDropdown) searchDropdown.classList.remove('hidden');
    });
    searchInput.addEventListener('blur', () => {
        if (searchDropdown) setTimeout(() => searchDropdown.classList.add('hidden'), 200);
    });
}

async function performSearch() {
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
let searchTimeout;
if (searchInput) {
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
}
if (searchButton) {
    searchButton.addEventListener('click', performSearch);
}

// --- LÓGICA DE CARREGAMENTO DAS NOTÍCIAS (COM PAGINAÇÃO REAL) ---
async function carregarNoticiasReais(pagina = 1, anexar = false) {
    if (!articlesGrid || carregandoMais) {
        return;
    }

    carregandoMais = true;
    const limitePorPagina = 6; // Carrega 6 notícias por vez

    // Feedback visual
    if (loadMoreBtn && anexar) {
        loadMoreBtn.textContent = 'Carregando...';
        loadMoreBtn.disabled = true; // Desabilita enquanto carrega
    }
    // Só mostra 'Carregando...' no grid se for a primeira carga
    if (!anexar) articlesGrid.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">Carregando notícias...</p>';

    try {
        const response = await fetch(`http://localhost:3000/api/noticias?page=${pagina}&limit=${limitePorPagina}`);
        if (!response.ok) throw new Error(`Falha ao buscar notícias (Status: ${response.status})`);
        const dadosPaginados = await response.json();

        const noticias = dadosPaginados.noticias || [];
        paginaAtual = dadosPaginados.paginaAtual || pagina; // Atualiza a página atual
        totalPaginas = dadosPaginados.totalPaginas || paginaAtual; // Atualiza o total de páginas

        // Se for a primeira página (não anexando), limpa o grid
        if (!anexar) {
            articlesGrid.innerHTML = '';
        }

        // Verifica se há notícias para exibir
        if (noticias.length === 0 && !anexar) {
            articlesGrid.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">Nenhuma notícia encontrada.</p>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none'; // Esconde botão se não há notícias
            return; // Importante sair aqui
        }

        // Adiciona os novos cards ao grid
        noticias.forEach(noticia => {
            // Adiciona o card renderizado ao final do grid
            articlesGrid.insertAdjacentHTML('beforeend', renderizarCardNoticia(noticia));
        });

        // Atualiza o botão "Carregar Mais"
        if (loadMoreBtn) {
            if (paginaAtual >= totalPaginas) {
                loadMoreBtn.style.display = 'none'; // Esconde se chegou na última página ou além
            } else {
                loadMoreBtn.style.display = 'block'; // Mostra se ainda há páginas
                loadMoreBtn.textContent = 'Carregar mais reportagens';
                loadMoreBtn.disabled = false; // Reabilita o botão
            }
        }

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        // Mostra erro apenas se for a primeira carga (não anexando)
        if (!anexar) {
            articlesGrid.innerHTML = `<p class="text-red-500 col-span-full text-center py-10">Não foi possível carregar as notícias. Verifique a conexão com o backend (${escapeHtml(error.message)}).</p>`;
        }
        // Se deu erro ao carregar mais, reseta o botão para tentar de novo
        if (loadMoreBtn && anexar) {
             loadMoreBtn.textContent = 'Tentar carregar mais';
             loadMoreBtn.disabled = false; // Reabilita
             loadMoreBtn.style.display = 'block'; // Garante que está visível
        } else if (loadMoreBtn && !anexar) { // Esconde se erro na carga inicial
             loadMoreBtn.style.display = 'none';
        }
    } finally {
        carregandoMais = false; // Permite novos cliques/cargas
    }
}

// --- FUNÇÃO AUXILIAR PARA RENDERIZAR UM CARD (100% LIMPA) ---
function renderizarCardNoticia(noticia) {
    // Lógica de imagem e resumos
    const imagePath = noticia.imagemCapa
        ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}`
        : `https://source.unsplash.com/random/400x250/?news&sig=${noticia._id}`;

    const originalSummaryText = noticia.conteudo.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    const aiSummaryText = (noticia.resumo && !noticia.resumo.includes("não aplicado") && !noticia.resumo.includes("indisponível"))
                          ? noticia.resumo
                          : "Resumo da IA não disponível.";

    // Lógica de cores da confiabilidade
    let scoreColorClasses = 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300';
    let scoreDisplay = 'N/A';
    if (noticia.taxaConfiabilidade !== undefined && noticia.taxaConfiabilidade !== null) {
         const score = noticia.taxaConfiabilidade;
         scoreDisplay = `${score}%`;
         scoreColorClasses = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
         if (score < 85) scoreColorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
         if (score < 70) scoreColorClasses = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
    }

    // Retorna o HTML do card (sem comentários internos)
    return `
        <article class="article-card bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl flex flex-col">
            <img src="${imagePath}" alt="Imagem da notícia ${escapeHtml(noticia.titulo)}" class="w-full h-48 object-cover">
            <div class="article-content p-4 flex flex-col flex-grow">
                <div class="article-meta flex flex-wrap justify-between items-center text-xs mb-2 gap-y-1">
                    <span class="article-category ${escapeHtml(noticia.categoria.toLowerCase())} bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 font-semibold px-2.5 py-0.5 rounded-full">${escapeHtml(noticia.categoria.toUpperCase())}</span>
                    <span class="article-score ${scoreColorClasses} font-bold px-2.5 py-0.5 rounded-full" title="Taxa de Confiabilidade">
                        <i class="fas fa-shield-alt mr-1 opacity-75"></i> ${scoreDisplay}
                    </span>
                    <span class="article-date text-gray-500 dark:text-gray-400 w-full md:w-auto text-right md:text-left mt-1 md:mt-0">${new Date(noticia.dataPublicacao).toLocaleDateString()}</span>
                </div>
                <h3 class="article-title text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    <a href="artigo.html?id=${noticia._id}" class="hover:underline">${escapeHtml(noticia.titulo)}</a>
                </h3>
                <p id="summary-${noticia._id}"
                   class="article-summary text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 flex-grow"
                   data-original-summary="${escapeHtml(originalSummaryText)}"
                   data-ai-summary="${escapeHtml(aiSummaryText)}">
                   ${escapeHtml(originalSummaryText)}
                </p>
                <div class="article-actions flex justify-between items-center mt-auto">
                    <a href="artigo.html?id=${noticia._id}" class="article-link text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
                        Leia mais <i class="fas fa-arrow-right ml-1 text-xs"></i>
                    </a>
                    <button class="summary-btn bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            onclick="toggleSummary('summary-${noticia._id}', this)">
                        Resumo IA
                    </button>
                </div>
            </div>
        </article>
    `;
}

// --- Função auxiliar para escapar HTML ---
// --- Função auxiliar para escapar HTML ---
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        // Return an empty string if input is not a string
        return "";
    }
    // Replace special HTML characters with their corresponding entities
    return unsafe
         .replace(/&/g, "&amp;")  // Ampersand
         .replace(/</g, "&lt;")   // Less than
         .replace(/>/g, "&gt;")   // Greater than  <-- Error was likely here
         .replace(/"/g, "&quot;") // Double quote
         .replace(/'/g, "&#039;"); // Single quote (apostrophe)
 }

// --- EVENT LISTENER DO BOTÃO "CARREGAR MAIS" ---
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Só carrega mais se não estiver carregando e se houver mais páginas
        if (!carregandoMais && paginaAtual < totalPaginas) {
            carregarNoticiasReais(paginaAtual + 1, true); // Pede a próxima página e anexa
        }
    });
} else {
    // Esconde o container do botão se o botão não existe no HTML
    const loadMoreContainer = document.getElementById('load-more');
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    console.warn("Elemento 'load-more-btn' não encontrado no HTML. Funcionalidade 'Carregar Mais' desativada.");
}

// --- FUNÇÃO DE INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarTema();
    carregarNoticiasReais(1, false); // Carrega a primeira página ao iniciar
});