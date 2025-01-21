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

// CORS Middleware
const corsOptions = {
  origin: isProduction
    ? "https://mod5-frontend-project.onrender.com" // Replace with your deployed frontend URL
    : "http://localhost:3000", // Localhost for development
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));

// Security Middleware (only for production)
if (!isProduction) {
  // Enable cors only in development
  app.use(cors());
}

// Helmet to secure your app with HTTP headers
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction, // Cookie is only sent over HTTPS in production
      sameSite: isProduction && "Lax", // Only send the cookie in a first-party context
      httpOnly: true, // Ensure cookies are not accessible via JavaScript
    },
  })
);

app.use(routes); // Use routes from the routes folder

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
