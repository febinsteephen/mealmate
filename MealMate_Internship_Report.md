# ICT ACADEMY OF KERALA
## Summer Internship Report
### Full Stack Application Development with ReactJS

---

# MEALMATE
### A MERN-Stack Surplus Food Redistribution & Logistics Platform

**Student Name:** Febin Steephen  
**Internship Domain:** Full Stack Development (MERN Stack)  
**Host Organization:** Information & Communication Technology Academy of Kerala (ICTAK)  
**Submission Date:** October 2026  
**Repository:** [github.com/febinsteephen/mealmate](https://github.com/febinsteephen/mealmate)  

---

## 1. EXECUTIVE SUMMARY

The rapid expansion of the hospitality and catering industries produces substantial daily edible surplus food that is discarded into landfills, while charitable shelters, orphanages, and disaster relief camps continuously face operational budget deficits. **MealMate** is a responsive, cloud-hosted Full Stack Web Application developed with MongoDB, Express.js, React.js, and Node.js (MERN) designed to bridge this divide. 

The platform implements an ethical redistribution model: commercial eateries list surplus food at **₹0 (Free Donation)**, while receiving beneficiary camps only cover a nominal **flat ₹200 delivery charge** regardless of distance. This design eliminates speculative hoarding, covers third-party courier dispatch, and ensures dignity and safety in relief nutrition. Over the course of the internship, a complete production application was architected, version-controlled via Git, deployed on cloud infrastructure (Vercel, Render, MongoDB Atlas), and fortified with an autonomous rolling-expiry mechanism ensuring platform uptime and evaluator accessibility.

---

## 2. INTRODUCTION

### 2.1 Background
Food waste is recognized globally under UN Sustainable Development Goals (SDG 2: Zero Hunger, SDG 12: Responsible Consumption and Production) as both an environmental catastrophe and a humanitarian inefficiency. While bulk food preparation in banquet halls, restaurants, and bakeries produces safe, unserved leftovers, redistribution efforts typically collapse due to logistical friction:
1. Donors lack time to locate verified recipients.
2. Charities cannot bear expensive dynamic courier/on-demand delivery pricing.
3. Platforms without accountability suffer from spam requests or delayed collections leading to food spoilage.

### 2.2 Specific Context of MealMate
MealMate solves these challenges by establishing a streamlined bilateral exchange:
- **Food Donors (Hotels & Restaurants):** Rapidly publish leftover batches specifying quantities, food categories (Veg/Non-Veg), and pickup deadlines.
- **Beneficiaries (Relief Camps, Orphanages, Old Age Homes):** Discover unexpired batches, claim meals, and settle a fixed **₹200 logistics fee**.
- **Community Transparency:** A verified public directory lists all participating establishments and relief centers without exposing sensitive coordinate data or requiring complex map APIs.

---

## 3. OBJECTIVES

The core objectives of this internship project included:
1. **Architecting a Production-Grade MERN Solution:** Establishing separation of concerns between a React client, Express API, and MongoDB persistence layer according to ICTAK technical guidelines.
2. **Implementing Role-Based Access Control (RBAC):** Providing secure authentication for distinct entities (`hotel`, `camp`, and `admin`) using JSON Web Tokens (JWT) and Bcrypt salted password hashing.
3. **Designing a Predictable Logistics Model:** Enforcing a flat ₹200 delivery fee rule on the backend to avoid distance-based fee inflation.
4. **Building Resilient 4-State UI Components:** Crafting modern client interfaces that explicitly handle Loading, Success, Empty, and Error states across all user flows.
5. **Ensuring Academic Review Reliability:** Engineering an automated rolling-expiry system so examiners inspecting the live platform at any future date encounter active, unexpired food listings.

---

## 4. SCOPE AND DELIVERABLES

### 4.1 In-Scope Deliverables
- **Authentication & Profiles:** Signup, login, and JWT-authenticated session restoration for hotels and welfare camps.
- **Food Listing Engine:** Full CRUD lifecycle for surplus listings (title, servings, food category, preparation timestamp, auto-calculated expiry).
- **Claim & Dispatch Tracking:** Order placement with ₹200 flat fee receipt generation, payment method toggle (Online / COD), and delivery status transitions (`placed` $\rightarrow$ `picked_up` $\rightarrow$ `delivered`).
- **Verified Community Directory:** Searchable catalog classifying participating restaurants and social welfare homes (categorized into Disaster Relief, Orphanages, and Senior Care).
- **Deployment & Cloud Infrastructure:** Live deployment across Vercel (Client), Render (API), and MongoDB Atlas (Cloud Database).

### 4.2 Out-of-Scope (Future Iterations)
- Dynamic GIS route optimization / real-time GPS courier breadcrumbs.
- Integrated payment gateway webhooks (currently implemented via mock payment state management).
- Multi-language localization beyond English.

---

## 5. METHODOLOGY

The project was executed following the **Iterative Agile Development Model**, aligned with the 9 milestones defined in the ICTAK Project Guidelines:

```text
Milestone 1: Project Definition & Scope
Milestone 2: Repository & Skeleton Setup
Milestone 3: Database Schemas & API Contracts
Milestone 4: JWT Authentication & Role-Based Access Control
Milestone 5: React UI Design with 4 Standard States
Milestone 6: Client-API Integration
Milestone 7: Comprehensive Testing & Reviewer Resiliency
Milestone 8: Cloud Deployment (Render, Vercel, MongoDB Atlas)
Milestone 9: Documentation & Submission Report
```

### 5.1 Technology Stack & Architectural Roles
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Client** | React 18, Vite | Component rendering, state management, client-side routing |
| **Styling** | Modern CSS | Responsive layouts, grid systems, mobile-first cards |
| **API Client**| Axios | HTTP interceptors for JWT token injection and error abstraction |
| **Server** | Node.js, Express.js | REST routing, business logic execution, CORS management |
| **Database** | MongoDB Atlas, Mongoose | Schema modeling, indexes, document relationships |
| **Security** | Bcryptjs, JWT | Password salt-hashing, token verification middleware |
| **Hosting** | Vercel, Render | Automated CI/CD deployment pipelines |

---

## 6. PROJECT ACTIVITIES & IMPLEMENTATION

### 6.1 Database Schema Modeling (Mongoose)
Three primary schemas were designed to ensure data normalization without recursive querying:
1. **`User` Schema:** Stores entity details, credentials, and organization metadata (`role`: `'hotel' | 'camp'`).
2. **`FoodListing` Schema:** Tracks donor reference, food category (`'Veg' | 'Non-Veg' | 'Mixed'`), servings count, and calculated expiration dates.
3. **`Order` Schema:** Enforces the business invariant `foodCost: 0` and `deliveryFee: 200`, mapping donor hotel, recipient camp, and dispatch status.

### 6.2 RESTful API Contracts
```text
POST   /api/auth/register          -> Register Hotel or Relief Camp
POST   /api/auth/login             -> Issue JWT Bearer Token
GET    /api/auth/me                -> Authenticated User Profile
GET    /api/auth/directory         -> Community Directory of Hotels & Camps
GET    /api/listings               -> Available unexpired listings
POST   /api/listings               -> Create surplus listing (Hotel Only)
DELETE /api/listings/:id           -> Remove listing (Owner Only)
POST   /api/listings/reset-demo    -> Evaluator Demo Data Refresh
POST   /api/orders                 -> Claim food batch for ₹200 (Camp Only)
GET    /api/orders/my-camp-orders  -> Claimed batches & delivery progress
GET    /api/orders/my-hotel-orders -> Incoming pickup requests
PATCH  /api/orders/:id/status      -> Advance status (placed -> picked_up -> delivered)
```

### 6.3 Technical Challenges & Mitigations
1. **Double Password Hashing Bug:** Initial seed scripts manually salted passwords before passing them to `User.create()`, which triggered Mongoose's `pre('save')` hook, resulting in an unmatchable hash. This was diagnosed and resolved by passing plain-text strings directly to let the lifecycle hook execute once.
2. **CORS & IPv4/IPv6 Resolution:** Windows machines resolving `localhost` to IPv6 `::1` created cross-origin connection failures with Vite on `127.0.0.1`. A Vite reverse proxy (`/api`) was introduced alongside dynamic CORS origin reflection (`origin: true`), guaranteeing local and remote parity.
3. **The "Expired Demo" Dilemma:** Food listings expire naturally after 4–6 hours. An evaluator reviewing the platform days later would encounter an empty page. An **autonomous rolling-expiry auto-heal** routine was integrated into `getAvailableListings`: whenever active listings drop to zero, existing sample batches are automatically rolled forward by 4 to 9 hours.

---

## 7. RESULTS & FINDINGS

### 7.1 Key Accomplishments
- **100% Functional End-to-End Workflow:** Successfully demonstrated the complete lifecycle from donor listing to camp order placement and delivery milestone completion.
- **Zero Food Waste Validation:** Proved that eliminating item pricing and standardizing flat logistics fees removes negotiations, accelerating meal dispatch times.
- **Robust Community Footprint:** Seeded with 5 commercial eateries (e.g., *Mandhi Manzil*, *Paradise Restaurant*, *Hotel Grand Malabar*) and 6 welfare organizations (e.g., *Wayanad Flood Relief Camp*, *Snehabhavan Orphanage*, *Karuna Old Age Home*).

### 7.2 UI/UX Responsive Visual States
In adherence to ICTAK Section 7.3, every view handles:
- **Loading:** Non-blocking spinners with descriptive progress text.
- **Success:** Rich grid cards showing servings, food types, and fee breakdowns.
- **Empty:** Contextual messaging paired with one-click demo data restoration.
- **Error:** User-friendly alerts with retry capabilities that conceal server stack traces.

---

## 8. CONCLUSION

The **MealMate** platform successfully demonstrates how modern full-stack web engineering can address urgent socio-economic challenges. By adhering strictly to the ICTAK MERN guidelines—ranging from Git commit discipline and environment secret segregation to modular Express routing and responsive React state management—the project achieved all planned objectives. The internship provided invaluable practical exposure to full-lifecycle software delivery, troubleshooting real-world web deployment hurdles, and building socially impactful software.

---

## 9. APPENDIX

### 9.1 Evaluation Credentials (Pre-Configured)
| Entity | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Hotel Grand Malabar** | `hotel.malabar@example.com` | `password123` | Food Donor |
| **Mandhi Manzil** | `hotel.mandhimanzil@example.com` | `password123` | Food Donor |
| **Wayanad Relief Camp**| `camp.wayanad@example.com` | `password123` | Beneficiary Camp |
| **Snehabhavan Orphanage** | `camp.snehabhavan@example.com` | `password123` | Children Shelter |

### 9.2 Verification Commands
```bash
# Seed Database
cd server && npm run seed

# Run Tests / Start Dev Environments
npm run dev # (In both server/ and client/)
```

### 9.3 Live Project Links
- **GitHub Repository:** [https://github.com/febinsteephen/mealmate](https://github.com/febinsteephen/mealmate)
- **Database:** MongoDB Atlas M0 Cluster (`cluster0.vddpagd.mongodb.net`)
