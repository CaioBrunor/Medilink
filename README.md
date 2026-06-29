Markdown

# MediLink

> Plataforma integrada de gestão clínica e logística farmacêutica — conectando médicos, clínicas e distribuidores num único ecossistema.

---

## Índice

- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
  - [Landing Page](#landing-page)
  - [Portal do Médico](#portal-do-médico)
  - [Portal do Fornecedor](#portal-do-fornecedor)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Instruções de Uso](#instruções-de-uso)

---

## Descrição

O **MediLink** é uma aplicação web full-stack que centraliza dois fluxos operacionais distintos dentro do setor de saúde:

**Para profissionais de saúde**, oferece um painel clínico com apoio à decisão terapêutica baseado em evidências — sugerindo medicamentos de primeira e segunda linha consoante a queixa do paciente, sinalizando contraindicações, interações medicamentosas e considerações para perfis especiais (gestantes, idosos, pediátricos). O médico pode solicitar pedidos de medicamentos diretamente pelo catálogo integrado.

**Para distribuidores e farmácias**, disponibiliza um painel de gestão completo — desde o cadastro de produtos e catálogo até o acompanhamento do ciclo de vida de cada pedido em tempo real.

A arquitetura baseia-se em um modelo de **Monorepo**, contendo um frontend SPA em React 18 (Vite) e um backend em Node.js (Express) com persistência real em cluster de nuvem do **MongoDB Atlas** e autenticação segura via **JWT**.

---

## Tecnologias

| Camada             | Tecnologia             | Função                          |
| ------------------ | ---------------------- | ------------------------------- |
| **Frontend**       | React 18.3.1           | Biblioteca de Interface         |
| **Build Tool**     | Vite 5.4.19            | Bundler e Servidor de Dev Fast  |
| **Backend**        | Node.js / Express      | API RESTful e Regras de Negócio |
| **Banco de Dados** | MongoDB Atlas          | Persistência NoSQL em Nuvem     |
| **ORM / Driver**   | Mongoose               | Modelagem de Objetos e Schemas  |
| **Autenticação**   | JSON Web Tokens (JWT)  | Segurança e Sessões Protegidas  |
| **Estilos**        | CSS3 Custom Properties | Design Tokens Globais e Temas   |

---

## Funcionalidades

### Landing Page

A página principal serve como ponto de entrada público da plataforma.

- Navegação com scroll-spy e menu responsivo (hambúrguer em mobile)
- Seção hero com chamada à ação diferenciada por perfil
- Fluxo operacional estruturado em 4 passos e Seção "Quem Somos"
- Tabela de planos de subscrição (Free, Pro, Hospitalar) e Centro de suporte
- Modal de acesso rápido ao painel de cliente e login unificado

### Portal do Médico

- **Autenticação e Perfil:** Registro completo com e-mail, nome, CRM e senha. Login integrado gerando Token JWT seguro armazenado em sessão.
- **Consulta com IA Clínica:** Formulário estruturado de dados do paciente (idade, sexo, peso, altura) e tags de condições pré-existentes. Campo de queixa principal com detecção automática de condições (Faringoamigdalite, Síndrome Febril, Síndrome Álgica, Hipertensão Arterial, Gastropatia/DRGE).
- **Resultado Clínico Gerado:** Exibição de medicamentos de 1.ª linha e alternativas com alertas de contraindicação cruzados por IA e verificador de interações medicamentosas (ex: Losartana × AINEs).
- **Catálogo de Medicamentos Real:** O catálogo consome os dados em tempo real da API (`GET /api/products`). Ao clicar em "Solicitar pedido", abre-se o modal de checkout calculando a comissão MediLink (5%) e salvando a ordem diretamente no MongoDB associada ao ID do médico.

### Portal do Fornecedor

- **Dashboard Operacional:** KPIs em tempo real com contagem de pedidos, receita simulada total e produtos ativos puxados do banco.
- **Gestão de Produtos:** Formulário para inserção e edição de medicamentos convertendo e salvando as propriedades no modelo NoSQL (`name`, `price`, `stock`, `tags`).
- **Gestão de Pedidos:** Listagem unificada consumindo os pedidos reais gerados pelos médicos (`GET /api/orders`), permitindo filtrar por estados e acionar atualizações diretas de transição de fluxo (`Pendente → Aceito → Enviado`) persistidos de forma segura no banco de dados.

---

## Estrutura do Projeto

medilink/
├── index.html # Entrada HTML do Frontend
├── vite.config.js # Configuração do Vite
├── package.json # Scripts e dependências do Frontend
├── src/ # Código Fonte do Frontend (React)
│ ├── main.jsx # Ponto de entrada React
│ ├── App.jsx # Controle de rotas e fluxo de visões
│ ├── services/
│ │ ├── api.js # Serviços de requisições Fetch (Login, Register, Products, Orders)
│ │ └── storage.js # Helper de persistência local de sessão (Token JWT)
│ ├── data/ # Constantes e dicionários de dados estáticos
│ ├── utils/ # Regex para detecção clínica e máscaras de input
│ ├── styles/ # CSS estruturado em Design Tokens e Componentes
│ ├── components/ # Modais reutilizáveis, Toasts e Barras de Navegação
│ └── pages/ # Views organizadas (Landing, Medico, Fornecedor)
└── backend/ # Servidor de Aplicação (Node.js)
├── package.json # Scripts e dependências do Backend
├── .env # Variáveis de ambiente protegidas (MongoDB URI, JWT Secret)
└── server.js # Inicialização do Express, conexão Mongoose e Endpoints

---

## Modelagem do Banco de Dados

O banco de dados utiliza três entidades interconectadas no MongoDB por meio de referências (`ObjectIds`):

### 1. Usuários (`User`)

- `name`: String (Obrigatório)
- `email`: String (Obrigatório, Único)
- `password`: String (Obrigatório)
- `role`: String (`'medico'` ou `'fornecedor'`)

### 2. Produtos (`Product`)

- `name`: String (Obrigatório)
- `description`: String (Tipo do remédio: Genérico/Referência/Similar)
- `price`: Number (Obrigatório)
- `stock`: Number (Obrigatório)
- `tags`: Array de Strings (Utilizadas para o cruzamento clínico da IA do frontend)

### 3. Pedidos (`Order`)

- `productId`: ObjectId (Referência obrigatória para a Coleção `Product`)
- `userId`: ObjectId (Referência obrigatória para a Coleção `User` do médico que solicitou)
- `quantity`: Number (Obrigatório)
- `totalPrice`: Number (Valor total calculado incluindo comissões)
- `endereco`: String (Endereço de entrega informado no checkout)
- `status`: String (`'pendente'`, `'aceito'`, `'enviado'`, `'entregue'`)
- `createdAt`: Date (Gerado automaticamente pelo MongoDB)

---

## Endpoints da API

Todas as rotas de negócios exigem a passagem do Token JWT gerado no login através do cabeçalho `Authorization: Bearer <token>`.

### Autenticação (`/api/auth`)

- `POST /api/auth/register` — Cria um novo usuário no banco com escopo definido por perfil (`role`).
- `POST /api/auth/login` — Autentica o usuário e retorna o token de acesso seguro JWT e os metadados do perfil.

### Produtos (`/api/products`)

- `GET /api/products` — Lista todos os medicamentos disponíveis no banco de dados para abastecer o catálogo clínico.

### Pedidos (`/api/orders`)

- `POST /api/orders` — Cria um novo pedido vinculado ao médico autenticado e reduz o escopo financeiro.
- `GET /api/orders` — Lista os pedidos vinculados ao usuário autenticado (Médicos visualizam suas requisições; Fornecedores recebem as requisições enviadas à rede).

---

## Instruções de Uso

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior instalado)
- Conta ou Cluster ativo no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Configuração do Ambiente do Servidor

Dentro da pasta `backend/`, crie um arquivo `.env` contendo as suas chaves de acesso conforme a estrutura abaixo:

```env
MONGODB_USERNAME="seu_usuario_do_banco"
MONGODB_PASSWORD="sua_senha_do_banco"
JWT_SECRET="insira_uma_chave_secreta_aqui"
MONGODB_URI="mongodb+srv://<usuario>:<senha>@seu-cluster.mongodb.net/medilink?retryWrites=true&w=majority"
PORT=5000
```
