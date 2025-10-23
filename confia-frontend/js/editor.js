// js/editor.js (VERSÃO FINAL COMPLETA - COM AUTH, TEMA, E LÓGICA DO EDITOR)

// --- SELETORES GLOBAIS (Definidos no DOMContentLoaded) ---
let menuToggle, sidebar, overlay, themeToggle, themeIcon, html,
    searchInput, searchButton, searchDropdown, searchResultsContainer,
    userProfileButton, profileModal, authLinkSidebar, editorLinkSidebar,
    modalLogoutContainer, modalProfileLink, modalMyProfileLink,
    imageUpload, fileNameSpan, imagePreview, publishButton,
    articleTitle, articleCategory, articleTags, textEditor;

// --- 1. LÓGICA DO MENU LATERAL ---
let menuOpenEditor = false;
function openMenuEditor() { if (!sidebar || !overlay) return; sidebar.classList.add('side-open'); overlay.classList.remove('pointer-events-none', 'opacity-0'); overlay.classList.add('opacity-100'); menuOpenEditor = true; }
function closeMenuEditor() { if (!sidebar || !overlay) return; sidebar.classList.remove('side-open'); overlay.classList.add('pointer-events-none'); overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0'); menuOpenEditor = false; }

// --- 2. LÓGICA DO TEMA ---
function toggleThemeEditor() { if (!html || !themeIcon) return; const iD = html.classList.toggle('dark'); html.classList.toggle('light', !iD); if (iD) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme', 'dark'); } else { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme', 'light'); } }
function carregarTemaEditor() { if (!html || !themeIcon) { console.warn("Tema: HTML/Icon ausente."); return; } const p=localStorage.getItem('theme'), s=window.matchMedia('(prefers-color-scheme: dark)').matches, i=p||(s?'dark':'light'); html.classList.remove('light','dark'); html.classList.add(i); if(i==='dark'){themeIcon.classList.remove('fa-sun');themeIcon.classList.add('fa-moon');}else{themeIcon.classList.remove('fa-moon');themeIcon.classList.add('fa-sun');}}

// --- 3. LÓGICA DO MODAL DE PERFIL ---
function toggleProfileModalEditor(event) { if(event)event.preventDefault(); if(!userProfileButton||!profileModal){console.warn("Modal: Botão/Modal ausente.");return;} const r=userProfileButton.getBoundingClientRect(); profileModal.style.top='auto'; profileModal.style.bottom=`${window.innerHeight-r.top-window.scrollY+5}px`; profileModal.style.left=`${r.left+window.scrollX}px`; profileModal.style.minWidth='220px'; if(profileModal.classList.contains('hidden')){profileModal.classList.remove('hidden');void profileModal.offsetWidth;profileModal.classList.remove('opacity-0','scale-95');profileModal.classList.add('opacity-100','scale-100');}else{profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}
function handleClickOutsideModalEditor(event) { if(!userProfileButton||!profileModal)return; if(!userProfileButton.contains(event.target)&&!profileModal.contains(event.target)&&!profileModal.classList.contains('hidden')){profileModal.classList.remove('opacity-100','scale-100');profileModal.classList.add('opacity-0','scale-95');setTimeout(()=>{profileModal.classList.add('hidden');},300);}}

// --- 4. LÓGICA DE AUTENTICAÇÃO (COM PROTEÇÃO DE ROTA) ---
function verificarLoginEditor() {
    const token = localStorage.getItem('authToken'); let userInfo = null; const sUI = localStorage.getItem('userInfo');
    if(sUI){try{userInfo=JSON.parse(sUI);}catch(e){localStorage.clear();token=null;userInfo=null;}}
    
    // --- PROTEÇÃO DE ROTA ---
    if (!token || !userInfo || !userInfo.nome) {
        alert("Acesso negado. Você precisa estar logado para acessar o editor.");
        window.location.href = 'login.html'; // Redireciona
        return false; // Para a execução
    }
    // --- FIM DA PROTEÇÃO ---

    const cPB = document.getElementById('user-profile'); const cAL = document.getElementById('auth-link'); const cEL = document.querySelector('nav a[href="editor.html"]'); const cPM = document.getElementById('profile-modal');
    const cMLC = cPM ? cPM.querySelector('#modal-logout-container') : null;
    const cMPL_Top = cPM ? cPM.querySelector('#modal-profile-link') : null;
    const cMPL_Text = cPM ? cPM.querySelector('#modal-my-profile-link') : null;
    if(!cPB){console.error("CRÍTICO: #user-profile NÃO ENCONTRADO!"); return true;} // Retorna true se logado, mas UI falhou
    
    const nPB = cPB.cloneNode(true); const uNS = nPB.querySelector('span'); const uI = nPB.querySelector('img');
    if (cPB.parentNode) { cPB.parentNode.replaceChild(nPB, cPB); } else { console.error("Pai do #user-profile não encontrado"); }

    // Se chegou aqui, está logado
    const uN=userInfo.nome, uE=userInfo.email||'', uID=userInfo.id||'';
    if(uNS)uNS.textContent=uN; if(uI)uI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`;
    nPB.href='#'; nPB.addEventListener('click',toggleProfileModalEditor);
    if(cAL){const nA=cAL.cloneNode(true); nA.href='#'; nA.innerHTML='<i class="fas fa-sign-out-alt w-6 mr-3"></i> Sair'; if(cAL.parentNode)cAL.parentNode.replaceChild(nA,cAL); nA.addEventListener('click',fazerLogoutEditor); authLinkSidebar = nA;}
    if(cEL)cEL.style.display='flex';
    if(cPM){const mUN=cPM.querySelector('p.font-semibold'), mUE=cPM.querySelector('p.text-xs'), mUI=cPM.querySelector('img'); if(mUN)mUN.textContent=uN; if(mUE)mUE.textContent=uE; if(mUI)mUI.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(uN)}&b=3b82f6&c=fff&bold=true`; if(cMPL_Top) cMPL_Top.href = `perfil.html?id=${uID}`; if(cMPL_Text) cMPL_Text.href = `perfil.html?id=${uID}`; if(cMLC){cMLC.innerHTML=`<button id="logout-b-m-e" class="flex items-center p-2 text-sm w-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg"><i class="fas fa-sign-out-alt w-5 mr-3"></i> Sair</button>`; const l=document.getElementById('logout-b-m-e'); if(l)l.addEventListener('click',fazerLogoutEditor);}}
    
    userProfileButton = nPB; // Atualiza referência global
    return true; // Confirma que está logado
}
function fazerLogoutEditor(e){ if(e)e.preventDefault(); localStorage.removeItem('authToken'); localStorage.removeItem('userInfo'); alert('Desconectado.'); const c=()=>{verificarLoginEditor();}; const m=document.getElementById('profile-modal'); if(m&&!m.classList.contains('hidden')){m.classList.remove('opacity-100','scale-100'); m.classList.add('opacity-0','scale-95');setTimeout(()=>{m.classList.add('hidden');c();},300);}else{c();}}

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

// --- LÓGICA ESPECÍFICA DA PÁGINA (Formulário do Editor) ---
async function publicarNoticia() {
    const titulo = articleTitle ? articleTitle.value : '';
    const categoria = articleCategory ? articleCategory.value : '';
    const conteudo = textEditor ? textEditor.innerHTML : '';
    const tags = articleTags ? articleTags.value : '';
    const imagemArquivo = imageUpload ? imageUpload.files[0] : null;

    if (!titulo || !categoria || !conteudo) {
        alert('Por favor, preencha o título, a categoria e o conteúdo.');
        return;
    }
    
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('categoria', categoria);
    formData.append('tags', tags || '');
    formData.append('conteudo', conteudo);
    if (imagemArquivo) {
        formData.append('imagemCapa', imagemArquivo);
    }

    if(publishButton) { publishButton.textContent = 'Publicando...'; publishButton.disabled = true; }
    
    try {
        const token = localStorage.getItem('authToken');
        // A verificação no DOMContentLoaded já barrou usuários deslogados,
        // mas é uma boa prática verificar o token novamente antes do fetch.
        if (!token) {
            alert('Sessão expirada. Faça o login novamente.');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:3000/api/noticias', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // Envia o token
            },
            body: formData
        });

        if (response.ok) {
            const noticiaSalva = await response.json();
            alert('Notícia publicada com sucesso! Redirecionando...');
            window.location.href = `artigo.html?id=${noticiaSalva._id}`;
        } else {
             if (response.status === 401) { // Token inválido/expirado
                 alert('Sua sessão é inválida ou expirou. Faça o login novamente.');
                 window.location.href = 'login.html';
             } else {
                const errorData = await response.json();
                alert(`Erro ao publicar: ${errorData.message || `Erro ${response.status}`}`);
             }
             if(publishButton) { publishButton.textContent = 'Publicar Artigo'; publishButton.disabled = false; }
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão. Verifique o backend.');
        if(publishButton) { publishButton.textContent = 'Publicar Artigo'; publishButton.disabled = false; }
    }
}

// --- FUNÇÃO DE INICIALIZAÇÃO (Editor) ---
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
    
    // Seletores Específicos do Editor
    imageUpload = document.getElementById('image-upload');
    fileNameSpan = document.getElementById('file-name');
    imagePreview = document.getElementById('image-preview');
    publishButton = document.getElementById('publish-button');
    articleTitle = document.getElementById('article-title');
    articleCategory = document.getElementById('article-category');
    articleTags = document.getElementById('article-tags');
    textEditor = document.getElementById('text-editor');

    // Adiciona listeners globais
    if(menuToggle)menuToggle.addEventListener('click',(e)=>{e.stopPropagation();(sidebar&&sidebar.classList.contains('side-open'))?closeMenuEditor():openMenuEditor();});
    if(overlay)overlay.addEventListener('click',closeMenuEditor);
    if(themeToggle)themeToggle.addEventListener('click',toggleThemeEditor);
    if(searchInput){searchInput.addEventListener('input',()=>{clearTimeout(searchTimeoutGlobal);searchTimeoutGlobal=setTimeout(performSearchGlobal,300);}); searchInput.addEventListener('focus',()=>{if(searchInput.value.length>=3&&searchDropdown)searchDropdown.classList.remove('hidden');}); searchInput.addEventListener('blur',()=>{if(searchDropdown)setTimeout(()=>{searchDropdown.classList.add('hidden');},200);});}
    if(searchButton)searchButton.addEventListener('click',performSearchGlobal);
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&menuOpenEditor)closeMenuEditor();});
    document.addEventListener('click',handleClickOutsideModalEditor);

    // Adiciona listeners específicos do Editor
    if (imageUpload) {
        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && fileNameSpan && imagePreview) {
                fileNameSpan.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (e) => { const img = imagePreview.querySelector('img'); if (img) { img.src = e.target.result; imagePreview.classList.remove('hidden'); } };
                reader.readAsDataURL(file);
            } else if (fileNameSpan) {
                fileNameSpan.textContent = 'Nenhum arquivo';
                if (imagePreview) imagePreview.classList.add('hidden');
            }
        });
    }
    if (publishButton) {
        publishButton.addEventListener('click', publicarNoticia);
    }
    if (textEditor) {
        textEditor.addEventListener('paste', (event) => {
            event.preventDefault();
            const text = (event.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    // Chama as funções de inicialização
    carregarTemaEditor();
    verificarLoginEditor(); // <<< Verifica se está logado (e protege a rota)
});