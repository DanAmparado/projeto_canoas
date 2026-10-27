# Guia de Implantação em Produção (VM Linux)

Este documento descreve o passo a passo para implantar o Projeto Canoas em uma Máquina Virtual (VM) Linux (Ubuntu 22.04 LTS ou 24.04 LTS).

A arquitetura de produção utilizará:
- Nginx como proxy reverso e servidor de arquivos estáticos (frontend React).
- Gunicorn como servidor WSGI para o backend Django.
- PostgreSQL como banco de dados.
- Systemd para manter o Gunicorn rodando em segundo plano.

## Pré-requisitos

- Acesso SSH à VM com permissões de sudo.
- Domínio ou IP público configurado.
- Portas 80 (HTTP) e 443 (HTTPS) liberadas no firewall da VM.

## Passo 1: Atualizar o sistema e instalar dependências básicas

Acesse a VM via SSH e execute:

sudo apt update
sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv postgresql postgresql-contrib nginx curl git -y

Verifique as versões instaladas:
python3 --version
node --version (se o node não estiver instalado, faremos no passo 6)

## Passo 2: Configurar o Banco de Dados PostgreSQL

Acesse o console do PostgreSQL:
sudo -u postgres psql

Crie o banco de dados e o usuário (substitua 'senha_forte' por uma senha segura):
CREATE DATABASE canoas_db;
CREATE USER canoas_user WITH PASSWORD 'senha_forte';
ALTER ROLE canoas_user SET client_encoding TO 'utf8';
ALTER ROLE canoas_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE canoas_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE canoas_db TO canoas_user;
\q

## Passo 3: Clonar o projeto e configurar o Backend

Crie o diretório da aplicação:
sudo mkdir -p /var/www/projeto_canoas
sudo chown -R $USER:$USER /var/www/projeto_canoas
cd /var/www/projeto_canoas

Clone o repositório:
git clone <URL_DO_REPOSITORIO> .

Navegue até o backend:
cd backend

Crie e ative o ambiente virtual:
python3 -m venv venv
source venv/bin/activate

Instale as dependências:
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

## Passo 4: Configurar as variáveis de ambiente do Backend

Crie o arquivo .env a partir do exemplo:
cp .env.example .env
nano .env

Preencha com os dados de produção:
SECRET_KEY= (gere uma nova chave com o comando: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
DEBUG=False
ALLOWED_HOSTS=seu_dominio.com, IP_DA_VM
CORS_ALLOWED_ORIGINS=https://seu_dominio.com
DATABASE_URL=postgres://canoas_user:senha_forte@localhost:5432/canoas_db
HCAPTCHA_SITEKEY=sua_chave_publica_real
HCAPTCHA_SECRET=sua_chave_secreta_real

## Passo 5: Executar migrações e coletar estáticos

Ainda no diretório backend com o venv ativado:

python manage.py migrate
python manage.py collectstatic --noinput

Crie o superusuário:
python manage.py createsuperuser

Acesse o shell para definir a role do usuário como admin:
python manage.py shell
>>> from accounts.models import User
>>> u = User.objects.get(username='seu_usuario')
>>> u.role = 'admin'
>>> u.save()
>>> exit()

Teste se o Gunicorn consegue subir a aplicação:
gunicorn --bind 0.0.0.0:8000 config.wsgi:application
(Acesse http://IP_DA_VM:8000 no navegador para testar. Depois pressione Ctrl+C para parar).

## Passo 6: Compilar o Frontend React

Instale o Node.js (versão 20 LTS recomendada):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

Navegue até a pasta do frontend:
cd /var/www/projeto_canoas/frontend

Instale as dependências e compile:
npm install
cp .env.example .env
nano .env (Configure VITE_API_URL com o domínio de produção, ex: https://seu_dominio.com/api)
npm run build

Isso criará a pasta /var/www/projeto_canoas/frontend/dist com os arquivos estáticos.

## Passo 7: Configurar o Gunicorn como serviço (Systemd)

Crie o arquivo de serviço:
sudo nano /etc/systemd/system/canoas.service

Cole o seguinte conteúdo (ajuste os caminhos se necessário):

[Unit]
Description=Gunicorn para o Projeto Canoas
After=network.target

[Service]
User=seu_usuario_do_linux
Group=www-data
WorkingDirectory=/var/www/projeto_canoas/backend
Environment="PATH=/var/www/projeto_canoas/backend/venv/bin"
EnvironmentFile=/var/www/projeto_canoas/backend/.env
ExecStart=/var/www/projeto_canoas/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/projeto_canoas/backend/canoas.sock config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target

Ative e inicie o serviço:
sudo systemctl start canoas
sudo systemctl enable canoas
sudo systemctl status canoas (verifique se está "active (running)")

## Passo 8: Configurar o Nginx

Crie o arquivo de configuração do site:
sudo nano /etc/nginx/sites-available/canoas

Cole o conteúdo (substitua seu_dominio.com):

server {
    listen 80;
    server_name seu_dominio.com;

    # Rota para o Frontend (React)
    location / {
        root /var/www/projeto_canoas/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Rota para o Backend (Django API)
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/projeto_canoas/backend/canoas.sock;
    }

    # Rota para o Admin do Django e arquivos estáticos do Django
    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/projeto_canoas/backend/canoas.sock;
    }

    location /static/ {
        alias /var/www/projeto_canoas/backend/staticfiles/;
    }
}

Ative o site e reinicie o Nginx:
sudo ln -s /etc/nginx/sites-available/canoas /etc/nginx/sites-enabled/
sudo nginx -t (para testar a sintaxe)
sudo systemctl restart nginx

## Passo 9: Configurar HTTPS (Certbot/Let's Encrypt) - Altamente Recomendado

Como o projeto usa hCaptcha e autenticação, o HTTPS é essencial.

sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu_dominio.com

Siga as instruções na tela. O Certbot atualizará a configuração do Nginx automaticamente para redirecionar HTTP para HTTPS.

## Passo 10: Configurações de Segurança Finais

1. Ajuste o settings.py para garantir que as opções de segurança estão ativas quando DEBUG=False:
   O arquivo já está configurado para ativar SECURE_SSL_REDIRECT, SESSION_COOKIE_SECURE, etc.

2. Configurar o Firewall (UFW):
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable

## Manutenção e Atualizações

Para atualizar o código em produção, siga os passos:

1. Acesse a pasta do projeto e puxe as atualizações:
   cd /var/www/projeto_canoas
   git pull origin main

2. Atualize o Backend:
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   deactivate

3. Atualize o Frontend (se houver mudanças):
   cd ../frontend
   npm install
   npm run build

4. Reinicie os serviços:
   sudo systemctl restart canoas
   sudo systemctl reload nginx

## Solução de Problemas

- Erro 502 Bad Gateway no Nginx: Verifique se o Gunicorn está rodando (sudo systemctl status canoas) e se o arquivo .sock tem as permissões corretas.
- Erro 400 no envio do formulário: Verifique as chaves do hCaptcha no .env.
- Frontend mostra tela branca: Verifique se o arquivo .env do frontend aponta para a URL correta e se o build foi feito novamente após a alteração.
- Banco de dados não conecta: Verifique se o PostgreSQL está rodando (sudo systemctl status postgresql) e se as credenciais no .env estão corretas.