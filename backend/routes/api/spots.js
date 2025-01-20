const express = require("express");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  Booking,
  Review,
  SpotImage,
  ReviewImage,
} = require("../../db/models");
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
      ownerId: data.ownerId,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      name: data.name,
      description: data.description,
      price: data.price,
      avgRating,
      previewImage,
    };
  });

  res.status(200).json({ Spots: formattedSpots });
});

// Get Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: { ownerId: user.id },
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
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      name: data.name,
      description: data.description,
      price: data.price,
      avgRating,
      previewImage,
    };
  });

  res.status(200).json({ Spots: formattedSpots });
});

// Get details of a Spot by spotId
router.get("/:spotId", async (req, res) => {
  const spotId = parseInt(req.params.spotId, 10); // Parse spotId as an integer

  if (isNaN(spotId)) {
    return res.status(400).json({
      title: "Validation error",
      message: "spotId must be a valid integer",
      errors: { id: "spotId must be a valid integer" },
    });
  }

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        include: {
          model: User,
          attributes: ["firstName"],
        },
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const data = spot.get({ plain: true });
  const avgRating =
    data.Reviews.length > 0
      ? data.Reviews.reduce((sum, r) => sum + r.stars, 0) / data.Reviews.length
      : null;
  const numReviews = data.Reviews.length;

  const formattedSpot = {
    id: data.id,
    ownerId: data.ownerId,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    name: data.name,
    description: data.description,
    price: data.price,
    avgRating,
    numReviews,
    SpotImages: data.SpotImages,
    Owner: data.Owner,
  };

  res.status(200).json(formattedSpot);
});

// Create a new Spot
router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (lng < -180 || lng > 180)
    errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price <= 0) errors.price = "Price per day is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(spot);
});

// Add an Image to a Spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const spotImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  res.status(200).json({
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview,
  });
});

// Edit a Spot
router.put("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (lng < -180 || lng > 180)
    errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price <= 0) errors.price = "Price per day is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(spot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await spot.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
