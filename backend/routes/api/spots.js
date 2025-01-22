const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
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
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

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

    const requiredFields = [
      "name",
      "address",
      "city",
      "state",
      "country",
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

    return res.status(201).json(newSpot);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
