const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const isProduction = environment === "production";

const routes = require("./routes");

const app = express();

// Logging middleware
app.use(morgan("dev"));

// Body parser middleware
app.use(cookieParser());
app.use(express.json());

// CORS Middleware - Ensure proper access for React frontend
const corsOptions = {
  origin: isProduction
    ? [
        "https://mod5-frontend-project.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
      ]
    : ["http://localhost:3000", "http://localhost:5173"], // Include localhost 5173 for dev
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"], // Ensure lowercase x-csrf-token
  exposedHeaders: ["XSRF-Token"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Helmet to secure your app with HTTP headers
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the CSRF token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction, // Use secure cookies in production
      sameSite: isProduction ? "Lax" : "Strict",
      httpOnly: true, // Prevent client-side JavaScript from accessing this cookie
    },
  })
);

// Route to restore CSRF token
app.get("/api/csrf/restore", (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // Allow frontend to access this cookie
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? "Lax" : "Strict",
  });
  res.status(200).json({});
});

// Debugging middleware to check CSRF tokens
app.use((req, res, next) => {
  console.log("CSRF Token in Request Header:", req.headers["x-csrf-token"]);
  console.log("CSRF Token from req.csrfToken():", req.csrfToken());
  next();
});

// Routes
app.use(routes);

const path = require("path");

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve frontend's index.html for all unmatched routes
app.use("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

// Final error handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
