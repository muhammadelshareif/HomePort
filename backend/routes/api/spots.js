const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth"); // If authentication is required
const router = express.Router();

// Get all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: [SpotImage, Review],
  });

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
      name: data.name,
      city: data.city,
      state: data.state,
      price: data.price,
      avgRating,
      previewImage,
    };
  });

  res.status(200).json({ Spots: formattedSpots });
});

// Get Spot by ID
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
    name: data.name,
    city: data.city,
    state: data.state,
    price: data.price,
    avgRating,
    SpotImages: data.SpotImages,
    Reviews: data.Reviews,
  };

  res.status(200).json(formattedSpot);
});

// Other routes for creating, updating, and deleting spots...
// Similar code to your existing routes
module.exports = router;
