// js/perfil.js (NOVO ARQUIVO)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    userProfileButton, profileModal, authLinkSidebar, editorLinkSidebar,
    modalLogoutContainer, modalProfileLink, modalMyProfileLink,
    // Seletores Específicos da Página
    perfilFoto, perfilNome, perfilMembroDesde, perfilNoticiasContainer;


// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenPerfil = false;
function openMenuPerfil() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenPerfil = true; }
function closeMenuPerfil() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenPerfil = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemePerfil() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaPerfil() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalPerfil(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalPerfil(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO ---
function verificarLoginPerfil() {
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
        nPB.href='#'; nPB.addEventListener('click',toggleProfileModalPerfil);
        if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutPerfil); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='flex';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href = `perfil.html?id=${uID}`; if(cMPL_Text) cMPL_Text.href = `perfil.html?id=${uID}`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-perfil" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-perfil'); if(l)l.addEventListener('click',fazerLogoutPerfil);}}
    } else { // DESLOGADO
        if(uNS)uNS.textContent='Fazer Login'; if(uI)uI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`;
        nPB.href='login.html';
        if(cAL){const nA=cAL.cloneNode(true); nA.href='login.html'; nA.innerHTML='<i class="fas fa-sign-in-alt w-6 mr-3"></i> Login'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); authLinkSidebar = nA;}
        if(cEL)cEL.style.display='none';
        if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent="Nome"; if(mUE)mUE.textContent="email"; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=?&b=6b7280&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href="login.html"; if(cMPL_Text) cMPL_Text.href="login.html"; if(cMLC)cMLC.innerHTML=''; if(!cPM.classList.contains('hidden')){cPM.classList.add('hidden','opacity-0','scale-95'); cPM.classList.remove('opacity-100','scale-100');}}
    }
    userProfileButton = nPB; // Atualiza referência global
}
function fazerLogoutPerfil(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginPerfil();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

// --- FUNÇÃO escapeHtml ---
function escapeHtml(unsafe){if(typeof unsafe !== 'string')return "";try{return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}catch(e){return "";}}

// --- LÓGICA DA BARRA DE BUSCA GLOBAL ---
async function performSearchPerfil() {
    if(!searchInput||!searchResultsContainer||!searchDropdown)return; const q=searchInput.value.trim(); searchResultsContainer.innerHTML=''; if(q.length<3){searchDropdown.classList.add('hidden');return;}
    searchDropdown.classList.remove('hidden'); searchResultsContainer.innerHTML='<div class="p-4 ...">Buscando...</div>';
    try{const r=await fetch(`http://localhost:3000/api/noticias/pesquisa?q=${encodeURIComponent(q)}`); if(!r.ok)throw new Error(`Falha ${r.status}`); const d=await r.json(); searchResultsContainer.innerHTML='';
        if(d.length===0){searchResultsContainer.innerHTML=`<div class="p-4 ...">Nada para "${escapeHtml(q)}".</div>`;}
        else{d.forEach(n=>{searchResultsContainer.innerHTML+=`<a href="artigo.html?id=${n._id}" class="block..."><div class="...">${escapeHtml(n.titulo)}</div><div class...">${escapeHtml(n.categoria?.toUpperCase()||'G')}</span></div></a>`;});}
    }catch(e){console.error('Erro:',e); searchResultsContainer.innerHTML=`<div class="p-4 text-red-500">Erro (${escapeHtml(e.message)}).</div>`;}
}
let searchTimeoutPerfil;

// --- LÓGICA ESPECÍFICA DA PÁGINA (Carregar Perfil) ---
async function carregarPerfil() {
    console.log("Carregando perfil...");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // Se não houver ID na URL, tenta pegar o ID do usuário logado
    if (!userId) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.id) {
            window.location.search = `?id=${userInfo.id}`; // Recarrega a página com o ID correto
            return;
        } else {
            console.error("ID do usuário não encontrado na URL nem no localStorage.");
            if(perfilNome) perfilNome.textContent = "Usuário não encontrado";
            if(perfilNoticiasContainer) perfilNoticiasContainer.innerHTML = '<p class="text-red-500">Não foi possível carregar o perfil.</p>';
            return;
        }
    }
    
    // Feedback inicial de carregamento
    if(perfilNome) perfilNome.textContent = "Carregando...";
    if(perfilNoticiasContainer) perfilNoticiasContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Carregando artigos...</p>';

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) throw new Error(`Usuário não encontrado (Status: ${response.status})`);
        const data = await response.json(); // Espera { usuario: {...}, noticias: [...] }

        const usuario = data.usuario;
        const noticias = data.noticias;

        // 1. Preenche informações do usuário
        if (usuario) {
            document.title = `Perfil de ${usuario.nome} - Confia!`;
            if(perfilNome) perfilNome.textContent = escapeHtml(usuario.nome);
            if(perfilFoto) {
                perfilFoto.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=3b82f6&color=fff&bold=true&size=128`;
                perfilFoto.alt = `Foto de ${escapeHtml(usuario.nome)}`;
            }
            if(perfilMembroDesde && usuario.dataCadastro) {
                perfilMembroDesde.textContent = `Membro desde ${new Date(usuario.dataCadastro).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
            }
        }

        // 2. Preenche os artigos publicados
        if (noticias && noticias.length > 0) {
            perfilNoticiasContainer.innerHTML = ''; // Limpa "Carregando"
            noticias.forEach(noticia => {
                // Reutiliza a função de renderizar card (adaptada do noticias.js)
                perfilNoticiasContainer.insertAdjacentHTML('beforeend', renderizarCardNoticiaPerfil(noticia));
            });
        } else {
            perfilNoticiasContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full">Este usuário ainda não publicou artigos.</p>';
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        if(perfilNome) perfilNome.textContent = "Erro ao carregar perfil";
        if(perfilNoticiasContainer) perfilNoticiasContainer.innerHTML = `<p class="text-red-500">${escapeHtml(error.message)}</p>`;
    }
}

// --- RENDERIZAR CARD (Copiado/Adaptado do js/noticias.js) ---
function renderizarCardNoticiaPerfil(noticia) {
    if (!noticia) return "";
    const img = noticia.imagemCapa ? `http://localhost:3000/${noticia.imagemCapa.replace(/\\/g, '/')}` : `https://source.unsplash.com/random/400x250/?news&sig=${noticia._id}`;
    const rIA = noticia.resumo || "", cB = noticia.conteudo || "";
    const resumo = (rIA && !rIA.includes("não") && !rIA.includes("indis")) ? rIA : cB.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    let sC = 'hidden', sD = '';
    if (noticia.taxaConfiabilidade !== undefined && noticia.taxaConfiabilidade !== null) {
         const s = noticia.taxaConfiabilidade; sD = `${s}%`;
         sC = 'bg-green-100 dark:bg-green-200 text-green-800 dark:text-green-900';
         if (s < 85) sC = 'bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900'; if (s < 70) sC = 'bg-red-100 dark:bg-red-200 text-red-800 dark:text-red-900';
    }
    const cat = noticia.categoria?.toUpperCase() || 'GERAL';
    const data = noticia.dataPublicacao ? new Date(noticia.dataPublicacao).toLocaleDateString() : '--';
    
    // (Não inclui o botão "Resumo IA" no perfil, para simplificar)
    return `
        <article class="article-card bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl flex flex-col">
            <a href="artigo.html?id=${noticia._id}">
                <img src="${img}" alt="${escapeHtml(noticia.titulo || '')}" class="w-full h-48 object-cover">
            </a>
            <div class="article-content p-4 flex flex-col flex-grow">
                <div class="article-meta flex flex-wrap justify-between items-center text-xs mb-2 gap-y-1">
                    <span class="article-category ${escapeHtml(noticia.categoria?.toLowerCase() || '')} bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-blue-900 font-semibold px-2.5 py-0.5 rounded-full">${escapeHtml(cat)}</span>
                    <span class="article-score ${sC} font-bold px-2.5 py-0.5 rounded-full text-xs" title="Confiabilidade"><i class="fas fa-shield-alt mr-1 opacity-75"></i> ${sD}</span>
                    <span class="article-date text-gray-500 dark:text-gray-400 w-full md:w-auto text-right md:text-left mt-1 md:mt-0">${data}</span>
                </div>
                <h3 class="article-title text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2"><a href="artigo.html?id=${noticia._id}" class="hover:underline">${escapeHtml(noticia.titulo || '')}</a></h3>
                <p class="article-summary text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 flex-grow">${escapeHtml(resumo)}</p>
                <div class="article-actions flex justify-end items-center mt-auto">
                    <a href="artigo.html?id=${noticia._id}" class="article-link text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">Leia mais <i class="fas fa-arrow-right ml-1 text-xs"></i></a>
                </div>
            </div>
        </article>`;
}

// --- FUNÇÃO DE INICIALIZAÇÃO (Perfil) ---
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
    perfilFoto = document.getElementById('perfil-foto');
    perfilNome = document.getElementById('perfil-nome');
    perfilMembroDesde = document.getElementById('perfil-membro-desde');
    perfilNoticiasContainer = document.getElementById('perfil-noticias-container');

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();(sidebar&&sidebar.classList.contains('side-open'))?closeMenuPerfil():openMenuPerfil();});
    if(overlay)overlay.addEventListener('click',closeMenuPerfil);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemePerfil);
    if(searchInput){searchInput.addEventListener('input',()=>{clearTimeout(searchTimeoutPerfil);searchTimeoutPerfil=setTimeout(performSearchPerfil,300);}); searchInput.addEventListener('focus',()=>{if(searchInput.value.length>=3&&searchDropdown)searchDropdown.classList.remove('hidden');}); searchInput.addEventListener('blur',()=>{if(searchDropdown)setTimeout(()=>{searchDropdown.classList.add('hidden');},200);});}
    if(searchButton)searchButton.addEventListener('click',performSearchPerfil);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenPerfil)closeMenuPerfil();});
    document.addEventListener('click',handleClickOutsideModalPerfil);
    
    // Chama as funções de inicialização
    carregarTemaPerfil();
    verificarLoginPerfil(); // VERIFICA O LOGIN
    carregarPerfil(); // CARREGA OS DADOS DO PERFIL
});