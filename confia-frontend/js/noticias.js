// js/noticias.js (VERSÃO FINAL COMPLETA - COM AUTH, TEMA, E TODAS AS NOTÍCIAS)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    articlesGrid, loadMoreBtn, userProfileButton, profileModal,
    authLinkSidebar, editorLinkSidebar, modalLogoutContainer, modalProfileLink, modalMyProfileLink;

// --- VARIÁVEIS DE PAGINAÇÃO ---
let paginaAtualNoticias = 1;
let totalPaginasNoticias = 1;
let carregandoMaisNoticias = false;

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenNoticias = false;
function openMenuNoticias() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenNoticias = true; }
function closeMenuNoticias() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenNoticias = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemeNoticias() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaNoticias() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalNoticias(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalNoticias(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO ---
function verificarLoginNoticias() {
    const token = localStorage.getItem('authToken'); let userInfo = null; const sUI = localStorage.getItem('userInfo');
    if(sUI){try{userInfo=JSON.parse(sUI);}catch(e){localStorage.clear();token=null;userInfo=null;}}
    const cPB = document.getElementById('user-profile'); const cAL = document.getElementById('auth-link'); const cEL = document.querySelector('nav a[href="editor.html"]'); const cPM = document.getElementById('profile-modal');
    const cMLC = cPM ? cPM.querySelector('#modal-logout-container') : null;
    const cMPL_Top = cPM ? cPM.querySelector('#modal-profile-link') : null;
    const cMPL_Text = cPM ? cPM.querySelector('#modal-my-profile-link') : null;
    if(!cPB){console.error("CRÍTICO: #user-profile NÃO ENCONTRADO!"); return;}
    const nPB = cPB.cloneNode(true); const uNS = nPB.querySelector('span'); const uI = nPB.querySelector('img');
    if (cPB.parentNode) { cPB.parentNode.replaceChild(nPB, cPB); } else { console.error("Pai do #user-profile não encontrado"); }

    if (token && userInfo && userInfo.nome) { // LOGADO
        const uN=userInfo.nome, uE=userInfo.email||'', uID=userInfo.id||'';
        if(uNS)uNS.textContent=uN; if(uI)uI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
        nPB.href='#'; nPB.addEventListener('click',toggleProfileModalNoticias);
        if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutNoticias); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='flex';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href = `perfil.html?id=${uID}`; if(cMPL_Text) cMPL_Text.href = `perfil.html?id=${uID}`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-n" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-n'); if(l)l.addEventListener('click',fazerLogoutNoticias);}}
    } else { // DESLOGADO
        if(uNS)uNS.textContent='Fazer Login'; if(uI)uI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href='login.html';
        if(cAL){const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='none';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href="login.html"; if(cMPL_Text) cMPL_Text.href="login.html"; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza referência global
}
function fazerLogoutNoticias(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginNoticias();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- FUNÇÃO escapeHtml ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}

// --- LÓGICA DA BARRA DE BUSCA ---
async function performSearchNoticias() {
    if(!searchInput||!searchResultsContainer||!searchDropdown)return; const q=searchInput.value.trim(); searchResultsContainer.innerHTML=''; if(q.length<3){searchDropdown.classList.add('hidden');return;} searchDropdown.classList.remove('hidden'); searchResultsContainer.innerHTML='<div class="p-4 text-gray-500 dark:text-gray-400">Buscando...</div>';
    try{const r=await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(q)}`); if(!r.ok)throw new Error(`Falha ${r.status}`); const d=await r.json(); searchResultsContainer.innerHTML='';
        if(d.length===0){searchResultsContainer.innerHTML=`<div class="p-4 text-gray-500 dark:text-gray-400">Nada para "${escapeHtml(q)}".</div>`;}
        else{d.forEach(n=>{searchResultsContainer.innerHTML+=`<a href="artigo.html?id=${n._id}" class="block p-3 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-200 dark:border-slate-600"><div class="font-medium text-gray-800 dark:text-gray-200">${escapeHtml(n.titulo)}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-1"><span>${escapeHtml(n.categoria?.toUpperCase()||'G')}</span></div></a>`;});}
    }catch(e){console.error('Erro na busca:',e); searchResultsContainer.innerHTML=`<div class="p-4 text-red-500">Erro (${escapeHtml(e.message)}).</div>`;}
}
let searchTimeoutNoticias;

// --- LÓGICA DE CARREGAMENTO (TODAS AS NOTÍCIAS) ---
async function carregarNoticiasPaginadas(pagina = 1, anexar = false) {
    if (!articlesGrid || carregandoMaisNoticias) { if(!articlesGrid) console.error("Container #articles-grid não encontrado!"); return; }
    carregandoMaisNoticias = true; const limite = 6;
    if (loadMoreBtn && anexar) { loadMoreBtn.textContent = 'Carregando...'; loadMoreBtn.disabled = true; }
    if (!anexar) articlesGrid.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">Carregando...</p>';
    try {
        // MUDA A URL: Busca em /api/noticias (todas)
        const r = await fetch(`http://localhost:3000/api/noticias?page=${pagina}&limit=${limite}`);
        if (!r.ok) throw new Error(`Falha ${r.status}`); const d = await r.json(); const n = d.noticias || [];
        paginaAtualNoticias = d.paginaAtual || pagina; totalPaginasNoticias = d.totalPaginas || paginaAtualNoticias;
        if (!anexar) articlesGrid.innerHTML = '';
        if (n.length === 0 && !anexar) { articlesGrid.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-10">Nenhuma notícia.</p>'; if (loadMoreBtn) loadMoreBtn.style.display = 'none'; return; }
        n.forEach(noticia => { articlesGrid.insertAdjacentHTML('beforeend', renderizarCardNoticia(noticia)); });
        if (loadMoreBtn) {
            if (paginaAtualNoticias >= totalPaginasNoticias) { loadMoreBtn.style.display = 'none'; }
            else { loadMoreBtn.style.display = 'block'; loadMoreBtn.textContent = 'Carregar mais'; loadMoreBtn.disabled = false; }
        }
    } catch (e) { console.error('Erro:', e); if (!anexar) articlesGrid.innerHTML = `<p class="text-red-500 text-center py-10">Erro (${escapeHtml(e.message)}).</p>`; if (loadMoreBtn) { loadMoreBtn.textContent = 'Tentar'; loadMoreBtn.disabled = false; loadMoreBtn.style.display = anexar ? 'block' : 'none'; }}
    finally { carregandoMaisNoticias = false; }
}

// --- RENDERIZAR CARD (Noticias) ---
function renderizarCardNoticia(noticia) {
    if (!noticia) return "";
    const img = noticia.imagemCapa ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}` : `https://source.unsplash.com/random/400x250/?news&sig=${noticia._id}`;
    const oST = (noticia.conteudo || "").replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    const aST = (noticia.resumo && !noticia.resumo.includes("não") && !noticia.resumo.includes("indis")) ? noticia.resumo : "Resumo IA indisponível.";
    let sC = 'hidden', sD = '';
    if (noticia.taxaConfiabilidade !== undefined && noticia.taxaConfiabilidade !== null) {
         const s = noticia.taxaConfiabilidade; sD = `${s}%`;
         sC = 'bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900';
         if (s < 85) sC = 'bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900'; if (s < 70) sC = 'bg-red-100 dark:bg-red-200 text-red-800 dark:text-red-900';
    }
    const cat = noticia.categoria?.toUpperCase() || 'GERAL';
    const data = noticia.dataPublicacao ? new Date(noticia.dataPublicacao).toLocaleDateString() : '--';
    // Adiciona o 'onclick' para chamar a função de toggle com o nome correto
    return `
        <article class="article-card bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl flex flex-col">
            <img src="${img}" alt="${escapeHtml(noticia.titulo || '')}" class="w-full h-48 object-cover">
            <div class="article-content p-4 flex flex-col flex-grow">
                <div class="article-meta flex flex-wrap justify-between items-center text-xs mb-2 gap-y-1">
                    <span class="article-category ${escapeHtml(noticia.categoria?.toLowerCase() || '')} bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-blue-900 font-semibold px-2.5 py-0.5 rounded-full">${escapeHtml(cat)}</span>
                    <span class="article-score ${sC} font-bold px-2.5 py-0.5 rounded-full text-xs" title="Confiabilidade"><i class="fas fa-shield-alt mr-1 opacity-75"></i> ${sD}</span>
                    <span class="article-date text-gray-500 dark:text-gray-400 w-full md:w-auto text-right md:text-left mt-1 md:mt-0">${data}</span>
                </div>
                <h3 class="article-title text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2"><a href="artigo.html?id=${noticia._id}" class="hover:underline">${escapeHtml(noticia.titulo || '')}</a></h3>
                <p id="summary-${noticia._id}" class="article-summary text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 flex-grow" data-original-summary="${escapeHtml(oST)}" data-ai-summary="${escapeHtml(aST)}">${escapeHtml(oST)}</p>
                <div class="article-actions flex justify-between items-center mt-auto">
                    <a href="artigo.html?id=${noticia._id}" class="article-link text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">Leia mais <i class="fas fa-arrow-right ml-1 text-xs"></i></a>
                    <button class="summary-btn bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition" 
                            onclick="toggleSummaryNoticias('summary-${noticia._id}', this)">Resumo IA</button>
                </div>
            </div>
        </article>`;
}

// --- LÓGICA DO BOTÃO "Resumo IA" ---
function toggleSummaryNoticias(summaryId, button) {
    const sE=document.getElementById(summaryId); if(!sE||!button)return; const oS=sE.getAttribute('data-original-summary'), aS=sE.getAttribute('data-ai-summary'), iSA=button.textContent.trim()==='Resumo Original';
    if(!iSA){sE.innerHTML=aS; sE.classList.remove('line-clamp-3'); button.textContent='Resumo Original'; button.classList.remove('bg-gray-200','dark:bg-gray-700','text-gray-700','dark:text-gray-300'); button.classList.add('bg-blue-500','dark:bg-blue-600','text-white');}
    else{sE.innerHTML=oS; sE.classList.add('line-clamp-3'); button.textContent='Resumo IA'; button.classList.remove('bg-blue-500','dark:bg-blue-600','text-white'); button.classList.add('bg-gray-200','dark:bg-gray-700','text-gray-700','dark:text-gray-300');}
}

// --- FUNÇÃO DE INICIALIZAÇÃO (Noticias) ---
document.addEventListener('DOMContentLoaded', () => {
    // Define seletores globais AQUI
    menuToggle=document.getElementById('menuToggle'); sidebar=document.getElementById('sidebar'); overlay=document.getElementById('overlay');
    themeToggle=document.getElementById('themeToggle'); themeIcon=document.getElementById('theme-icon'); html=document.querySelector('html');
    searchInput=document.getElementById('searchInput'); searchButton=document.getElementById('searchButton'); searchDropdown=document.getElementById('searchDropdown'); searchResultsContainer=document.getElementById('searchResults');
    articlesGrid=document.getElementById('articles-grid'); loadMoreBtn=document.getElementById('load-more-btn');
    userProfileButton=document.getElementById('user-profile'); profileModal=document.getElementById('profile-modal');
    authLinkSidebar=document.getElementById('auth-link'); editorLinkSidebar=document.querySelector('nav a[href="editor.html"]');
    modalLogoutContainer=profileModal?profileModal.querySelector('#modal-logout-container'):null;
    modalProfileLink = profileModal ? profileModal.querySelector('#modal-profile-link') : null;
    modalMyProfileLink = profileModal ? profileModal.querySelector('#modal-my-profile-link') : null;

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();(sidebar&&sidebar.classList.contains('side-open'))?closeMenuNoticias():openMenuNoticias();});
    if(overlay)overlay.addEventListener('click',closeMenuNoticias);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemeNoticias);
    if(searchInput){searchInput.addEventListener('input',()=>{clearTimeout(searchTimeoutNoticias);searchTimeoutNoticias=setTimeout(performSearchNoticias,300);}); searchInput.addEventListener('focus',()=>{if(searchInput.value.length>=3&&searchDropdown)searchDropdown.classList.remove('hidden');}); searchInput.addEventListener('blur',()=>{if(searchDropdown)setTimeout(()=>{searchDropdown.classList.add('hidden');},200);});}
    if(searchButton)searchButton.addEventListener('click',performSearchNoticias);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenNoticias)closeMenuNoticias();});
    document.addEventListener('click',handleClickOutsideModalNoticias);

    // Adiciona Listener do Botão Carregar Mais AQUI
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none'; // Começa escondido
        loadMoreBtn.addEventListener('click', () => {
            if (!carregandoMaisNoticias && paginaAtualNoticias < totalPaginasNoticias) {
                carregarNoticiasPaginadas(paginaAtualNoticias + 1, true);
            }
        });
    } else { const l=document.getElementById('load-more'); if(l)l.style.display='none'; console.warn("Botão #load-more-btn não encontrado."); }

    // Chama Funções de Inicialização
    carregarTemaNoticias();
    verificarLoginNoticias(); // VERIFICA O LOGIN
    carregarNoticiasPaginadas(1, false); // CARREGA AS NOTÍCIAS
});