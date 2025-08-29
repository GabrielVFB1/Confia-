

# Confia! - Portal de Notícias Verificadas

## Descrição
O Confia! é um portal de notícias full-stack projetado para fornecer uma plataforma onde notícias podem ser criadas, visualizadas e avaliadas, com foco em uma arquitetura de software robusta e funcionalidades inteligentes.

O projeto utiliza **Node.js** com **Express.js** no backend, seguindo a arquitetura **MVC (Model-View-Controller)** e o padrão **Repository** para a camada de persistência de dados com o banco de dados **MongoDB**. O frontend é construído com HTML, JavaScript puro e estilizado com **Tailwind CSS** (via CDN).

Funcionalidades implementadas incluem um editor para criação de notícias com upload de imagem, um sistema de feedback, busca dinâmica em todo o conteúdo, exibição de notícias relacionadas e um score de confiabilidade simulado.

## Integrantes
- Bruno Pimenta - 22300147
- Breno Villela - 22301356
- Gabriel Victor - 22300473
- Samuel Brito - 22301186
- Pedro Borges - 22300180
- Rafael Augusto - 22301046

## Estrutura de Diretórios
.
├── confia-backend/
│   ├── controllers/
│   │   ├── FeedbackController.js
│   │   └── NoticiaController.js
│   ├── models/
│   │   ├── Feedback.js
│   │   └── Noticia.js
│   ├── repositories/
│   │   ├── FeedbackRepository.js
│   │   └── NoticiaRepository.js
│   ├── routes/
│   │   ├── feedback.js
│   │   └── noticias.js
│   └── server.js
├── confia-frontend/
│   ├── artigo.html
│   ├── editor.html
│   ├── feedback.html
│   ├── index.html
│   ├── politica.html
│   └── sobre-nos.html
├── node_modules/
├── uploads/
├── package-lock.json
├── package.json
└── README.md


## Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js**: Versão LTS (v18+) recomendada.
- **NPM**: Já vem instalado com o Node.js.
- **MongoDB Atlas**: É necessária uma conta gratuita para obter a string de conexão do banco de dados.

### 2. Instalação
```bash
# Clone este repositório para a sua máquina local
git clone [https://github.com/usuario/repositorio.git](https://github.com/usuario/repositorio.git)

# Acesse a pasta do projeto
cd repositorio

# Instale todas as dependências do backend
npm install
Configuração do Banco de Dados
Dentro da pasta confia-backend/, crie um arquivo chamado .env.

Dentro deste arquivo .env, adicione a sua string de conexão do MongoDB Atlas, como no exemplo abaixo:

MONGO_URI=mongodb+srv://<seu_usuario>:<sua_senha>@cluster...
Importante: Para que o arquivo .env funcione, é necessário instalar o pacote dotenv. Rode o seguinte comando na pasta raiz do projeto:

Bash

npm install dotenv
Em seguida, adicione a seguinte linha no topo do arquivo confia-backend/server.js:

JavaScript

require('dotenv').config();
3. Execução
Para rodar o projeto, você precisará de um terminal aberto na pasta raiz.

Bash

# Este comando inicia o servidor e o reinicia automaticamente ao salvar alterações
nodemon confia-backend/server.js

# Se não tiver o nodemon instalado, use:
# node confia-backend/server.js
O servidor do backend estará rodando em http://localhost:3000.

4. Acesso
Frontend: Para visualizar o site, navegue até a pasta confia-frontend e abra qualquer um dos arquivos .html (por exemplo, index.html) diretamente no seu navegador.

Recomenda-se o uso da extensão Live Server no VS Code para uma melhor experiência de desenvolvimento.

Observações
O Score de Confiabilidade exibido nas notícias é, no momento, simulado com um número aleatório gerado pelo backend. A estrutura está pronta para receber a integração com uma API de IA real.

O projeto foi estruturado para atender aos requisitos acadêmicos de separação em camadas (MVC e Repository), resultando em um código desacoplado e organizado.