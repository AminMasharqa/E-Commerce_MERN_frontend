# 🛒 E-Commerce Frontend

A modern, production-ready e-commerce web application built with React, TypeScript, and Material-UI. Features a complete shopping experience with user authentication, shopping cart management, order processing, and order history tracking.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Protected routes for authenticated users
- Persistent sessions with localStorage
- Secure user profile management with dropdown menu
- Automatic token-based user identification

### 🛍️ Shopping Experience
- Browse products with real-time inventory
- Add products to cart with instant feedback
- Dynamic cart badge showing item count
- Product cards with hover effects and modern UI

### 🛒 Cart Management
- Real-time cart synchronization with backend
- Quantity controls (increment/decrement)
- Individual item removal
- Cart total calculation
- Persistent cart across sessions
- Empty cart state with friendly messaging

### 💳 Checkout Process
- Multi-step checkout form
- Shipping information collection (name, address, city, postal code, phone)
- Payment method selection (Credit Card, PayPal, Cash on Delivery)
- Order summary with itemized breakdown
- Comprehensive form validation
- Success page with order confirmation

### 📦 Order History
- View all past orders (`My Orders` page)
- Order status tracking (Pending, Processing, Shipped, Delivered)
- Expandable order details with product information
- Order date and total amount display
- Real-time order updates from backend

### 🎨 Design & UX
- Consistent black and white theme throughout
- Responsive Material-UI components
- Smooth animations and transitions
- Loading states and error handling
- Professional gradient buttons
- Toast notifications for user feedback

---

## 🚀 Tech Stack

### Core Technologies
- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.2** - Build tool and dev server
- **React Router DOM 7.8.2** - Client-side routing

### UI Framework
- **Material-UI (MUI) 7.3.2** - Component library
- **@mui/icons-material 7.3.2** - Icon set
- **@emotion/react & @emotion/styled** - Styling solution

### State Management
- **React Context API** - Global state (Auth & Cart)
- **React Hooks** - Local component state

### Code Quality
- **ESLint 9.33.0** - Linting
- **TypeScript ESLint 8.39.1** - TypeScript linting rules

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Cart/
│   │   │   ├── CartItemCard.tsx      # Individual cart item component
│   │   │   ├── OrderSummary.tsx      # Cart totals and checkout button
│   │   │   └── QuantityControl.tsx   # +/- quantity controls
│   │   ├── Navbar.tsx                # App navigation with cart badge
│   │   ├── ProductCard.tsx           # Product display component
│   │   └── ProtectedRoute.tsx        # Route authentication wrapper
│   │
│   ├── context/
│   │   ├── Auth/
│   │   │   ├── AuthContext.ts        # Auth context definition
│   │   │   └── AuthProvider.tsx      # JWT & user state management
│   │   └── Cart/
│   │       ├── CartContext.tsx       # Cart context definition
│   │       └── CartProvider.tsx      # Cart state & API integration
│   │
│   ├── pages/
│   │   ├── HomePage.tsx              # Product listing page
│   │   ├── LoginPage.tsx             # User login
│   │   ├── RegisterPage.tsx          # User registration
│   │   ├── CartPage.tsx              # Shopping cart view
│   │   ├── CheckoutPage.tsx          # Checkout form & order placement
│   │   ├── OrderSuccessPage.tsx      # Order confirmation page
│   │   └── MyOrdersPage.tsx          # Order history
│   │
│   ├── types/
│   │   ├── Product.ts                # Product interface
│   │   └── cartItem.ts               # Cart item interface
│   │
│   ├── constants/
│   │   └── baseUrl.ts                # API base URL
│   │
│   ├── utils/
│   │   └── cartHelpers.ts            # Cart utility functions
│   │
│   ├── theme/
│   │   └── cartTheme.ts              # MUI theme customization
│   │
│   ├── App.tsx                       # Root component & routing
│   └── main.tsx                      # App entry point
│
├── public/                           # Static assets
├── dist/                             # Production build
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite configuration
└── eslint.config.js                  # ESLint rules
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update `src/constants/baseUrl.ts` if needed:
```typescript
export const BASE_URL = 'https://api.hubtech-e-commerce.com';
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:5173`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (TypeScript check + Vite build) |
| `npm run lint` | Run ESLint on all files |
| `npm run preview` | Preview production build locally |

---

## 🏗️ Architecture Overview

### Context Providers

#### AuthProvider
- Manages user authentication state (username, token, userId)
- Handles login/logout operations
- JWT token decoding and storage
- Persists auth state in localStorage
- Provides authentication context to all components

#### CartProvider
- Manages shopping cart state (items, total amount)
- Integrates with backend cart API
- Handles cart operations (add, update, remove, clear)
- Syncs cart with backend on every change
- Implements checkout functionality
- Loads user's cart on mount

### Routing Structure

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomePage | Public | Product listing |
| `/register` | RegisterPage | Public | User registration |
| `/login` | LoginPage | Public | User login |
| `/cart` | CartPage | Protected | Shopping cart |
| `/checkout` | CheckoutPage | Protected | Checkout form |
| `/order-success` | OrderSuccessPage | Protected | Order confirmation |
| `/my-orders` | MyOrdersPage | Protected | Order history |

### API Integration

All API calls use the base URL: `https://api.hubtech-e-commerce.com`

**Authentication:**
- Endpoints use JWT Bearer token authentication
- Token stored in localStorage and passed in `Authorization` header

**Cart Operations:**
- `GET /cart` - Fetch user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items` - Update item quantity
- `DELETE /cart/items/:productId` - Remove item
- `DELETE /cart` - Clear entire cart
- `POST /cart/checkout` - Place order

**User Operations:**
- `GET /user/my-orders` - Fetch user's order history

**Product Operations:**
- `GET /products` - Fetch all products

---

## 🎯 Key Features Implementation

### Protected Routes
Uses `ProtectedRoute` component to redirect unauthenticated users to login page.

### Real-time Cart Sync
All cart operations immediately sync with backend, ensuring data consistency across sessions and devices.

### Form Validation
Checkout page implements comprehensive validation for:
- Required fields
- Email format
- Phone number format (10 digits)
- Postal code format (5 digits)

### Error Handling
- Network error detection
- API error messages displayed to users
- Loading states for async operations
- Empty state handling (no products, no cart items, no orders)

### JWT Token Management
- Automatic token decoding to extract `userId`
- Token validation on protected routes
- Automatic logout on token expiration

### Responsive Design
- Mobile-first approach
- MUI Grid system for responsive layouts
- Breakpoint-aware components

---

## 🔐 Security Features

- JWT-based authentication
- Protected API routes with Bearer tokens
- Secure token storage in localStorage
- Automatic redirection for unauthorized access
- HTTPS API communication

---

## 🎨 Design System

### Color Palette
- **Primary:** `#111827` (Dark Navy)
- **Background:** `#FAFAFA` (Light Gray)
- **Text Primary:** `#000000` (Black)
- **Text Secondary:** `#FFFFFF` (White)
- **Accents:** Gradient from `#000000` to `#1a1a1a`

### Typography
- **Font:** System default (Roboto from MUI)
- **Headings:** Bold, varying sizes
- **Body:** Regular weight, 14-16px

### Components
- Consistent card elevation and shadows
- Hover effects on interactive elements
- Smooth transitions (0.2-0.3s)
- Border radius: 8-12px

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output directory: `dist/`

### Deployment Platforms
- **Vercel** (recommended for Vite projects)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

### Environment Variables
Configure backend API URL in `src/constants/baseUrl.ts` before deployment.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary.

---

## 👨‍💻 Development Notes

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured
- Type checking on build

### Code Quality
- ESLint enforces code standards
- TypeScript ensures type safety
- React best practices followed

### Performance Optimizations
- Vite's fast HMR for instant updates
- Code splitting with React.lazy (ready to implement)
- Optimized production builds

---

## 📞 Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Material-UI**
