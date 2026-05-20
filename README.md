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
- [Estrutura de Ficheiros](#estrutura-de-ficheiros)
- [Instruções de Uso](#instruções-de-uso)
- [Notas de Desenvolvimento](#notas-de-desenvolvimento)

---

## Descrição

O **MediLink** é uma aplicação web single-page que centraliza dois fluxos operacionais distintos dentro do setor de saúde:

**Para profissionais de saúde**, oferece um painel clínico com apoio à decisão terapêutica baseado em evidências — sugerindo medicamentos de primeira e segunda linha consoante a queixa do paciente, sinalizando contraindicações, interações medicamentosas e considerações para perfis especiais (gestantes, idosos, pediátricos).

**Para distribuidores e farmácias**, disponibiliza um painel de gestão completo — desde o cadastro de produtos e catálogo até ao acompanhamento do ciclo de vida de cada pedido (pendente → aceite → separando → enviado → entregue).

A arquitectura baseia-se em React 18 com Vite como bundler, com persistência total em `localStorage`, permitindo execução sem qualquer backend.

> ⚠️ **Ambiente de demonstração.** Os dados são fictícios e as senhas não são encriptadas. Não utilizar em produção com dados reais.

---

## Tecnologias

| Camada | Tecnologia | Versão |
|---|---|---|
| Interface | React | 18.3.1 |
| Build | Vite | 5.4.19 |
| Plugin React | @vitejs/plugin-react | 4.3.4 |
| Estilos | CSS3 com Custom Properties | — |
| Tipografia | Google Fonts — Syne + Nunito | — |
| Persistência | Web Storage API (`localStorage`) | — |

---

## Funcionalidades

### Landing Page

A página principal serve como ponto de entrada público da plataforma.

- Navegação com scroll-spy e menu responsivo (hambúrguer em mobile)
- Secção hero com chamada à ação diferenciada por perfil
- Fluxo operacional em 4 passos
- Secção "Quem Somos" com métricas de impacto
- Tabela de planos de subscrição (Free, Pro, Hospitalar)
- Centro de suporte com ligações para documentação e abertura de chamados
- Modal de acesso rápido ao painel de cliente
- Footer compacto com navegação secundária

### Portal do Médico

Acesso mediante registo com CRM e verificação de documentos.

**Autenticação e Perfil**
- Registo com CRM, UF, especialidade e dados da clínica
- Login por e-mail ou número de CRM
- Etapa de verificação de documentos (carteira CRM + documento de identidade)
- Configurações de conta com campos não editáveis protegidos (CRM)

**Consulta com IA Clínica**
- Formulário de dados do paciente: idade, sexo, peso, altura
- Registo de condições pré-existentes e medicamentos em uso (sistema de tags)
- Campo de queixa principal com detecção automática de condição clínica:
  - Faringoamigdalite, Síndrome Febril, Síndrome Álgica, Hipertensão Arterial, Gastropatia/DRGE
- Sintomas associados, duração e nível de gravidade
- Restrições clínicas: alergias e contraindicações por tags
- Tipo de paciente: Adulto, Gestante, Idoso, Pediátrico

**Resultado Clínico Gerado**
- Medicamento de 1.ª linha e alternativa terapêutica com:
  - Barras de eficácia e segurança (%)
  - Descrição farmacológica detalhada
  - Preço, prazo e fornecedor referência
- Alertas de contraindicação (ex.: penicilinas em alérgicos, AINEs em gestantes)
- Verificador de interações medicamentosas (ex.: Losartana × AINEs, Varfarina × Azitromicina)
- Tabela comparativa entre medicamentos sugeridos
- Aviso de base de evidências (CONITEC/MS · SBMFC 2024 · FTN)

**Pedidos e Histórico**
- Catálogo de produtos filtrado por medicamento selecionado
- Modal de checkout com seleção de quantidade, cálculo de subtotal e comissão MediLink (5%)
- Histórico de consultas clínicas realizadas com IA
- Acompanhamento de pedidos com indicação de estado

### Portal do Fornecedor

Acesso mediante registo com CNPJ e verificação de documentos empresariais.

**Autenticação e Perfil**
- Registo para farmácias e distribuidoras com CNPJ, responsável e endereço
- Etapa de verificação: Cartão CNPJ, Alvará de Funcionamento, Licença Sanitária
- Configurações de conta com CNPJ não editável protegido

**Dashboard**
- Saudação dinâmica por período do dia
- KPIs em tempo real: total de pedidos, receita simulada, pedidos em transporte, produtos activos
- Lista dos 4 pedidos mais recentes com acesso rápido

**Gestão de Produtos**
- Criação e edição de medicamentos no catálogo: nome, tipo (Genérico/Referência/Similar), preço, estoque, prazo de entrega e região de cobertura
- Remoção com modal de confirmação
- Estado vazio com chamada à ação

**Gestão de Pedidos**
- Filtros por estado: Todos, Pendentes, Aceites, Enviados
- Transição de estados através de acções directas no cartão de pedido:
  `Pendente → Aceite → Separando → Enviado → Entregue / Cancelado`
- Modal de detalhe com todas as informações do pedido e acções de estado
- Contador de pedidos pendentes no item de navegação
- Persistência de estados entre sessões

---

## Estrutura de Ficheiros

```
medilink/
├── index.html                  # Entrada HTML — monta o root React
├── vite.config.js              # Configuração do Vite
├── package.json                # Dependências e scripts npm
├── public/
│   └── assets/                 # Imagens estáticas (imgmedlink1-4.png)
└── src/
    ├── main.jsx                # Ponto de entrada React
    ├── App.jsx                 # Componente raiz — controlo de vista (landing/médico/fornecedor)
    ├── data/
    │   └── constants.js        # STATUS_LABELS, CLINICAL_DB, MOCK_PRODUCTS_CATALOG, DRUG_INTERACTIONS
    ├── services/
    │   └── storage.js          # Helpers de leitura/escrita em localStorage
    ├── hooks/
    │   └── useToast.js         # Hook de notificações toast (auto-dismiss 3s)
    ├── utils/
    │   ├── clinical.js         # detectCondition() — detecção de condição por regex
    │   └── masks.js            # Utilitários de mascaramento de inputs (CNPJ, etc.)
    ├── styles/                 # CSS modular por camada
    │   ├── variables.css       # Design tokens globais (--f-*)
    │   ├── global.css          # Reset e utilitários base
    │   └── [componente].css    # Estilos por componente/página
    ├── components/
    │   ├── common/             # ConfirmModal, DemoBanner, RadioGroup, StatusActions, TagInput, ToastContainer
    │   └── layout/             # AppSidebar, LogoMark
    └── pages/
        ├── Landing/            # Página pública (navbar, secções, footer, modal de acesso)
        ├── Medico/             # Welcome → Login → Register → Verify → Dashboard
        │   └── (11 componentes) # ClinicalView, ClinicalResult, modais de checkout e configurações
        └── Fornecedor/         # Welcome → Login → Register → Verify → Dashboard
            └── (9 componentes) # FornPedidosView, modais de produto, pedido e configurações
```

---

## Instruções de Uso

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm (incluído com o Node.js)

### Execução local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abrir no browser: `http://localhost:5173`

### Build para produção

```bash
npm run build
```

Os ficheiros optimizados serão gerados na pasta `dist/`.

### Fluxo recomendado para teste

**Portal do Médico**
1. Clicar em "Sou médico" na landing page
2. Criar conta com nome, CRM (ex.: `12345`), UF e especialidade
3. Ignorar a etapa de verificação clicando em "Pular esta etapa"
4. No painel, aceder a "Consulta com IA"
5. Preencher a queixa principal (ex.: `dor de garganta`) e clicar em "Gerar Apoio Clínico com IA"
6. Explorar o resultado: alertas, sugestões terapêuticas e tabela comparativa
7. Clicar em "Selecionar →" para aceder ao catálogo e simular um pedido

**Portal do Fornecedor**
1. Clicar em "Sou fornecedor" na landing page
2. Criar conta com nome da empresa, e-mail e senha
3. Ignorar a verificação de documentos
4. Explorar o Dashboard com KPIs e pedidos de exemplo
5. Em "Produtos", adicionar um medicamento ao catálogo
6. Em "Pedidos", avançar o estado dos pedidos de exemplo (Aceitar → Separando → Enviado → Entregue)

### Limpar dados entre sessões

Todos os dados são guardados em `localStorage`. Para reiniciar completamente:

```javascript
// Na consola do browser (F12 → Console)
localStorage.clear();
location.reload();
```

---

## Notas de Desenvolvimento

**Decisões de arquitectura**

- React 18 com Vite proporciona hot-reload instantâneo em desenvolvimento e build optimizado para produção.
- Os design tokens CSS são definidos uma única vez em `variables.css` e referenciados por aliases `--f-*` via `var()`, eliminando duplicação de valores.
- O componente `StatusActions` centraliza a lógica de transição de estados dos pedidos, evitando duplicação entre `OrderCard` e `FornOrderModal`.
- O `ConfirmModal` substitui o `window.confirm()` nativo, garantindo consistência visual e melhor experiência em mobile.
- A função `detectCondition()` usa regex para mapear linguagem natural da queixa do paciente a condições clínicas da `CLINICAL_DB`.

**Melhorias planeadas para produção**

- Substituir `localStorage` por API REST com base de dados relacional
- Implementar autenticação real com JWT e hash de palavras-passe (bcrypt)
- Adicionar testes unitários (Jest + React Testing Library)
- Migrar para TypeScript
- Implementar validação de CRM via API do CFM (Conselho Federal de Medicina)
- Adicionar internacionalização (i18n) para suporte a PT-PT e PT-BR
