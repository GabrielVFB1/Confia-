// js/politica.js (VERSÃO FINAL COMPLETA - COM NOVO MODAL)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    newsListContainer, loadMorePoliticaBtn, userProfileButton, profileModal,
    authLinkSidebar, editorLinkSidebar, modalLogoutContainer, modalProfileLink, modalMyProfileLink;

// --- VARIÁVEIS DE PAGINAÇÃO ---
let paginaAtualPolitica = 1;
let totalPaginasPolitica = 1;
let carregandoMaisPolitica = false;

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenPolitica = false;
function openMenuPolitica() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenPolitica = true; }
function closeMenuPolitica() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenPolitica = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemePolitica() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaPolitica() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalPolitica(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalPolitica(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO (Atualizada para novo Modal) ---
function verificarLoginPolitica() {
    const token = localStorage.getItem('authToken'); let userInfo = null; const sUI = localStorage.getItem('userInfo');
    if(sUI){try{userInfo=JSON.parse(sUI);}catch(e){localStorage.clear();token=null;userInfo=null;}}
    
    const cPB = document.getElementById('user-profile'); 
    const cAL = document.getElementById('auth-link'); 
    const cEL = document.querySelector('nav a[href="editor.html"]'); 
    const cPM = document.getElementById('profile-modal');
    const cMLC = cPM ? cPM.querySelector('#modal-logout-container') : null;
    const cMPL_Top = cPM ? cPM.querySelector('#modal-profile-link') : null; // Link do Topo do Modal
    const cMPL_Text = cPM ? cPM.querySelector('#modal-my-profile-link') : null; // Link "Meu Perfil"

    if(!cPB){console.error("CRÍTICO: #user-profile NÃO ENCONTRADO!"); return;}
    
    const nPB = cPB.cloneNode(true); const uNS = nPB.querySelector('span'); const uI = nPB.querySelector('img');
    if (cPB.parentNode) { cPB.parentNode.replaceChild(nPB, cPB); } else { console.error("Pai do #user-profile não encontrado"); }

    if (token && userInfo && userInfo.nome) { // --- LOGADO ---
        const uN=userInfo.nome, uE=userInfo.email||'', uID=userInfo.id||'';
        if(uNS)uNS.textContent=uN; if(uI)uI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
        nPB.href='#'; nPB.addEventListener('click',toggleProfileModalPolitica);
        if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutPolitica); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='flex';
        
        if(cPM){ // Atualiza Modal
             const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img');
             if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
             if(cMPL_Top) cMPL_Top.href = `perfil.html?id=${uID}`; // Define link do perfil (topo)
             if(cMPL_Text) cMPL_Text.href = `perfil.html?id=${uID}`; // Define link do perfil (texto)
             if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-p" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-p'); if(l)l.addEventListener('click',fazerLogoutPolitica);}}
    
    } else { // --- DESLOGADO ---
        if(uNS)uNS.textContent='Fazer Login'; if(uI)uI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href='login.html';
        if(cAL){const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='none';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href="login.html"; if(cMPL_Text) cMPL_Text.href="login.html"; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza a referência global
}
function fazerLogoutPolitica(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginPolitica();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- FUNÇÃO escapeHtml ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}

// --- LÓGICA DA BARRA DE BUSCA ---
async function performSearchPolitica() {
    if(!searchInput||!searchResultsContainer||!searchDropdown)return; const q=searchInput.value.trim(); searchResultsContainer.innerHTML=''; if(q.length<3){searchDropdown.classList.add('hidden');return;} searchDropdown.classList.remove('hidden'); searchResultsContainer.innerHTML='<div class="p-4 text-gray-500 dark:text-gray-400">Buscando...</div>';
    try{const r=await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(q)}`); if(!r.ok)throw new Error(`Falha ${r.status}`); const d=await r.json(); searchResultsContainer.innerHTML='';
        if(d.length===0){searchResultsContainer.innerHTML=`<div class="p-4 text-gray-500 dark:text-gray-400">Nada para "${escapeHtml(q)}".</div>`;}
        else{d.forEach(n=>{searchResultsContainer.innerHTML+=`<a href="artigo.html?id=${n._id}" class="block p-3 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-200 dark:border-slate-600"><div class="font-medium text-gray-800 dark:text-gray-200">${escapeHtml(n.titulo)}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-1"><span>${escapeHtml(n.categoria?.toUpperCase()||'G')}</span></div></a>`;});}
    }catch(e){console.error('Erro na busca:',e); searchResultsContainer.innerHTML=`<div class="p-4 text-red-500">Erro (${escapeHtml(e.message)}).</div>`;}
}
let searchTimeoutPolitica;

// --- LÓGICA DE CARREGAMENTO DAS NOTÍCIAS DE POLÍTICA ---
async function carregarNoticiasPolitica(pagina = 1, anexar = false) {
    if (!newsListContainer || carregandoMaisPolitica) { if(!newsListContainer) console.error("Container #news-list não encontrado!"); return; }
    carregandoMaisPolitica = true; const limite = 6;
    if (loadMorePoliticaBtn && anexar) { loadMorePoliticaBtn.textContent = 'Carregando...'; loadMorePoliticaBtn.disabled = true; }
    if (!anexar) newsListContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-6">Carregando...</p>';
    try {
        const r = await fetch(`http://localhost:3000/api/noticias/categoria/politica?page=${pagina}&limit=${limite}`);
        if (!r.ok) throw new Error(`Falha ${r.status}`); const d = await r.json(); const n = d.noticias || [];
        paginaAtualPolitica = d.paginaAtual || pagina; totalPaginasPolitica = d.totalPaginas || paginaAtualPolitica;
        if (!anexar) newsListContainer.innerHTML = '';
        if (n.length === 0 && !anexar) { newsListContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-6">Nenhuma notícia.</p>'; if (loadMorePoliticaBtn) loadMorePoliticaBtn.style.display = 'none'; return; }
        n.forEach(noticia => { newsListContainer.insertAdjacentHTML('beforeend', renderizarCardNoticiaPolitica(noticia)); });
        if (loadMorePoliticaBtn) {
            if (paginaAtualPolitica >= totalPaginasPolitica) { loadMorePoliticaBtn.style.display = 'none'; }
            else { loadMorePoliticaBtn.style.display = 'block'; loadMorePoliticaBtn.textContent = 'Carregar mais'; loadMorePoliticaBtn.disabled = false; }
        }
    } catch (e) { console.error('Erro:', e); if (!anexar) newsListContainer.innerHTML = `<p class="text-red-500 text-center py-6">Erro (${escapeHtml(e.message)}).</p>`; if (loadMorePoliticaBtn) { loadMorePoliticaBtn.textContent = 'Tentar'; loadMorePoliticaBtn.disabled = false; loadMorePoliticaBtn.style.display = anexar ? 'block' : 'none'; }}
    finally { carregandoMaisPolitica = false; }
}

// --- RENDERIZAR CARD PARA POLITICA (LIMPO) ---
function renderizarCardNoticiaPolitica(noticia) {
    if (!noticia) return "";
    const img = noticia.imagemCapa ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}` : `https://source.unsplash.com/random/300x200/?politics,government&sig=${noticia._id}`;
    const rIA = noticia.resumo || "", cB = noticia.conteudo || "";
    const resumo = (rIA && !rIA.includes("não") && !rIA.includes("indis")) ? rIA : cB.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
    let sC = 'hidden', sD = '';
    if (noticia.taxaConfiabilidade !== undefined && noticia.taxaConfiabilidade !== null) {
        const s = noticia.taxaConfiabilidade; sD = `${s}%`;
        sC = 'bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900';
        if (s < 85) sC = 'bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900';
        if (s < 70) sC = 'bg-red-100 dark:bg-red-200 text-red-800 dark:text-red-900';
    }
    const cat = noticia.categoria?.toUpperCase() || 'POLÍTICA';
    const data = noticia.dataPublicacao ? new Date(noticia.dataPublicacao).toLocaleDateString() : '--';
    return `
        <article class="news-card bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl w-full">
            <div class="news-layout md:flex">
                <div class="news-image md:w-1/3 md:flex-shrink-0">
                    <img src="${img}" alt="${escapeHtml(noticia.titulo || '')}" class="w-full h-32 md:h-full object-cover">
                </div>
                <div class="news-content p-4 md:w-2/3 flex flex-col justify-between">
                     <div>
                        <div class="news-meta flex flex-wrap justify-between items-center text-xs mb-1 gap-1">
                            <span class="news-category national bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-blue-900 px-2 py-0.5 rounded font-semibold">${escapeHtml(cat)}</span>
                            <span class="${sC} font-bold px-2 py-0.5 rounded-full text-xs" title="Confiabilidade"><i class="fas fa-shield-alt mr-1 opacity-75"></i> ${sD}</span>
                            <span class="news-time text-gray-500 dark:text-gray-400">${data}</span>
                        </div>
                        <h4 class="news-title text-md font-bold text-gray-800 dark:text-white mt-1 mb-1 line-clamp-2"><a href="artigo.html?id=${noticia._id}" class="hover:underline">${escapeHtml(noticia.titulo || '')}</a></h4>
                    </div>
                    <p class="news-excerpt text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">${escapeHtml(resumo)}</p>
                    <a href="artigo.html?id=${noticia._id}" class="news-link text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm mt-2 self-start">Leia mais <i class="fas fa-arrow-right ml-1 text-xs"></i></a>
                </div>
            </div>
        </article>`;
}

// --- FUNÇÃO DE INICIALIZAÇÃO (Politica) ---
document.addEventListener('DOMContentLoaded', () => {
    // Define seletores globais AQUI
    menuToggle = document.getElementById('menuToggle'); sidebar = document.getElementById('sidebar'); overlay = document.getElementById('overlay');
    themeToggle = document.getElementById('themeToggle'); themeIcon = document.getElementById('theme-icon'); html = document.querySelector('html');
    searchInput = document.getElementById('searchInput'); searchButton = document.getElementById('searchButton'); searchDropdown = document.getElementById('searchDropdown'); searchResultsContainer = document.getElementById('searchResults');
    newsListContainer = document.getElementById('news-list'); loadMorePoliticaBtn = document.getElementById('view-all-btn');
    userProfileButton = document.getElementById('user-profile'); profileModal = document.getElementById('profile-modal');
    authLinkSidebar = document.getElementById('auth-link'); editorLinkSidebar = document.querySelector('nav a[href="editor.html"]');
    modalLogoutContainer = profileModal ? profileModal.querySelector('#modal-logout-container') : null;
    modalProfileLink = profileModal ? profileModal.querySelector('#modal-profile-link') : null;
    modalMyProfileLink = profileModal ? profileModal.querySelector('#modal-my-profile-link') : null;

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();(sidebar&&sidebar.classList.contains('side-open'))?closeMenuPolitica():openMenuPolitica();});
    if(overlay)overlay.addEventListener('click',closeMenuPolitica);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemePolitica);
    if(searchInput){searchInput.addEventListener('input',()=>{clearTimeout(searchTimeoutPolitica);searchTimeoutPolitica=setTimeout(performSearchPolitica,300);}); searchInput.addEventListener('focus',()=>{if(searchInput.value.length>=3&&searchDropdown)searchDropdown.classList.remove('hidden');}); searchInput.addEventListener('blur',()=>{if(searchDropdown)setTimeout(()=>{searchDropdown.classList.add('hidden');},200);});}
    if(searchButton)searchButton.addEventListener('click',performSearchPolitica);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenPolitica)closeMenuPolitica();});
    document.addEventListener('click',handleClickOutsideModalPolitica);

    if (loadMorePoliticaBtn) {
        loadMorePoliticaBtn.style.display = 'none';
        loadMorePoliticaBtn.addEventListener('click', () => {
            if (!carregandoMaisPolitica && paginaAtualPolitica < totalPaginasPolitica) {
                carregarNoticiasPolitica(paginaAtualPolitica + 1, true);
            }
        });
    } else { const v=document.getElementById('view-all'); if(v) v.style.display='none'; }

    // Chama Funções de Inicialização
    carregarTemaPolitica();
    verificarLoginPolitica(); // VERIFICA O LOGIN
    carregarNoticiasPolitica(1, false); // CARREGA AS NOTÍCIAS
});