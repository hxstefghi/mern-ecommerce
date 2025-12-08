# MERN E-Commerce MVP

A full-stack e-commerce application built with MongoDB, Express, React, Node.js, and Tailwind CSS.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🛍️ Product listing and detail pages
- 🛒 Shopping cart functionality
- 👤 User authentication (register/login)
- 💳 Persistent cart (localStorage)
- 📱 Mobile-friendly design
- 🎯 Clean and intuitive user experience

## Tech Stack

### Frontend
- React 19
- React Router DOM v7
- Tailwind CSS v4
- Axios
- Vite

### Backend
- Node.js
- Express v5
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mern-ecommerce
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend folder:
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

5. Seed the database with sample products:
```bash
cd backend
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

7. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── product.controller.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── product.routes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── app.js
│   ├── server.js
│   └── seed.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── lib/
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── Cart.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── ProductDetail.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

## Features Explained

### Context API
- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart state with localStorage persistence

### Components
- **Hero**: Eye-catching landing section with CTAs
- **Navbar**: Responsive navigation with cart badge
- **ProductCard**: Product display with add to cart
- **Footer**: Site footer with links

### Pages
- **Home**: Landing page with hero and product grid
- **ProductDetail**: Individual product view
- **Cart**: Shopping cart with quantity controls
- **Login/Register**: Authentication pages

## Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Order management
- [ ] Product search and filters
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Order tracking
- [ ] Email notifications

## License

MIT

## Author

Your Name
