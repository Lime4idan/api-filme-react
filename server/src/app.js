const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./docs/openapi");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true);
    return callback(new AppError(403, "CORS_FORBIDDEN", "Origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: process.env.NODE_ENV === "test" ? 10000 : 300, standardHeaders: "draft-7", legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: process.env.NODE_ENV === "test" ? 10000 : 20, standardHeaders: "draft-7", legacyHeaders: false });
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/lists", require("./routes/listRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/movies", require("./routes/movieSocialRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/recommendations", require("./routes/recommendationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "moviehub-api" }));
app.get("/api/docs.json", (_req, res) => res.json(openapi));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: "MovieHub API" }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
