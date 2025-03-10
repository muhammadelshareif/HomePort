const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  Booking,
  Review,
  SpotImage,
  ReviewImage,
} = require("../../db/models");
const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.post("/", requireAuth, validateReview, async (req, res) => {
  const userId = req.user.id;
  const { review, stars, spotId } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    console.log("Spot not found");
    res.status(404);
    return res.json({ message: "Spot couldn't be found" });
  }

  const existingReview = await Review.findOne({
    where: { spotId, userId },
  });
  if (existingReview) {
    res.status(403);
    return res.json({ message: "User already has a review for this spot" });
  }
  try {
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
  // const newReview = await Review.create({
  //   userId,
  //   spotId,
  //   review,
  //   stars,
  // });

  // res.status(201).json(newReview);
});

router.get("/current", requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.json({ Reviews: reviews });
});

router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;

  const reviewToUpdate = await Review.findByPk(reviewId);

  if (!reviewToUpdate) {
    res.status(404);
    return res.json({ message: "Review couldn't be found" });
  }

  if (reviewToUpdate.userId !== req.user.id) {
    res.status(403);
    return res.json({ message: "Forbidden" });
  }

  reviewToUpdate.review = review;
  reviewToUpdate.stars = stars;
  await reviewToUpdate.save();

  res.json(reviewToUpdate);
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  const reviewToDelete = await Review.findByPk(reviewId);

  if (!reviewToDelete) {
    res.status(404);
    return res.json({ message: "Review couldn't be found" });
  }

  if (reviewToDelete.userId !== req.user.id) {
    res.status(403);
    return res.json({ message: "Forbidden" });
  }

  await reviewToDelete.destroy();

  res.json({ message: "Review deleted" });
});
module.exports = router;
