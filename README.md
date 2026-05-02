# EstateFlow Real Estate Portal

A MERN project for a real estate client with interactive listings, advanced filters, map-style discovery, saved favorites, lead capture, and agent productivity tools.

## Stack

- React + Vite
- Express
- MongoDB + Mongoose
- Responsive CSS UI

## Run Locally

```bash
npm run install:all
npm run dev
```

Client: `http://localhost:5173`

API: `http://localhost:5001/api`

The server runs with bundled sample property data if `MONGO_URI` is not configured.

## MongoDB

Create `server/.env`:

```bash
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/estateflow
CLIENT_ORIGIN=http://localhost:5173
```

Then seed the database:

```bash
npm --prefix server run seed
```
# Real-Estate-Master
