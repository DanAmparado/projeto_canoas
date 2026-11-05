# Projeto Rio Canoas - Abaixo-Assinado

Sistema web para coleta de assinaturas digitais em defesa do Rio Canoas e contra a privatização da Macrozona. O projeto inclui um formulário público para cadastro de apoiadores (Nome e Telefone) e uma área administrativa restrita para visualização dos dados, acompanhamento de métricas e exportação de relatórios.

## Funcionalidades

- Formulário público de abaixo-assinado com os campos: Nome (obrigatório), Telefone/WhatsApp (obrigatório), E-mail (opcional) e Mensagem (opcional).
- Salvamento automático de rascunho no navegador (localStorage) e aviso ao sair com dados não preenchidos.
- Proteção contra robôs utilizando hCaptcha.
- Rate limiting por IP para evitar envios automatizados em massa.
- Área administrativa restrita (rota /gestao) acessível apenas por login, contendo:
  - Dashboard com gráfico de evolução de assinaturas dos últimos 30 dias.
  - Listagem de assinaturas com filtros por período, paginação e modal de visualização detalhada.
  - Exportação das assinaturas filtradas em formato CSV (compatível com Excel).
  - Gerenciamento de usuários administradores.
- Modo de exibição padrão (identidade visual do Canva) e modo de alto contraste (acessibilidade).
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
```
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
│   ├── public/            # Imagens, favicon e banner
│   ├── src/
│   │   ├── api/           # Configuração do Axios e chamadas de API
│   │   ├── components/    # Componentes reutilizáveis (Navbar, Modal, etc.)
│   │   ├── context/       # Contextos (Auth, Theme)
│   │   ├── pages/         # Páginas (Home, Manifesto, Formulario, Dashboard, etc.)
│   │   ├── styles/        # Estilos globais e variáveis do Canva
│   │   └── utils/
│   ├── package.json
│   └── .env.example       # Exemplo de variáveis de ambiente do frontend
├── .gitignore
├── README.md
└── DEPLOY.md              # Instruções detalhadas para implantação em VM
```
## Execução Local (Desenvolvimento)

### Pré-requisitos
- Docker Desktop (para o banco de dados local) ou instância do PostgreSQL.
- Python 3.14+
- Node.js 20+
- Git

### 1. Configurar o Backend

Navegue até a pasta do backend:
```
cd backend
```
Crie e ative o ambiente virtual:
```
python -m venv venv
venv\Scripts\activate    (Windows)
source venv/bin/activate (Linux/macOS)
```
Instale as dependências:
```
pip install -r requirements.txt
```
Crie o arquivo .env com base no .env.example:
```
cp .env.example .env
```
(Edite o .env com suas credenciais locais de banco de dados e as chaves de teste do hCaptcha).

Execute as migrações:
```
python manage.py migrate
```
Crie um superusuário:
```
python manage.py createsuperuser
```
Defina a role do superusuário como admin:
```
python manage.py shell
>>> from accounts.models import User
>>> u = User.objects.get(username='seu_usuario')
>>> u.role = 'admin'
>>> u.save()
>>> exit()
```
Inicie o servidor:
```
python manage.py runserver
```
### 2. Configurar o Frontend

Em outro terminal, navegue até a pasta do frontend:
```
cd frontend
```
Instale as dependências:
```
npm install
```
Crie o arquivo .env com base no .env.example:
```
cp .env.example .env
```
(As chaves padrão apontam para o backend local e usam o hCaptcha de teste).

Inicie o servidor Vite:
```
npm run dev
```
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

Assinaturas:
- POST /api/respostas/criar/          Enviar nova assinatura (público, requer hCaptcha)
- GET  /api/respostas/listar/         Listar assinaturas (requer relatorios/admin)
- GET  /api/respostas/resumo/         Resumo para o dashboard (requer relatorios/admin)
- GET  /api/respostas/exportar/       Exportar CSV (requer relatorios/admin)

## Implantação em Produção

Este projeto foi preparado para ser implantado em uma Máquina Virtual (VM). As instruções completas de instalação de dependências, configuração do Nginx, Gunicorn e PostgreSQL estão detalhadas no arquivo DEPLOY.md.