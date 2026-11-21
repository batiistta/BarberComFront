# BarberCom Front

Interface web do BarberCom em **HTML, CSS e JavaScript** (sem framework).

Consome a API do repositório [BarberComBackend](https://github.com/batiistta/BarberComBackend).

## Telas

- Login e cadastro de cliente
- Fluxo de agendamento (serviços → unidades → profissional/horário → resumo)
- Área do cliente (agendamentos e conta/histórico)
- Painel do gestor (unidades, profissionais, serviços, horários, histórico)

## Pré-requisitos

- API rodando em `http://localhost:3000` (veja o backend)
- Ou modo mock, sem API

A origem da API está em `js/config.js`:

```js
window.BARBERCOM_CONFIG = { API_ORIGIN: 'http://localhost:3000' };
```

## Docker

```powershell
docker build -t barbercom-front .
docker run --rm -p 5173:80 barbercom-front
```

Abra http://localhost:5173.

### Junto com o backend

Clone os dois repositórios na mesma pasta e use o Compose do backend:

```powershell
cd BarberComBackend
docker compose -f docker-compose.yml -f docker-compose.front.yml up --build
```

## Sem Docker

Qualquer servidor estático na pasta do projeto, por exemplo:

```powershell
npx --yes serve -l 5173
```

Configure `FRONTEND_ORIGIN=http://localhost:5173` no backend para o CORS com cookies funcionar.

## Modo demonstração (sem API)

- Abra com `?mock=1`, ou
- Abra o `index.html` via `file://`

Os dados ficam só em memória no navegador.

## Acessos (com backend/seed)

| Perfil | Telefone | Senha |
| --- | --- | --- |
| Gestor | `71999990000` | `SenhaGestor@2026` |
| Cliente | `71988880001` | `SenhaCliente@2026` |

O telefone é formatado na digitação; o envio à API usa apenas dígitos.

## Estrutura

```text
index.html       shell da aplicação
css/styles.css   estilos
js/config.js     origem da API
js/app.js        telas e integração
logo.png
nginx.conf       config do container
Dockerfile
Telas/           referências visuais (PNG)
```
