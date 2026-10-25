# MealMate 🍲

> A MERN Stack surplus food redistribution platform connecting restaurants and shops with donation camps and shelters, where food is completely free and recipients only pay a flat **₹200 delivery fee**.

- **Live Hosted Application:** [https://mealmate-beta.vercel.app/](https://mealmate-beta.vercel.app/)
- **GitHub Repository:** [https://github.com/febinsteephen/mealmate](https://github.com/febinsteephen/mealmate)
- **Project Report:** [MealMate_Internship_Report.md](./MealMate_Internship_Report.md)

---

## 1. Project Overview & Problem Statement

- **Problem:** Commercial food establishments (restaurants, hotels, bakeries, caterers) generate edible surplus food daily that goes to waste. Concurrently, disaster relief camps, shelter homes, and community kitchens operate on limited budgets and struggle with meal supplies.
- **Solution:** **MealMate** creates a transparent bridge:
  - **Zero Food Price:** Donated food is listed at **₹0 / free of cost**.
  - **Flat Delivery Fee:** Regardless of distance, a fixed **₹200** delivery charge is paid by the camp to prevent spam/hoarding and cover courier logistics.
  - **Streamlined Identification:** Uses **Hotel/Shop Name** and **Camp/Donation Camp Name** without complex GPS/map overhead.

---

## 2. Target Users & Roles

| Role | Entity | Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **`hotel`** | Restaurants / Shops | • Register with Hotel/Shop name and phone.<br>• Post surplus food (title, servings, veg/non-veg, claim window).<br>• View incoming claims from camps and update pickup/delivery progress.<br>• Manage and delete own food listings. |
| **`camp`** | Donation / Relief Camps | • Register with Camp / Donation Camp name and phone.<br>• Discover active surplus food listings.<br>• Claim meals for their camp by paying the flat **₹200 delivery fee**.<br>• Track order status (`placed` $\rightarrow$ `picked_up` $\rightarrow$ `delivered`). |
| **`admin`** | Platform Overseer | • Platform monitoring and administrative access. |

---

## 3. Technology Stack

- **Frontend:** React (Vite), React Router DOM, Axios, Lucide Icons, Modern Responsive CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT), Bcrypt password hashing.
- **Version Control:** Git & GitHub.

---

## 4. API Contract

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new Hotel or Camp user |
| **POST** | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| **GET** | `/api/auth/me` | Private | Fetch logged-in user profile |
| **GET** | `/api/listings` | Public | Browse all available unexpired surplus food |
| **POST** | `/api/listings` | Private (`hotel`) | Create a new surplus food listing |
| **GET** | `/api/listings/my-listings` | Private (`hotel`) | Get all listings posted by this hotel |
| **DELETE** | `/api/listings/:id` | Private (`hotel`) | Delete own food listing |
| **POST** | `/api/orders` | Private (`camp`) | Claim food listing (records flat ₹200 delivery fee) |
| **GET** | `/api/orders/my-camp-orders` | Private (`camp`) | View claims & deliveries for this camp |
| **GET** | `/api/orders/my-hotel-orders` | Private (`hotel`) | View incoming claims for this hotel's food |
| **PATCH**| `/api/orders/:id/status` | Private | Update delivery status (`picked_up`, `delivered`) |
| **GET** | `/api/health` | Public | Server health check endpoint |

---

## 5. Project Structure

```text
mernstack/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── components/         # Navbar, AuthModal, Reusable UI
│   │   ├── context/            # AuthContext (JWT & state management)
│   │   ├── pages/              # BrowseFoodPage, HotelDashboard, HotelOrdersPage, CampOrdersPage
│   │   ├── services/           # Axios API client (interceptors, error handler)
│   │   ├── App.jsx             # Main layout & role routing
│   │   └── App.css             # Responsive styling & 4-state designs
│   ├── .env.example            # Sample client environment variables
│   └── package.json
├── server/                     # Backend Node/Express API
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.js)
│   │   ├── controllers/        # authController, listingController, orderController
│   │   ├── middleware/         # authMiddleware (JWT & roles), errorHandler
│   │   ├── models/             # User.js, FoodListing.js, Order.js
│   │   ├── routes/             # authRoutes, listingRoutes, orderRoutes
│   │   └── server.js           # Express app setup and middleware
│   ├── .env.example            # Sample server environment variables
│   └── package.json
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
└── README.md                   # Project documentation & guidelines
```

---

## 6. Getting Started & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas connection string
- Git

### 1. Backend Setup
```bash
cd server
npm install
# Configure environment variables
cp .env.example .env
# Start development server
npm run dev
```
The server starts at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd ../client
npm install
# Configure environment variables
cp .env.example .env
# Start Vite development server
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

## 7. ICTAK Milestone Progress
- [x] **Milestone 1:** Project defined (Problem statement, roles, MVP scope).
- [x] **Milestone 2:** Repository & skeleton ready (Vite client, Express server, .gitignore).
- [x] **Milestone 3:** Database models & schemas (`User`, `FoodListing`, `Order` with flat ₹200 fee).
- [x] **Milestone 4:** Authentication & authorization (JWT, Role guards for `hotel` & `camp`).
- [x] **Milestone 5:** Frontend MVP screens with 4 states (Loading, Success, Empty, Error).
- [x] **Milestone 6:** Frontend & backend end-to-end integration.
- [ ] **Milestone 7:** Testing, edge-case fixing, and demo data seeding.
- [ ] **Milestone 8:** Deployment (Vercel / Render / MongoDB Atlas).
- [ ] **Milestone 9:** Final submission checklist & presentation preparation.
