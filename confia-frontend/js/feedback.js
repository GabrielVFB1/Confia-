// js/feedback.js (VERSÃO FINAL COMPLETA - COM AUTH, TEMA, E LÓGICA DE FEEDBACK)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    userProfileButton, profileModal, authLinkSidebar, editorLinkSidebar,
    modalLogoutContainer, modalProfileLink, modalMyProfileLink,
    feedbackForm, articleInput, feedbackSearchResults; // Específicos do Feedback

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenFeedback = false;
function openMenuFeedback() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenFeedback = true; }
function closeMenuFeedback() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenFeedback = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemeFeedback() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaFeedback() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalFeedback(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalFeedback(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO ---
function verificarLoginFeedback() {
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
        nPB.href='#'; nPB.addEventListener('click',toggleProfileModalFeedback);
        if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutFeedback); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='flex';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href = `perfil.html?id=${uID}`; if(cMPL_Text) cMPL_Text.href = `perfil.html?id=${uID}`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-f" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-f'); if(l)l.addEventListener('click',fazerLogoutFeedback);}}
    } else { // DESLOGADO
        if(uNS)uNS.textContent='Fazer Login'; if(uI)uI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href='login.html';
        if(cAL){const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='none';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href="login.html"; if(cMPL_Text) cMPL_Text.href="login.html"; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza referência global
}
function fazerLogoutFeedback(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginFeedback();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- FUNÇÃO escapeHtml ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}

// --- LÓGICA DA BARRA DE BUSCA GLOBAL ---
async function performSearchGlobal() {
    if(!searchInput||!searchResultsContainer||!searchDropdown)return; const q=searchInput.value.trim(); searchResultsContainer.innerHTML=''; if(q.length<3){searchDropdown.classList.add('hidden');return;}
    searchDropdown.classList.remove('hidden'); searchResultsContainer.innerHTML='<div class="p-4 text-gray-500 dark:text-gray-400">Buscando...</div>';
    try{const r=await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(q)}`); if(!r.ok)throw new Error(`Falha ${r.status}`); const d=await r.json(); searchResultsContainer.innerHTML='';
        if(d.length===0){searchResultsContainer.innerHTML=`<div class="p-4 text-gray-500 dark:text-gray-400">Nada para "${escapeHtml(q)}".</div>`;}
        else{d.forEach(n=>{searchResultsContainer.innerHTML+=`<a href="artigo.html?id=${n._id}" class="block p-3 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-200 dark:border-slate-600"><div class="font-medium text-gray-800 dark:text-gray-200">${escapeHtml(n.titulo)}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-1"><span>${escapeHtml(n.categoria?.toUpperCase()||'G')}</span></div></a>`;});}
    }catch(e){console.error('Erro na busca:',e); searchResultsContainer.innerHTML=`<div class="p-4 text-red-500">Erro (${escapeHtml(e.message)}).</div>`;}
}
let searchTimeoutGlobal;

// --- LÓGICA ESPECÍFICA DA PÁGINA (Formulário de Feedback) ---
async function handleFeedbackSubmit(event) {
    event.preventDefault();
    const artigoAvaliadoEl = document.getElementById('article');
    const avaliacaoEl = document.getElementById('rating');
    const comentarioEl = document.getElementById('comment');
    const submitBtn = document.getElementById('submit-btn');

    const artigoAvaliado = artigoAvaliadoEl ? artigoAvaliadoEl.value : '';
    const avaliacao = avaliacaoEl ? avaliacaoEl.value : '';
    const comentario = comentarioEl ? comentarioEl.value : '';

    if (!avaliacao || !comentario) { alert('Por favor, preencha sua avaliação e o comentário.'); return; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

    try {
        const response = await fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artigoAvaliado, avaliacao, comentario })
        });
        if (response.ok) {
            alert('Obrigado pelo seu feedback!');
            if (feedbackForm) feedbackForm.reset();
            if (feedbackSearchResults) feedbackSearchResults.style.display = 'none'; // Esconde resultados
        } else {
            alert('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão com o servidor.');
    } finally {
         if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Enviar Feedback'; }
    }
}

// Lógica de busca de artigos para o formulário
async function handleArticleSearch() {
    if (!articleInput || !feedbackSearchResults) return;
    const query = articleInput.value.trim();
    feedbackSearchResults.innerHTML = '';
    feedbackSearchResults.style.display = 'none';
    if (query.length < 3) return;

    try {
        const response = await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(query)}`);
        const resultados = await response.json();
        
        if (resultados.length > 0) {
            feedbackSearchResults.style.display = 'block';
            resultados.forEach(noticia => {
                const resultItem = document.createElement('div');
                // Adiciona classes Tailwind para bater com o estilo do site
                resultItem.className = 'p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b dark:border-gray-600 last:border-b-0';
                resultItem.innerText = escapeHtml(noticia.titulo);
                resultItem.addEventListener('mousedown', () => { // Usa mousedown para ganhar do 'blur'
                    articleInput.value = noticia.titulo;
                    feedbackSearchResults.innerHTML = '';
                    feedbackSearchResults.style.display = 'none';
                });
                feedbackSearchResults.appendChild(resultItem);
            });
        } else {
            feedbackSearchResults.style.display = 'block';
            feedbackSearchResults.innerHTML = '<div class="p-3 text-gray-500">Nenhum artigo encontrado.</div>';
        }
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        feedbackSearchResults.style.display = 'block';
        feedbackSearchResults.innerHTML = '<div class="p-3 text-red-500">Erro ao buscar.</div>';
    }
}
let articleSearchTimeout;

// --- FUNÇÃO DE INICIALIZAÇÃO (Feedback) ---
document.addEventListener('DOMContentLoaded', () => {
    // Define seletores globais
    menuToggle = document.getElementById('menuToggle'); sidebar = document.getElementById('sidebar'); overlay = document.getElementById('overlay');
    themeToggle = document.getElementById('themeToggle'); themeIcon = document.getElementById('theme-icon'); html = document.querySelector('html');
    searchInput = document.getElementById('searchInput'); searchButton = document.getElementById('searchButton'); searchDropdown = document.getElementById('searchDropdown'); searchResultsContainer = document.getElementById('searchResults');
    userProfileButton = document.getElementById('user-profile'); profileModal = document.getElementById('profile-modal');
    authLinkSidebar = document.getElementById('auth-link'); editorLinkSidebar = document.querySelector('nav a[href="editor.html"]');
    modalLogoutContainer = profileModal ? profileModal.querySelector('#modal-logout-container') : null;
    modalProfileLink = profileModal ? profileModal.querySelector('#modal-profile-link') : null;
    modalMyProfileLink = profileModal ? profileModal.querySelector('#modal-my-profile-link') : null;
    
    // Define seletores específicos da página
    feedbackForm = document.getElementById('feedback-form');
    articleInput = document.getElementById('article');
    feedbackSearchResults = document.getElementById('feedback-search-results');

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();(sidebar&&sidebar.classList.contains('side-open'))?closeMenuFeedback():openMenuFeedback();});
    if(overlay)overlay.addEventListener('click',closeMenuFeedback);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemeFeedback);
    if(searchInput){searchInput.addEventListener('input',()=>{clearTimeout(searchTimeoutGlobal);searchTimeoutGlobal=setTimeout(performSearchGlobal,300);}); searchInput.addEventListener('focus',()=>{if(searchInput.value.length>=3&&searchDropdown)searchDropdown.classList.remove('hidden');}); searchInput.addEventListener('blur',()=>{if(searchDropdown)setTimeout(()=>{searchDropdown.classList.add('hidden');},200);});}
    if(searchButton)searchButton.addEventListener('click',performSearchGlobal);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenFeedback)closeMenuFeedback();});
    document.addEventListener('click',handleClickOutsideModalFeedback);

    // Adiciona listeners específicos da página
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    if (articleInput) {
        articleInput.addEventListener('input', () => {
             clearTimeout(articleSearchTimeout);
             articleSearchTimeout = setTimeout(handleArticleSearch, 300); // Debounce
        });
        articleInput.addEventListener('blur', () => {
            setTimeout(() => {
                if(feedbackSearchResults) feedbackSearchResults.style.display = 'none';
            }, 250); // Atraso para permitir clique no resultado
        });
    }

    // Chama as funções de inicialização globais
    carregarTemaFeedback();
    verificarLoginFeedback();
    // (Não há notícias para carregar nesta página)
});