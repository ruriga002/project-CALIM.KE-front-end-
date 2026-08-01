# CALIM.KE Frontend

This project is the React + Vite frontend for CALIM.KE. It connects to the Flask backend for products, auth, orders, customers, collections, and admin dashboard data.

## Run the app

From the frontend project folder:

```bash
npm install
npm run dev
```

The app runs locally at http://127.0.0.1:5178.

## Backend connection

The frontend is configured to talk to the backend through Vite proxying.
If you want to override the backend URL, set:

```bash
VITE_API_URL=http://127.0.0.1:5000
```

## Admin access

Use the following admin credentials to sign in and access the admin dashboard:

- Email: admin@calim.com
- Password: admin123

After login, open:

- /admin/dashboard

## Admin pages

The admin area includes:

- Dashboard
- Products
- Orders
- Customers
- Collections
- Inventory
- Settings

## Build

```bash
npm run build
```

