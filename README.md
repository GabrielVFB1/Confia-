Confia! - Portal de Notícias com Análise de IA
Descrição
O Confia! é um portal de notícias full-stack (Headless CMS) que implementa uma arquitetura robusta em Node.js (backend) e HTML/CSS/JS (frontend). O projeto foi estruturado seguindo os princípios de Orientação a Objetos, arquitetura MVC e o padrão Repository para a camada de persistência de dados.

O principal diferencial do sistema é a integração com a API do Google Gemini. Quando um usuário autenticado publica uma notícia (especialmente na categoria "Política"), o backend automaticamente:

Gera um resumo conciso do artigo.

Gera uma revisão crítica sobre o conteúdo (ex: "Artigo bem fundamentado", "Carece de fontes").

Atribui uma Taxa de Confiabilidade (0-100) baseada na análise.

O sistema conta com autenticação de usuários (Cadastro com hash bcrypt e Login com JWT), upload de imagens, e carregamento dinâmico de conteúdo (com paginação) em todas as seções.

Integrantes
Bruno Pimenta -- 22300147

Breno Villela -- 22301356

Gabriel Victor -- 22300473

Samuel Brito -- 22301186

Pedro Borges -- 22300180

Rafael Augusto -- 22301046

(Baseado no arquivo sobre-nos.html)

Estrutura de Diretórios
confia-projeto/
├── confia-backend/
│   ├── config/           # Conexão BD (Singleton)
│   ├── controllers/      # Camada de Controle (MVC)
│   ├── factories/        # Padrão Factory (AnalysisStrategyFactory)
│   ├── middleware/       # Padrão Middleware (authMiddleware)
│   ├── models/           # Camada de Modelo (MVC - Noticia, User, Feedback)
│   ├── repositories/     # Padrão Repository (NoticiaRepository, etc.)
│   ├── routes/           # Definição de Rotas (API Endpoints)
│   ├── services/         # Padrão Facade (analysisService)
│   ├── strategies/       # Padrão Strategy (AIAnalysis, SimpleAnalysis)
│   ├── uploads/          # Imagens de capa enviadas
│   ├── .env.example      # Arquivo de exemplo .env
│   └── server.js         # Ponto de entrada do servidor (Express)
├── confia-frontend/
│   ├── css/              # Arquivos CSS (index.css, politica.css, etc.)
│   ├── js/               # Arquivos JS (index.js, politica.js, etc.)
│   ├── artigo.html       # Visualização de notícia individual
│   ├── cadastre.html     # Página de cadastro de usuário
│   ├── editor.html       # Editor de notícias (rota protegida)
│   ├── feedback.html     # Página de formulário de feedback
│   ├── index.html        # Homepage
│   ├── login.html        # Página de login de usuário
│   ├── noticias.html     # Página com todas as notícias (paginada)
│   ├── politica.html     # Página da categoria política (paginada)
│   ├── sobre-nos.html
│   └── perfil.html       # Página de perfil do autor
└── README.md
Como Executar o Projeto
1. Pré-requisitos
Node.js: Versão 18+ (Projeto desenvolvido com v22.18.0).

NPM (incluído no Node.js).

MongoDB Atlas: Uma string de conexão MONGO_URI de um cluster (pode ser o gratuito).

Google Cloud / AI Studio: Uma chave de API GEMINI_API_KEY válida, vinculada a um projeto com faturamento ativado (o Free Trial é suficiente) e com a "Gemini API" habilitada.

2. Instalação (Backend)
Bash

# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# 2. Acesse a pasta do backend
cd repositorio/confia-backend

# 3. Instale as dependências
npm install
3. Configuração (Backend)
Na pasta confia-backend/, crie um arquivo chamado .env.

Adicione as três chaves secretas necessárias:

Snippet de código

# String de conexão do MongoDB Atlas
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster...

# Chave de API do Google Gemini
GEMINI_API_KEY=AIzaSy...

# Segredo longo e aleatório para assinar os tokens de login
JWT_SECRET=SuaChaveSecretaMuitoSeguraAqui123!
4. Execução (Backend)
Bash

# Execute o servidor (com nodemon para auto-restart)
nodemon server.js

# Ou, para execução normal:
node server.js
O backend estará rodando em http://localhost:3000.

5. Execução (Frontend)
Navegue até a pasta confia-frontend/.

Abra qualquer arquivo .html (ex: index.html ou login.html) diretamente no seu navegador.

Recomendação: Use a extensão "Live Server" do VS Code para uma melhor experiência.

6. Acesso
API URL: http://localhost:3000/api

Frontend URL: file:///.../confia-frontend/index.html

Usuário Padrão: Não há. É necessário criar uma nova conta na página cadastre.html.

Checklist das 20 Funcionalidades
[x] Cadastro de Usuário (com hash de senha bcrypt).

[x] Login de Usuário (com autenticação JWT).

[x] Logout de Usuário (limpando o token).

[x] Atualização da UI baseada em Autenticação (links "Editor" e "Sair" / "Login").

[x] Proteção de Rota (Frontend): Página editor.html redireciona se deslogado.

[x] Proteção de Rota (Backend): Rota POST /api/noticias protegida por middleware JWT.

[x] Criação de Notícias (com título, categoria, tags, conteúdo).

[x] Upload de Imagem de Capa (Multer).

[x] Vínculo Notícia-Autor (ID do autor é salvo na notícia).

[x] Integração com API de IA Externa (Google Gemini).

[x] Geração de Resumo por IA.

[x] Geração de Taxa de Confiabilidade por IA.

[x] Geração de Revisão Crítica por IA.

[x] Exibição dos Dados da IA (Resumo, Revisão, Taxa) na página do artigo.

[x] Listagem Paginada de "Todas as Notícias" (noticias.html).

[x] Listagem Paginada por Categoria (politica.html).

[x] Listagem de Destaques e Últimas Notícias (index.html).

[x] Barra de Busca Funcional (Header) em todas as páginas.

[x] Exibição de Autor no Artigo (com link para o perfil).

[x] Página de Perfil de Autor (com dados do autor e suas notícias publicadas).

(Funcionalidades Bônus: Modo Claro/Escuro (Dark Theme), Modal de Perfil de Usuário, Formulário de Feedback com busca de artigos).

Design Patterns Aplicados na Camada de Domínio
🔹 Singleton
Uso: Conexão única ao banco de dados.

Justificativa: Aplicado no arquivo /config/database.js. A classe Database é instanciada e conectada uma única vez dentro do próprio módulo e a instância é exportada. Isso garante que todo o sistema (Repositories, Controllers) reutilize a mesma conexão com o MongoDB, evitando o consumo desnecessário de recursos.

🔹 Facade (Fachada)
Uso: Serviço de Análise de IA (/services/analysisService.js).

Justificativa: A interação com a API do Google Gemini envolve múltiplas etapas: inicializar o cliente, tratar chaves de API, limpar o HTML, construir um prompt complexo, fazer a chamada de rede, tratar a resposta (JSON vs. texto) e lidar com erros. O AnalysisService atua como uma Fachada, escondendo toda essa complexidade por trás de um método único e simples: analyzeNews(conteudo). O Controller apenas chama este método.

🔹 Strategy (Estratégia)
Uso: Múltiplos métodos de análise de notícias (/strategies/).

Justificativa: O sistema precisava de diferentes formas de analisar uma notícia (uma análise real com IA para "Política", e uma análise simulada/padrão para outras categorias). O padrão Strategy foi usado para definir uma interface (AnalysisStrategy.js) e implementações concretas (AIAnalysisStrategy.js e SimpleAnalysisStrategy.js). Isso permite que o sistema escolha o algoritmo de análise em tempo de execução.

🔹 Factory Method (Fábrica)
Uso: Criação da estratégia de análise correta (/factories/AnalysisStrategyFactory.js).

Justificativa: Para complementar o padrão Strategy, o Factory Method é usado para desacoplar o Controller da criação dos objetos de estratégia. O AnalysisStrategyFactory possui um método (getStrategy(categoria)) que contém a lógica de decisão para instanciar e retornar o objeto Strategy correto (IA real ou Simples) com base na categoria da notícia.

Observações
O projeto utiliza Tailwind CSS via CDN para estilização rápida, mas também utiliza arquivos CSS externos por página (ex: politica.css, index.css) para estilos de layout base e componentes customizados, demonstrando uma abordagem híbrida.

A API Gemini requer que a chave esteja associada a um projeto Google Cloud com Faturamento (Billing) ativo.

A funcionalidade "Meu Perfil" e a exibição do autor no artigo dependem do método .populate() do Mongoose, que foi implementado no NoticiaRepository.