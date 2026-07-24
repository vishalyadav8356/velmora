import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {config} from "./config/config.js";
import cors from "cors";

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

// auth routes
app.use("/api/auth", authRouter);

// product routes
app.use("/api/products", productRouter);

// default route
app.get("/", (req, res)=>{
    res.send("Welcome to the Velmora API");
})

export default app;