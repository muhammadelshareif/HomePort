const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const isProduction = environment === "production";

const routes = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: isProduction
    ? [
        "https://mod5-frontend-project.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
      ]
    : ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  exposedHeaders: ["XSRF-Token"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "Lax" : "Strict",
      httpOnly: true,
    },
  })
);

app.get("/api/csrf/restore", (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "Lax" : "Strict",
  });
  res.status(200).json({});
});

app.use((req, res, next) => {
  console.log("CSRF Token in Request Header:", req.headers["x-csrf-token"]);
  console.log("CSRF Token from req.csrfToken():", req.csrfToken());
  next();
});

app.use(
  express.static(path.join(__dirname, "../frontend/dist"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.use(routes);

app.get("*", (req, res) => {
  if (req.path.endsWith(".js")) {
    res.type("application/javascript");
  }
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
