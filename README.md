
# 🛒 Ecommerce Application

## ⚙️ Tech Stack

### Frontend
- **NextJs**
- **Tailwind CSS**
- **Shadcn UI**

### Backend
- **Node.js + Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Docker**
- **TypeScript**

---
## 🖥️ Running the Application

You have two main parts to run: the backend and the frontend.


### ✅ Step 1: Start PostgreSQL Database using Docker

Run the following to start a local PostgreSQL container:

```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

> This exposes the database on `localhost:5432`.

**Connection URL:**

```
postgresql://postgres:mysecretpassword@localhost:5432/postgres
```

---

### ✅ Step 2: Setup and Start Backend

1. Navigate to the backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Prisma:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

4. Compile TypeScript:
   ```bash
   tsc -b
   ```

5. Start the backend server:
   ```bash
   node dist/src/index.js
   ```

> ✅ The backend will now be running on: `http://localhost:3001`

---

### ✅ Step 3: Setup and Start Frontend

1. Navigate to the frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

> ✅ The frontend will now be running on: `http://localhost:3000`

---

## 🧠 Notes

- Make sure Docker is installed and running on your system.
- The backend must be started before accessing the frontend.
- You can adjust ports or database credentials in the `.env` files as needed.