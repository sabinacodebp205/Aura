# Aura

Full-stack interior design and e-commerce project with .NET 8 Backend and React (Vite) Frontend.

## Running the Frontend

Navigate to `AuraFrontend`:

```bash
cd AuraFrontend
```

### Development Modes

- **`npm run dev:local`**: Connects the local frontend to the **local backend** (`http://localhost:5083/api`) and local database (`(localdb)\MSSQLLocalDB`). Use this when running the backend locally.
- **`npm run dev:prod`**: Connects the local frontend directly to the **deployed production backend** (`https://aura-gfiv.onrender.com/api`) and its Azure SQL database.

> [!WARNING]
> **Database Isolation Notice**: The local database and the production Azure SQL database are completely separate. Be careful not to mix them up (e.g. creating/modifying data via the production Swagger UI at `https://aura-gfiv.onrender.com/swagger` while running `npm run dev:local`, or expecting local database changes to reflect when connected to production).
