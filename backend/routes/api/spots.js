const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// GET all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [SpotImage, Review],
    });

    console.log("Total spots found:", spots.length);

    const formattedSpots = spots.map((spot) => {
      const data = spot.get({ plain: true });
      const avgRating =
        data.Reviews.length > 0
          ? data.Reviews.reduce((sum, r) => sum + r.stars, 0) /
            data.Reviews.length
          : null;

      const previewImage =
        data.SpotImages.find((img) => img.preview)?.url || null;

      return {
        id: data.id,
        ownerId: data.ownerId,
        name: data.name,
        description: data.description,
        city: data.city,
        state: data.state,
        country: data.country,
        lat: data.lat,
        lng: data.lng,
        price: data.price,
        avgRating,
        previewImage,
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    console.error("Error in GET /spots:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET a single spot by ID
router.get("/:spotId", async (req, res) => {
  const spotId = parseInt(req.params.spotId, 10);

  if (isNaN(spotId)) {
    return res.status(400).json({
      title: "Validation error",
      message: "spotId must be a valid integer",
    });
  }

  const spot = await Spot.findByPk(spotId, {
    include: [SpotImage, Review],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const data = spot.get({ plain: true });
  const avgRating =
    data.Reviews.length > 0
      ? data.Reviews.reduce((sum, r) => sum + r.stars, 0) / data.Reviews.length
      : null;

  const formattedSpot = {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name,
    description: data.description,
    city: data.city,
    state: data.state,
    country: data.country,
    lat: data.lat,
    lng: data.lng,
    price: data.price,
    avgRating,
    SpotImages: data.SpotImages,
    Reviews: data.Reviews,
  };

  res.status(200).json(formattedSpot);
});

// POST create a new spot
router.post(
  "/",
  requireAuth,
  [
    check("name")
      .isLength({ max: 50 })
      .withMessage("Name must not exceed 50 characters"),
    check("address")
      .isLength({ max: 255 })
      .withMessage("Address must not exceed 255 characters"),
    check("city")
      .isLength({ max: 100 })
      .withMessage("City must not exceed 100 characters"),
    check("state")
      .isLength({ max: 100 })
      .withMessage("State must not exceed 100 characters"),
    check("country")
      .isLength({ max: 100 })
      .withMessage("Country must not exceed 100 characters"),
    check("description")
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    check("price").isNumeric().withMessage("Price must be a valid number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    const { name, address, city, state, country, description, price } =
      req.body;

    try {
      const newSpot = await Spot.create({
        ownerId: req.user.id,
        name,
        address,
        city,
        state,
        country,
        description,
        price,
      });

      res.status(201).json(newSpot);
    } catch (error) {
      console.error("Create spot error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);
// POST add image to a spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId, 10);
  const { url, preview } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Optional: Check if user owns the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview: preview || false,
    });

    res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    console.error("Error adding spot image:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
