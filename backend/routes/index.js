const express = require("express");
const router = express.Router();
const spotsRouter = require("./api/spots"); // Ensure this points to the correct file

// Use /api/spots route for all spot-related endpoints
router.use("/api/spots", spotsRouter);

// Static routes for serving frontend assets in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");

  // Serve the React frontend's index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); // Set CSRF token cookie
    res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });

  // Serve the static assets from the React frontend's build folder
  router.use(express.static(path.resolve("../../frontend/dist"))); // Correct the path to your build folder

  // Redirect all other routes (except those starting with /api) to the index.html of the React app
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); // Set CSRF token cookie
    res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });
}

// Handle CSRF token restoration in development
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken(); // Get the CSRF token
    res.cookie("XSRF-TOKEN", csrfToken); // Set CSRF token cookie
    res.status(200).json({
      "XSRF-Token": csrfToken, // Return the CSRF token in the response
    });
  });
}

module.exports = router; // Export the routes to be used in app.js
