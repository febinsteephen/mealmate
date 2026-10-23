# MealMate 🍲

> A MERN Stack surplus food redistribution platform connecting restaurants and shops with donation camps and shelters, where food is completely free and recipients only cover the delivery logistics.

---

## 1. Project Overview & Problem Statement

- **Problem:** Commercial food establishments (restaurants, caterers, bakeries, supermarkets) generate edible surplus food daily that goes to waste. Concurrently, disaster relief camps, shelter homes, and community kitchens operate on limited budgets and struggle with nutrition supplies and transport logistics.
- **Solution:** **MealMate** creates a transparent bridge. Donors list surplus food at **₹0 food cost**. Relief camps and welfare organizations claim meals based on proximity and need, paying **only the nominal delivery fee** to cover rider transport and prevent order abuse.

---

## 2. Target Users & Roles

| Role | Responsibilities & Capabilities |
| :--- | :--- |
| **Donor (Shops / Restaurants)** | • Post surplus food listings (quantity, veg/non-veg, prepared time, expiry deadline, pickup location).<br>• View own donations history and status updates. |
| **Recipient (Camps / NGOs / Shelters)** | • Discover nearby surplus food listings with freshness countdowns.<br>• Claim meals and pay delivery charges.<br>• Track order and delivery status in real-time. |
| **Admin (Platform Verifier)** | • Verify registered food donation camps and donor establishments.<br>• Monitor safety standards and system analytics. |

---

## 3. Technology Stack

- **Frontend:** React (Vite), React Router DOM, Axios, Lucide Icons, Modern CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT), Bcrypt password hashing.
- **Version Control:** Git & GitHub.

---

## 4. Project Structure

```text
mernstack/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route views (Home, Login, Dashboard, etc.)
│   │   ├── services/           # Axios API client module
│   │   ├── context/            # Auth and global state management
│   │   └── hooks/              # Custom reusable React hooks
│   ├── .env.example            # Sample client environment variables
│   └── package.json
├── server/                     # Backend Node/Express API
│   ├── src/
│   │   ├── config/             # Database connection & configurations
│   │   ├── controllers/        # Request handling and business logic
│   │   ├── middleware/         # Auth, validation, and error middlewares
│   │   ├── models/             # Mongoose schemas (User, FoodListing, Order)
│   │   ├── routes/             # RESTful API route endpoints
│   │   └── server.js           # Server entry point
│   ├── .env.example            # Sample server environment variables
│   └── package.json
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
└── README.md                   # Project documentation & guidelines
```

---

## 5. Getting Started & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string
- Git

### 1. Clone & Setup Backend
```bash
cd server
npm install
# Configure environment variables
cp .env.example .env
# Start development server
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd ../client
npm install
# Configure environment variables
cp .env.example .env
# Start Vite development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 6. Environment Variables

### Server (`server/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/mealmate` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `mealmate_super_secret_jwt_key_2026` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |

### Client (`client/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:5000/api` |

---

## 7. ICTAK Milestone Progress
- [x] **Milestone 1:** Project defined (Problem statement, roles, MVP scope).
- [x] **Milestone 2:** Repository and skeleton ready (Vite client, Express server, .gitignore, clean separation).
- [ ] **Milestone 3:** Database models & CRUD endpoints (Auth, Food listings, Orders).
- [ ] **Milestone 4:** Authentication & authorization (JWT, Role guards).
- [ ] **Milestone 5:** Frontend MVP screens with 4 states (Loading, Success, Empty, Error).
- [ ] **Milestone 6:** Frontend & backend end-to-end integration.
- [ ] **Milestone 7:** Testing, validation, and edge-case fixing.
- [ ] **Milestone 8:** Deployment (Vercel / Render / Atlas).
