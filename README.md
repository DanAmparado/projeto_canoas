# Projeto Canoas

Sistema genérico para coleta de respostas e mensagens, com formulário público, área administrativa restrita, dashboard e exportação de dados em CSV.

Este projeto foi estruturado para ser uma base limpa e reutilizável, permitindo a fácil adaptação para diferentes contextos de pesquisa, ouvidoria ou recebimento de mensagens.

## Funcionalidades

- Formulário público com campos para Nome (opcional), E-mail (opcional) e Mensagem (obrigatório).
- Salvamento automático de rascunho no navegador (localStorage) e aviso ao sair com dados não salvos.
- Proteção contra robôs utilizando hCaptcha.
- Rate limiting (limite de envios por IP) para evitar spam.
- Área administrativa restrita (rota /gestao) acessível apenas por login, contendo:
  - Dashboard com gráfico de envios dos últimos 30 dias.
  - Listagem de respostas com filtros por período, paginação e modal de visualização.
  - Exportação das respostas filtradas em formato CSV.
  - Gerenciamento de usuários (criação, edição, reset de senha e exclusão).
- Modo de exibição padrão e modo de alto contraste (alternável no cabeçalho).
- Layout responsivo para desktop e dispositivos móveis.

## Tecnologias Utilizadas

Backend:
- Python 3.14+
- Django 6.0+
- Django REST Framework
- Simple JWT (autenticação)
- django-filter (filtros)
- dj-database-url
- WhiteNoise (arquivos estáticos)
- Gunicorn (servidor WSGI)
- PostgreSQL

Frontend:
- React 19+
- Vite (build tool)
- React Router DOM
- Axios
- Chart.js e react-chartjs-2
- @hcaptcha/react-hcaptcha
- CSS Modules

## Estrutura do Projeto

projeto_canoas/
├── backend/
│   ├── accounts/          # App de gerenciamento de usuários
│   ├── respostas/         # App principal (modelo, views, serializers)
│   ├── config/            # Configurações do Django (settings, urls, wsgi)
│   ├── core/              # Permissões personalizadas
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example       # Exemplo de variáveis de ambiente do backend
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/           # Configuração do Axios e chamadas de API
│   │   ├── components/    # Componentes reutilizáveis (Navbar, Modal, etc.)
│   │   ├── context/       # Contextos (Auth, Theme)
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── styles/        # Estilos globais
│   │   └── utils/
│   ├── package.json
│   └── .env.example       # Exemplo de variáveis de ambiente do frontend
├── .gitignore
├── README.md
└── DEPLOY.md              # Instruções detalhadas para implantação em VM

## Execução Local (Desenvolvimento)

### Pré-requisitos
- Docker Desktop (opcional, para banco local) ou instância do PostgreSQL.
- Python 3.14+
- Node.js 20+
- Git

### 1. Configurar o Backend

Navegue até a pasta do backend:
cd backend

Crie e ative o ambiente virtual:
python -m venv venv
venv\Scripts\activate    (Windows)
source venv/bin/activate (Linux/macOS)

Instale as dependências:
pip install -r requirements.txt

Crie o arquivo .env com base no .env.example:
cp .env.example .env

(Edite o .env com suas credenciais locais. Para o banco, você pode usar Docker ou um PostgreSQL instalado na máquina).

Execute as migrações:
python manage.py migrate

Crie um superusuário:
python manage.py createsuperuser

Defina a role do superusuário como admin (necessário para acessar a área de gestão):
python manage.py shell
>>> from accounts.models import User
>>> u = User.objects.get(username='seu_usuario')
>>> u.role = 'admin'
>>> u.save()
>>> exit()

Inicie o servidor:
python manage.py runserver

### 2. Configurar o Frontend

Em outro terminal, navegue até a pasta do frontend:
cd frontend

Instale as dependências:
npm install

Crie o arquivo .env com base no .env.example:
cp .env.example .env

(As chaves padrão já apontam para o backend local e usam o hCaptcha de teste).

Inicie o servidor Vite:
npm run dev

O frontend estará disponível em http://localhost:5173

## Endpoints Principais da API

Autenticação:
- POST /api/token/                    Obter token JWT
- POST /api/token/refresh/            Renovar token JWT

Usuários:
- GET    /api/accounts/me/            Dados do usuário logado
- GET    /api/accounts/usuarios/      Listar usuários (requer admin)
- POST   /api/accounts/usuarios/      Criar usuário (requer admin)
- PUT    /api/accounts/usuarios/<id>/ Editar usuário (requer admin)
- DELETE /api/accounts/usuarios/<id>/ Excluir usuário (requer admin)

Respostas:
- POST /api/respostas/criar/          Enviar nova resposta (público, requer hCaptcha)
- GET  /api/respostas/listar/         Listar respostas (requer relatorios/admin)
- GET  /api/respostas/resumo/         Resumo para o dashboard (requer relatorios/admin)
- GET  /api/respostas/exportar/       Exportar CSV (requer relatorios/admin)

## Implantação em Produção

Este projeto foi preparado para ser implantado em uma Máquina Virtual (VM). As instruções completas de instalação de dependências, configuração do Nginx, Gunicorn e PostgreSQL estão detalhadas no arquivo DEPLOY.md.