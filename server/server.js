require("dotenv").config({ path: "../.env" });
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes & Config
const ConnectDb = require("./dbconfig");
const UserRoutes = require("./routes/UserRoutes");
const WorkerRoutes = require("./routes/WorkerRoutes");
const RequestRoutes = require("./routes/RequestRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const isAdmin = require("./middleware/isAdmin");

// Google OAuth Passport config
require("./Passport");

const app = express();

// ===================
// Middleware Setup
// ===================
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session setup (required for Passport sessions)
app.use(session({
  secret: process.env.JWT_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ===================
// MongoDB Connection
// ===================
ConnectDb();

// ===================
// API Routes
// ===================
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/workers", WorkerRoutes);
app.use("/api/v1/request", RequestRoutes);
app.use("/api/v1/admin", isAdmin, AdminRoutes);

// ===================
// Google OAuth Routes
// ===================
app.get("/api/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

app.get(
  "/api/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }
);

// ===================
// Test Route
// ===================
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ===================
// Route Logger (Optional Dev Tool)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// ===================
// Start Server
// ===================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
