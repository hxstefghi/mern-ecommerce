import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use('/api', (req, res, next) => {
	if (req.method === 'OPTIONS') {
		const origin = req.headers.origin || corsOptions.origin || '*';
		const reqHeaders = req.headers['access-control-request-headers'];
		res.setHeader('Access-Control-Allow-Origin', origin);
		res.setHeader('Access-Control-Allow-Methods', (corsOptions.methods || ['GET','POST','PUT','DELETE','OPTIONS']).join(','));
		res.setHeader('Access-Control-Allow-Headers', reqHeaders || (corsOptions.allowedHeaders || ['Content-Type','Authorization']).join(','));
		if (corsOptions.credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
		return res.sendStatus(corsOptions.optionsSuccessStatus || 204);
	}
	next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);

// Error handler
app.use(errorHandler);

export default app;
