
# 📊 Trino Integration with PostgreSQL and MySQL

This project demonstrates a Node.js application that connects to PostgreSQL and MySQL databases through **Trino**, performing inserts and combined queries across both databases.

## 📦 Prerequisites

- Docker and Docker Compose  
- Node.js (for local development, optional)  
- cURL (for quick testing)  

## 🚀 Starting the application

Unzip the `data.zip` file to create a `data` folder containing the SQL setup files for the PostgreSQL and MySQL databases.

Run the `start.sh` script to bring up the containers and start the application:

```bash
chmod +x start.sh
./start.sh
```

This script:  
- Brings up the services: MySQL, PostgreSQL, and Trino  
- Waits for initialization  
- Installs dependencies and starts the Express server  

## 🌐 Available Endpoints

### ➕ `GET /generate`

Generates random data:

- 2 records in the `lead` table (PostgreSQL)  
- 3 to 10 records in the `attendance` table (MySQL), associated with `lead`  

#### Example:

```bash
curl http://localhost:3000/generate
```

#### Example response:

```json
{
  "message": "Data generated successfully",
  "leads": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ],
  "attendances": 6
}
```

---

### 📄 `GET /result`

Queries combined data from PostgreSQL and MySQL via Trino, using `JOIN`:

#### Example:

```bash
curl http://localhost:3000/result
```

#### Example response:

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

## 🛠 Project Structure

```
.
├── app/                 # Node.js application code
│   └── index.js         # Main code
├── docker-compose.yml   # Docker services (Trino, PostgreSQL, MySQL)
├── start.sh             # Complete startup script
└── README.md            # Project documentation
```

---

## 🧠 Technologies used

- **Node.js** (Express)  
- **Trino** for federated querying  
- **PostgreSQL** (lead)  
- **MySQL** (attendance)  
- **Chance.js** for generating random data  
- **Docker Compose** for orchestration  

---

## 🧹 Stopping the services

Press `Ctrl+C` or close the terminal. The script will automatically stop and remove the containers:

```bash
🛑 Stopping Docker services...
✅ Services stopped.
```

---

## 📌 Notes

- Trino must be correctly configured with PostgreSQL and MySQL *connectors*.  
- The `lead` schema should be in PostgreSQL and `attendance` in MySQL.  
- The application assumes `postgresql` and `mysql` catalogs with the respective schemas already created.  

---

## 🧪 Accessing the databases via clients (e.g., DBeaver)

You can use tools like **DBeaver**, **TablePlus**, **DataGrip**, or **psql/mysql CLI** to access the PostgreSQL and MySQL databases exposed by the containers.

### 🔐 PostgreSQL Access

- **Host:** `localhost`  
- **Port:** `5432`  
- **User:** `user_pg`  
- **Password:** `pass_pg`  
- **Database:** `db_pg`  

### 🔐 MySQL Access

- **Host:** `localhost`  
- **Port:** `3306`  
- **User:** `user_mysql`  
- **Password:** `pass_mysql`  
- **Database:** `db_mysql`  

> 💡 Make sure the containers are running (`docker-compose up -d`) before attempting to connect.

---
