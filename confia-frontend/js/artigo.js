// js/artigo.js (VERSÃO FINAL COMPLETA - COM AUTH, TEMA, E DADOS DA IA)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    userProfileButton, profileModal, authLinkSidebar, editorLinkSidebar, modalLogoutContainer,
    botaoCompartilhar; // Seletores específicos da página

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenArtigo = false;
function openMenuArtigo() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenArtigo = true; }
function closeMenuArtigo() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenArtigo = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemeArtigo() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaArtigo() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalArtigo(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalArtigo(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO ---
function verificarLoginArtigo() {
    const token = localStorage.getItem('authToken'); let userInfo = null; const sUI = localStorage.getItem('userInfo');
    if(sUI){try{userInfo=JSON.parse(sUI);}catch(e){localStorage.clear();token=null;userInfo=null;}}
    const cPB = document.getElementById('user-profile'); const cAL = document.getElementById('auth-link'); const cEL = document.querySelector('nav a[href="editor.html"]'); const cPM = document.getElementById('profile-modal'); const cMLC = cPM ? cPM.querySelector('#modal-logout-container') : null;
    if(!cPB){console.error("CRÍTICO: #user-profile NÃO ENCONTRADO!"); return;}
    const nPB = cPB.cloneNode(true); const uNS = nPB.querySelector('span'); const uI = nPB.querySelector('img');
    if (cPB.parentNode) { cPB.parentNode.replaceChild(nPB, cPB); } else { console.error("Pai do #user-profile não encontrado"); }

    if (token && userInfo && userInfo.nome) { // LOGADO
        const uN=userInfo.nome,uE=userInfo.email||'';
        if(uNS)uNS.textContent=uN; if(uI)uI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
        nPB.href='#'; nPB.addEventListener('click',toggleProfileModalArtigo);
        if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutArtigo); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='flex';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-a" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-a'); if(l)l.addEventListener('click',fazerLogoutArtigo);}}
    } else { // DESLOGADO
        if(uNS)uNS.textContent='Fazer Login'; if(uI)uI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href='login.html';
        if(cAL){const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='none';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza referência global
}
function fazerLogoutArtigo(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginArtigo();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- FUNÇÃO escapeHtml ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}


// --- LÓGICA ESPECÍFICA DA PÁGINA (Carregar Notícia) ---

async function carregarNoticia() {
    // Seletores dos elementos do artigo
    const tituloEl = document.getElementById('artigo-titulo');
    const conteudoEl = document.getElementById('artigo-conteudo');
    const tagsContainer = document.getElementById('artigo-tags-container');
    const scoreContainer = document.getElementById('artigo-score-container');
    const imgElement = document.getElementById('artigo-imagem');
    
    // Seletores dos novos elementos da IA
    const iaBox = document.getElementById('ia-analysis-box');
    const iaResumo = document.getElementById('ia-resumo');
    const iaRevisao = document.getElementById('ia-revisao');

    // --- NOVOS SELETORES DO AUTOR ---
    const autorImg = document.getElementById('artigo-autor-img');
    const autorLink = document.getElementById('artigo-autor-link');
    const dataEl = document.getElementById('artigo-data');
    // -----------------------------------

    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');
    if (!noticiaId) {
        if (tituloEl) tituloEl.innerText = "Erro: ID da notícia não encontrado.";
        if (conteudoEl) conteudoEl.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/${noticiaId}`);
        if (!response.ok) throw new Error('Notícia não encontrada');
        const noticia = await response.json(); // Agora noticia contém { ..., autor: { _id: '...', nome: 'Bruno' } }

        // --- PREENCHE DADOS BÁSICOS ---
        document.title = noticia.titulo + " - Confia!";
        if (tituloEl) tituloEl.innerText = escapeHtml(noticia.titulo);
        if (conteudoEl) {
            let conteudo = noticia.conteudo.replace(/style="[^"]*"/g, "");
            conteudoEl.innerHTML = conteudo;
        }

        // --- PREENCHE DADOS DO AUTOR (NOVO) ---
        if (noticia.autor && noticia.autor.nome) {
            if (autorLink) {
                autorLink.innerText = escapeHtml(noticia.autor.nome);
                // (Passo 8) O link para o perfil do autor
                autorLink.href = `perfil.html?id=${noticia.autor._id}`; 
            }
            if (autorImg) {
                autorImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(noticia.autor.nome)}&background=3b82f6&color=fff&bold=true`;
                autorImg.alt = `Avatar de ${escapeHtml(noticia.autor.nome)}`;
                autorImg.classList.remove('hidden');
            }
        } else if (autorLink) {
            autorLink.innerText = "Autor Desconhecido";
            autorLink.href = "#";
        }
        if (dataEl && noticia.dataPublicacao) {
             dataEl.innerText = new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }

        // --- PREENCHE BLOCO DA IA ---
        if (iaBox && iaResumo && iaRevisao) {
            const resumoValido = noticia.resumo && !noticia.resumo.includes("não aplicado") && !noticia.resumo.includes("indisponível");
            const revisaoValida = noticia.revisaoIA && !noticia.revisaoIA.includes("não executada") && !noticia.revisaoIA.includes("não disponível");

            if (resumoValido || revisaoValida) {
                iaResumo.textContent = resumoValido ? noticia.resumo : "Resumo não gerado.";
                iaRevisao.textContent = revisaoValida ? noticia.revisaoIA : "Revisão não gerada.";
                iaBox.classList.remove('hidden'); // Mostra o bloco!
            } else {
                iaBox.classList.add('hidden'); // Garante que está escondido
            }
        }

        // --- PREENCHE TAGS E CONFIABILIDADE ---
        if (tagsContainer) {
            tagsContainer.innerHTML = ''; // Limpa o container
            if (noticia.tags && noticia.tags.length > 0) {
                noticia.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    // Usando classes Tailwind
                    tagElement.className = 'bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900';
                    tagElement.innerText = escapeHtml(tag);
                    tagsContainer.appendChild(tagElement);
                });
            }
        
            // Adiciona o Score DEPOIS das tags, dentro do mesmo container
            if (scoreContainer && noticia.taxaConfiabilidade !== undefined) { // <-- CORRIGIDO
                const score = noticia.taxaConfiabilidade; // <-- CORRIGIDO
                let cor = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
                if (score < 85) cor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
                if (score < 70) cor = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
                // Adiciona HTML do score
                scoreContainer.innerHTML = `<span class="font-bold text-sm text-gray-600 dark:text-gray-400">Confiabilidade:</span><span class="${cor} text-sm font-bold px-3 py-1 rounded-full">${score}%</span>`;
                tagsContainer.appendChild(scoreContainer);
            }
        }
        
        // --- PREENCHE IMAGEM ---
        if (imgElement && noticia.imagemCapa) {
            const imagePath = noticia.imagemCapa.replace(/\\/g, '/');
            imgElement.src = `http://localhost:3000/${imagePath}`;
            imgElement.alt = `Imagem de capa para ${escapeHtml(noticia.titulo)}`;
            imgElement.classList.remove('hidden');
        }

        // --- BOTÃO COMPARTILHAR (Sua lógica original) ---
        if (botaoCompartilhar) {
            const spanCompartilhar = botaoCompartilhar.querySelector('span');
            const urlCompartilhamento = window.location.href;
            
            // Limpa listeners antigos clonando
            const newBotao = botaoCompartilhar.cloneNode(true);
            const newSpan = newBotao.querySelector('span');
            botaoCompartilhar.parentNode.replaceChild(newBotao, botaoCompartilhar);
            
            if (navigator.share) {
                newBotao.addEventListener('click', async () => {
                    try { await navigator.share({ title: noticia.titulo, text: `Confira: "${noticia.titulo}"`, url: urlCompartilhamento }); }
                    catch (error) { if (error.name !== 'AbortError') console.error('Erro share:', error); }
                });
            } else if (navigator.clipboard) {
                newBotao.addEventListener('click', async () => {
                    try { await navigator.clipboard.writeText(urlCompartilhamento); if(newSpan){const t=newSpan.innerText; newSpan.innerText='Link Copiado!'; newBotao.classList.add('bg-green-500'); setTimeout(()=>{newSpan.innerText=t; newBotao.classList.remove('bg-green-500');},2000);}}
                    catch (error) { console.error('Erro copy:', error); if(newSpan) newSpan.innerText='Erro!';}
                });
            } else { newBotao.style.display = 'none'; }
        }

        // --- CARREGA RELACIONADAS ---
        await carregarRelacionadas(noticiaId);
        
    } catch (error) {
        if(tituloEl) tituloEl.innerText = "Erro ao carregar a notícia.";
        if(conteudoEl) conteudoEl.innerHTML = `<p class="text-red-500">${escapeHtml(error.message)}</p>`;
        console.error("Erro detalhado ao carregar notícia:", error);
    }
}

// --- CARREGAR NOTÍCIAS RELACIONADAS ---
async function carregarRelacionadas(noticiaId) {
    const container = document.getElementById('relacionadas-container');
    if (!container) return;
    try {
        const response = await fetch(`http://localhost:3000/api/noticias/${noticiaId}/relacionadas`);
        const relacionadas = await response.json();
        container.innerHTML = ''; // Limpa
        if (relacionadas.length === 0) {
             container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full">Nenhuma notícia relacionada encontrada.</p>';
             return;
        }
        relacionadas.forEach(noticia => {
            const imagePath = noticia.imagemCapa ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}` : `https://source.unsplash.com/random/300x200/?news&sig=${noticia._id}`;
            container.innerHTML += `
                <a href="artigo.html?id=${noticia._id}" class="block bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img src="${imagePath}" alt="${escapeHtml(noticia.titulo || '')}" class="w-full h-32 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-gray-800 dark:text-white line-clamp-2">${escapeHtml(noticia.titulo || '')}</h3>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${noticia.dataPublicacao ? new Date(noticia.dataPublicacao).toLocaleDateString() : ''}</span>
                    </div>
                </a>`;
        });
    } catch (error) {
        console.error('Erro ao buscar relacionadas:', error);
        container.innerHTML = '<p class="text-red-500 col-span-full">Erro ao carregar relacionadas.</p>';
    }
}

// --- FUNÇÃO DE INICIALIZAÇÃO (Artigo) ---
document.addEventListener('DOMContentLoaded', () => {
    // Define seletores globais AQUI
    menuToggle = document.getElementById('menuToggle'); sidebar = document.getElementById('sidebar'); overlay = document.getElementById('overlay');
    themeToggle = document.getElementById('themeToggle'); themeIcon = document.getElementById('theme-icon'); html = document.querySelector('html');
    userProfileButton = document.getElementById('user-profile'); profileModal = document.getElementById('profile-modal');
    authLinkSidebar = document.getElementById('auth-link'); editorLinkSidebar = document.querySelector('nav a[href="editor.html"]');
    modalLogoutContainer = profileModal ? profileModal.querySelector('#modal-logout-container') : null;
    botaoCompartilhar = document.getElementById('botao-compartilhar'); // Define o botão compartilhar globalmente

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();menuOpenArtigo?closeMenuArtigo():openMenuArtigo();});
    if(overlay)overlay.addEventListener('click',closeMenuArtigo);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemeArtigo);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenArtigo)closeMenuArtigo();});
    document.addEventListener('click',handleClickOutsideModalArtigo);

    // Chama as funções de inicialização
    carregarTemaArtigo();
    verificarLoginArtigo(); // VERIFICA O LOGIN
    carregarNoticia(); // CARREGA A NOTÍCIA (função principal desta página)
});