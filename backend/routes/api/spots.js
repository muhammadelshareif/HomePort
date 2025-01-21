const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth"); // If authentication is required
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("DEBUG: Accessing GET /api/spots route");
    console.log(
      "Authenticated User:",
      req.user ? req.user.id : "Not authenticated"
    );

    const spots = await Spot.findAll({
      include: [SpotImage, Review],
    });

    console.log("Raw Spots Count:", spots.length);
    console.log(
      "Raw Spots Details:",
      JSON.stringify(
        spots.map((spot) => {
          const plainSpot = spot.get({ plain: true });
          return {
            id: plainSpot.id,
            name: plainSpot.name,
            reviewCount: plainSpot.Reviews.length,
            imageCount: plainSpot.SpotImages.length,
          };
        }),
        null,
        2
      )
    );

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

    console.log("Formatted Spots Count:", formattedSpots.length);
    console.log("Formatted Spots:", JSON.stringify(formattedSpots, null, 2));

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    console.error("Error in GET /api/spots:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
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

// Create a new Spot
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      price,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "description",
      "price",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors: missingFields.reduce((acc, field) => {
          acc[field] = `${field} is required`;
          return acc;
        }, {}),
      });
    }

    // Create the spot with the current user as the owner
    const newSpot = await Spot.create({
      ownerId: req.user.id,
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      price,
    });

    // Return the created spot
    return res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating spot:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
module.exports = router;
