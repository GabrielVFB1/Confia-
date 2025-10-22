// js/artigo.js (VERSÃO ATUALIZADA COM IA)

// --- SELETORES GLOBAIS (MENU, TEMA) ---
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.querySelector('html');

// Funções do Menu (sem alteração)
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

// Funções de Tema (sem alteração)
function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark'); html.classList.add('light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light'); html.classList.add('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'dark');
    }
}
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

function carregarTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.add(savedTheme);
    if (themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
        }
    }
}

// --- FUNÇÃO PRINCIPAL: CARREGAR NOTÍCIA ---
async function carregarNoticia() {
    // Seletores dos elementos do artigo
    const tituloEl = document.getElementById('artigo-titulo');
    const conteudoEl = document.getElementById('artigo-conteudo');
    const tagsContainer = document.getElementById('artigo-tags-container');
    const scoreContainer = document.getElementById('artigo-score-container');
    const imgElement = document.getElementById('artigo-imagem');
    const botaoCompartilhar = document.getElementById('botao-compartilhar');

    // --- Seletores dos novos elementos da IA ---
    const iaBox = document.getElementById('ia-analysis-box');
    const iaResumo = document.getElementById('ia-resumo');
    const iaRevisao = document.getElementById('ia-revisao');
    // -----------------------------------------

    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    if (!noticiaId) {
        if(tituloEl) tituloEl.innerText = "Erro: ID da notícia não encontrado.";
        console.error("ID da notícia não encontrado na URL.");
        return;
    }

    try {
        // --- BUSCA A NOTÍCIA NO BACKEND ---
        const response = await fetch(`http://localhost:3000/api/noticias/${noticiaId}`);
        if (!response.ok) {
            throw new Error(`Notícia não encontrada (Status: ${response.status})`);
        }
        const noticia = await response.json();

        // --- PREENCHE OS DADOS BÁSICOS ---
        document.title = noticia.titulo + " - Confia!";
        if(tituloEl) tituloEl.innerText = noticia.titulo;

        // Limpa estilos inline e define o conteúdo
        if(conteudoEl) {
            let conteudo = noticia.conteudo.replace(/style="[^"]*"/g, ""); // Remove styles
            conteudoEl.innerHTML = conteudo;
        }

        // --- PREENCHE AS TAGS ---
        if (tagsContainer && noticia.tags && noticia.tags.length > 0) {
            tagsContainer.innerHTML = ''; // Limpa antes de adicionar

            // Adiciona as tags primeiro
            noticia.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                // Usando as classes Tailwind do seu HTML para consistência
                tagElement.className = 'bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900';
                tagElement.innerText = tag;
                tagsContainer.appendChild(tagElement);
            });
             // Garante que o scoreContainer exista antes de tentar adicioná-lo
             if (scoreContainer) {
                 tagsContainer.appendChild(scoreContainer); // Adiciona o score container depois das tags
             }

        } else if (tagsContainer && scoreContainer) {
            // Se não houver tags, apenas garante que o score container está lá
            tagsContainer.innerHTML = '';
            tagsContainer.appendChild(scoreContainer);
        } else if (tagsContainer){
             tagsContainer.innerHTML = ''; // Limpa se não houver tags nem score
        }


        // --- PREENCHE A CONFIABILIDADE (taxaConfiabilidade) ---
        if (scoreContainer && noticia.taxaConfiabilidade !== undefined) {
             const score = noticia.taxaConfiabilidade; // <<< CORRIGIDO

             // Usando classes Tailwind para as cores (ajuste conforme seu CSS/preferência)
             let corClasses = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
             if (score < 85) corClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
             if (score < 70) corClasses = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';

            // Usando as classes Tailwind diretamente
            scoreContainer.innerHTML = `
                <span class="font-bold text-sm text-gray-600 dark:text-gray-400">Confiabilidade:</span>
                <span class="${corClasses} text-sm font-bold px-3 py-1 rounded-full">${score}%</span>
            `;
        } else if (scoreContainer) {
            // Limpa o score se não existir
            scoreContainer.innerHTML = '';
        }

        // --- PREENCHE A IMAGEM DE CAPA ---
        if (imgElement && noticia.imagemCapa) {
            const imagePath = noticia.imagemCapa.replace(/\\/g, '/');
            imgElement.src = `http://localhost:3000/${imagePath}`;
            imgElement.alt = `Imagem de capa para ${noticia.titulo}`;
            imgElement.classList.remove('hidden');
        } else if (imgElement) {
            imgElement.classList.add('hidden');
        }

        // --- LÓGICA PARA EXIBIR A ANÁLISE DA IA ---
        if (iaBox && iaResumo && iaRevisao) {
            // Verifica se a IA gerou um resumo útil
            const resumoValido = noticia.resumo && !noticia.resumo.includes("não aplicado") && !noticia.resumo.includes("indisponível");
            const revisaoValida = noticia.revisaoIA && !noticia.revisaoIA.includes("não executada") && !noticia.revisaoIA.includes("não disponível") && !noticia.revisaoIA.includes("Falha");

            if (resumoValido || revisaoValida) { // Mostra se tiver OU resumo OU revisão
                iaResumo.innerText = resumoValido ? noticia.resumo : "Resumo não gerado.";
                iaRevisao.innerText = revisaoValida ? noticia.revisaoIA : "Revisão não gerada.";
                iaBox.classList.remove('hidden'); // Mostra o bloco!
            } else {
                iaBox.classList.add('hidden'); // Garante que o bloco está escondido
            }
        }
        // ---------------------------------------------

        // --- BOTÃO DE COMPARTILHAR ---
        if (botaoCompartilhar) {
            const spanCompartilhar = botaoCompartilhar.querySelector('span');
            const urlCompartilhamento = window.location.href;

            // Remove listeners antigos para evitar duplicação
            botaoCompartilhar.replaceWith(botaoCompartilhar.cloneNode(true));
            const novoBotaoCompartilhar = document.getElementById('botao-compartilhar'); // Pega a nova referência
            const novoSpanCompartilhar = novoBotaoCompartilhar.querySelector('span'); // Pega o novo span

            if (navigator.share) {
                novoBotaoCompartilhar.style.display = 'inline-flex';
                novoBotaoCompartilhar.addEventListener('click', async () => {
                     try {
                        await navigator.share({
                            title: noticia.titulo,
                            text: `Confira esta notícia no Confia!: "${noticia.titulo}"`,
                            url: urlCompartilhamento
                        });
                    } catch (error) {
                         if (error.name !== 'AbortError') { console.error('Erro ao compartilhar:', error); }
                    }
                });
            } else if (navigator.clipboard) {
                 novoBotaoCompartilhar.style.display = 'inline-flex';
                 novoBotaoCompartilhar.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(urlCompartilhamento);
                        const textoOriginal = novoSpanCompartilhar.innerText;
                        novoSpanCompartilhar.innerText = 'Link Copiado!';
                        novoBotaoCompartilhar.classList.add('bg-green-500', 'dark:bg-green-600'); // Estilo de sucesso
                        setTimeout(() => {
                            novoSpanCompartilhar.innerText = textoOriginal;
                            novoBotaoCompartilhar.classList.remove('bg-green-500', 'dark:bg-green-600');
                        }, 2000);
                    } catch (error) {
                        console.error('Erro ao copiar link:', error);
                         if(novoSpanCompartilhar) novoSpanCompartilhar.innerText = 'Erro ao Copiar!';
                    }
                });
            } else {
                novoBotaoCompartilhar.style.display = 'none';
            }
        }

        // --- CARREGA NOTÍCIAS RELACIONADAS ---
        await carregarRelacionadas(noticiaId);

    } catch (error) {
        if(tituloEl) tituloEl.innerText = "Erro ao carregar a notícia.";
        if(conteudoEl) conteudoEl.innerHTML = `<p class="text-red-500">Não foi possível carregar o conteúdo. ${error.message}</p>`;
        console.error("Erro detalhado ao carregar notícia:", error);
    }
}

// --- FUNÇÃO PARA CARREGAR NOTÍCIAS RELACIONADAS (sem alteração significativa) ---
async function carregarRelacionadas(noticiaId) {
    const container = document.getElementById('relacionadas-container');
    if (!container) return;

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/${noticiaId}/relacionadas`);
        if (!response.ok) throw new Error('Falha ao buscar relacionadas');
        const relacionadas = await response.json();

        container.innerHTML = '';

        if (relacionadas.length === 0) {
            return;
        }

        relacionadas.forEach(noticia => {
            const imagePath = noticia.imagemCapa
                ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}`
                : `https://source.unsplash.com/random/300x200/?news&sig=${noticia._id}`;

            container.innerHTML += `
                <a href="artigo.html?id=${noticia._id}" class="block bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img src="${imagePath}" alt="Imagem da notícia ${noticia.titulo}" class="w-full h-32 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-gray-800 dark:text-white line-clamp-2">${noticia.titulo}</h3>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${new Date(noticia.dataPublicacao).toLocaleDateString()}</span>
                    </div>
                </a>
            `;
        });
    } catch (error) {
        console.error('Erro ao buscar relacionadas:', error);
    }
}

// --- INICIALIZAÇÃO DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    carregarTema();
    carregarNoticia();
});