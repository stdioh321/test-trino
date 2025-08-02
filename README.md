# 📊 Integração Trino com PostgreSQL e MySQL

Este projeto demonstra uma aplicação Node.js que se conecta a bancos PostgreSQL e MySQL através do **Trino**, realizando inserções e consultas combinadas entre os dois bancos.

## 📦 Pré-requisitos

- Docker e Docker Compose
- Node.js (para desenvolvimento local, opcional)
- cURL (para testes rápidos)

## 🚀 Iniciando a aplicação

Execute o script `start.sh` para subir os containers e iniciar a aplicação:

```bash
chmod +x start.sh
./start.sh
```

Este script:
- Sobe os serviços: MySQL, PostgreSQL e Trino
- Aguarda a inicialização
- Instala dependências e inicia o servidor Express

## 🌐 Endpoints disponíveis

### ➕ `GET /generate`

Gera dados aleatórios:

- 2 registros na tabela `lead` (PostgreSQL)
- 3 a 10 registros na tabela `attendance` (MySQL), associando-se a `lead`

#### Exemplo:

```bash
curl http://localhost:3000/generate
```

#### Exemplo de resposta:

```json
{
  "message": "Dados gerados com sucesso",
  "leads": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ],
  "attendances": 6
}
```

---

### 📄 `GET /result`

Consulta dados combinados entre PostgreSQL e MySQL via Trino, utilizando `JOIN`:

#### Exemplo:

```bash
curl http://localhost:3000/result
```

#### Exemplo de resposta:

```json
[
  {
    "p_id": 1,
    "p_name": "John Doe",
    "m_id": 7,
    "m_name": "Lucas",
    "m_external_lead_id": 1
  },
  ...
]
```

---

## 🛠 Estrutura do Projeto

```
.
├── app/                 # Código da aplicação Node.js
│   └── index.js         # Código principal
├── docker-compose.yml   # Serviços Docker (Trino, PostgreSQL, MySQL)
├── start.sh             # Script de inicialização completo
└── README.md            # Documentação do projeto
```

---

## 🧠 Tecnologias utilizadas

- **Node.js** (Express)
- **Trino** para query federada
- **PostgreSQL** (lead)
- **MySQL** (attendance)
- **Chance.js** para gerar dados aleatórios
- **Docker Compose** para orquestração

---

## 🧹 Encerrando os serviços

Pressione `Ctrl+C` ou encerre o terminal. O script irá automaticamente parar e remover os containers:

```bash
🛑 Encerrando serviços Docker...
✅ Serviços finalizados.
```

---

## 📌 Observações

- O Trino precisa estar corretamente configurado com os *connectors* de PostgreSQL e MySQL.
- O schema `lead` deve estar no PostgreSQL e `attendance` no MySQL.
- A aplicação assume catálogos `postgresql` e `mysql` com os respectivos schemas já criados.

---

## 🧪 Acessando os bancos via clientes (ex: DBeaver)

Você pode usar ferramentas como **DBeaver**, **TablePlus**, **DataGrip** ou **psql/mysql CLI** para acessar os bancos de dados PostgreSQL e MySQL expostos pelos containers.

### 🔐 Acesso ao PostgreSQL

- **Host:** `localhost`
- **Porta:** `5432`
- **Usuário:** `user_pg`
- **Senha:** `pass_pg`
- **Database:** `db_pg`

### 🔐 Acesso ao MySQL

- **Host:** `localhost`
- **Porta:** `3306`
- **Usuário:** `user_mysql`
- **Senha:** `pass_mysql`
- **Database:** `db_mysql`

> 💡 Certifique-se de que os containers estão em execução (`docker-compose up -d`) antes de tentar a conexão.

---

