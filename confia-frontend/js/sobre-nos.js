// js/sobre-nos.js (VERSÃO FINAL COMPLETA - COM AUTH, TEMA, E BUSCA)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    userProfileButton, profileModal, authLinkSidebar, editorLinkSidebar, modalLogoutContainer;

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenSobreNos = false;
function openMenu() { // Mantendo nomes originais do seu script
    if (!sidebar || !overlay) return;
    sidebar.classList.add('side-open');
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    overlay.classList.add('opacity-100');
    menuOpenSobreNos = true;
}
function closeMenu() { // Mantendo nomes originais
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('side-open');
    overlay.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    menuOpenSobreNos = false;
}

// --- 2. LÓGICA DO TEMA ---
function toggleTheme() { // Mantendo nomes originais
    if (!html || !themeIcon) return;
    const isDark = html.classList.toggle('dark');
    html.classList.toggle('light', !isDark); // Garante que light/dark sejam opostos
    if (isDark) {
        themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
}
function carregarTema() { // Mantendo nomes originais
    if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; }
    const p = localStorage.getItem('theme'), s = window.matchMedia('(prefers-color-scheme: dark)').matches, i = p || (s ? 'dark' : 'light');
    html.classList.remove('light', 'dark');
    html.classList.add(i);
    if (i === 'dark') {
        themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun');
    }
}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModal(event) { // Mantendo nomes originais
    if (event) event.preventDefault();
    if (!userProfileButton || !profileModal) { console.warn("Modal: Botão/Modal ausente."); return; }
    const r = userProfileButton.getBoundingClientRect();
    profileModal.style.top = 'auto'; profileModal.style.bottom = `${window.innerHeight - r.top - window.scrollY + 5}px`;
    profileModal.style.left = `${r.left + window.scrollX}px`;
    profileModal.style.minWidth = '220px';
    if (profileModal.classList.contains('hidden')) {
        profileModal.classList.remove('hidden'); void profileModal.offsetWidth;
        profileModal.classList.remove('opacity-0', 'scale-95'); profileModal.classList.add('opacity-100', 'scale-100');
    } else {
        profileModal.classList.remove('opacity-100', 'scale-100'); profileModal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => { profileModal.classList.add('hidden'); }, 300);
    }
}
function handleClickOutsideModal(event) { // Nome genérico, pois é global
    if (!userProfileButton || !profileModal) return;
    if (!userProfileButton.contains(event.target) && !profileModal.contains(event.target) && !profileModal.classList.contains('hidden')) {
        profileModal.classList.remove('opacity-100', 'scale-100'); profileModal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => { profileModal.classList.add('hidden'); }, 300);
    }
}

// --- 4. LÓGICA DE AUTENTICAÇÃO (ADICIONADA) ---
function verificarLogin() {
    const token = localStorage.getItem('authToken'); let userInfo = null; const sUI = localStorage.getItem('userInfo');
    if(sUI){try{userInfo=JSON.parse(sUI);}catch(e){localStorage.clear();token=null;userInfo=null;}}
    
    const cPB = document.getElementById('user-profile'); // Botão perfil rodapé
    const cAL = document.getElementById('auth-link'); // Link Login/Sair NAV
    const cEL = document.querySelector('nav a[href="editor.html"]'); // Link Editor NAV
    const cPM = document.getElementById('profile-modal'); // Modal
    const cMLC = cPM ? cPM.querySelector('#modal-logout-container') : null; // Container Logout no Modal

    if (!cPB) { console.error("CRÍTICO: #user-profile NÃO ENCONTRADO!"); return; }
    
    const nPB = cPB.cloneNode(true); // Clona para limpar listeners
    const uNS = nPB.querySelector('span'); // Pega span DO NOVO BOTÃO
    const uI = nPB.querySelector('img'); // Pega img DO NOVO BOTÃO
    if (cPB.parentNode) { cPB.parentNode.replaceChild(nPB, cPB); } else { console.error("Pai do #user-profile não encontrado"); }

    if (token && userInfo && userInfo.nome) { // --- LOGADO ---
        const uN = userInfo.nome, uE = userInfo.email || '';
        if (uNS) uNS.textContent = uN; if (uI) uI.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
        nPB.href = '#'; nPB.addEventListener('click', toggleProfileModal); // Abre modal
        if (cAL) { const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click', fazerLogout); authLinkSidebar = nA; }
        if (cEL) cEL.style.display = 'flex';
        if (cPM) { const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-sn" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-sn'); if(l)l.addEventListener('click',fazerLogout);}}
    
    } else { // --- DESLOGADO ---
        if (uNS) uNS.textContent = 'Fazer Login'; if (uI) uI.src = `https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href = 'login.html';
        if (cAL) { const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA; }
        if (cEL) cEL.style.display = 'none';
        if (cPM) { const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza referência global
}
function fazerLogout(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLogin();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- 5. LÓGICA DA BARRA DE BUSCA (ADICIONADA) ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}
async function performSearch() {
    if (!searchInput || !searchResultsContainer || !searchDropdown) { console.warn("Elementos de busca não encontrados"); return; }
    const query = searchInput.value.trim();
    searchResultsContainer.innerHTML = '';
    if (query.length < 3) { searchDropdown.classList.add('hidden'); return; }
    searchDropdown.classList.remove('hidden');
    searchResultsContainer.innerHTML = '<div class="p-4 text-gray-500 dark:text-gray-400">Buscando...</div>';
    try {
        const response = await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Falha (Status: ${response.status})`);
        const resultados = await response.json();
        searchResultsContainer.innerHTML = '';
        if (resultados.length === 0) {
            searchResultsContainer.innerHTML = `<div class="p-4 text-gray-500 dark:text-gray-400">Nenhum resultado para "${escapeHtml(query)}".</div>`;
        } else {
            resultados.forEach(noticia => {
                searchResultsContainer.innerHTML += `
                    <a href="artigo.html?id=${noticia._id}" class="block p-3 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-200 dark:border-slate-600">
                        <div class="font-medium text-gray-800 dark:text-gray-200">${escapeHtml(noticia.titulo)}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1"><span>${escapeHtml(noticia.categoria?.toUpperCase() || 'GERAL')}</span></div>
                    </a>`;
            });
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        searchResultsContainer.innerHTML = `<div class="p-4 text-red-500">Erro ao buscar (${escapeHtml(error.message)}).</div>`;
    }
}
let searchTimeout;

// --- FUNÇÃO DE INICIALIZAÇÃO (Sobre Nós) ---
document.addEventListener('DOMContentLoaded', () => {
    // Define seletores globais AQUI
    menuToggle = document.getElementById('menuToggle');
    sidebar = document.getElementById('sidebar');
    overlay = document.getElementById('overlay');
    themeToggle = document.getElementById('themeToggle');
    themeIcon = document.getElementById('theme-icon');
    html = document.querySelector('html');
    // Seletores de Busca
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    searchDropdown = document.getElementById('searchDropdown');
    searchResultsContainer = document.getElementById('searchResults');
    // Seletores de Autenticação
    userProfileButton = document.getElementById('user-profile');
    profileModal = document.getElementById('profile-modal');
    authLinkSidebar = document.getElementById('auth-link');
    editorLinkSidebar = document.querySelector('nav a[href="editor.html"]');
    modalLogoutContainer = profileModal ? profileModal.querySelector('#modal-logout-container') : null;

    // Adiciona listeners globais
    if(menuToggle) menuToggle.addEventListener('click', (e) => { e.stopPropagation(); (sidebar && sidebar.classList.contains('side-open')) ? closeMenu() : openMenu(); });
    if(overlay) overlay.addEventListener('click', closeMenu);
    if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if(searchInput) {
        searchInput.addEventListener('input', () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(performSearch, 300); });
        searchInput.addEventListener('focus', () => { if (searchInput.value.length >= 3 && searchDropdown) searchDropdown.classList.remove('hidden'); });
        searchInput.addEventListener('blur', () => { if (searchDropdown) setTimeout(() => searchDropdown.classList.add('hidden'), 200); });
    }
    if(searchButton) searchButton.addEventListener('click', performSearch);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sidebar && sidebar.classList.contains('side-open')) closeMenu(); });
    document.addEventListener('click', handleClickOutsideModal);

    // Chama as funções de inicialização
    carregarTema();
    verificarLogin(); // <<< ADICIONADO
    // (Esta página não carrega notícias)
});