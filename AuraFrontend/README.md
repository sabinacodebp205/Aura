# React + Vite - Aura Frontend

## Development Backend Environments

You can run the frontend in development mode connected to either the local or production backend:

- **`npm run dev:local`**: Connects the local frontend to the **local backend** (`http://localhost:5083/api`) and local database (`(localdb)\MSSQLLocalDB`).
- **`npm run dev:prod`**: Connects the local frontend directly to the **deployed production backend** (`https://aura-gfiv.onrender.com/api`) and its Azure SQL database.

> ⚠️ **Warning**: The local and production databases are completely isolated. Data added through the production Swagger UI (`https://aura-gfiv.onrender.com/swagger`) will only appear when running `npm run dev:prod` (or when `.env.local` is pointing to production). Make sure you are running the corresponding script for the environment you intend to test against.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
