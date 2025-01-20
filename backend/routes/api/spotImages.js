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

//delete a spot image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    // Fetch the spot image by ID
    const spotImageFromId = await SpotImage.findOne({
      where: {
        id: req.params.imageId,
      },
    });

    if (!spotImageFromId) {
      return res.status(404).json({
        message: "Spot Image couldn't be found",
      });
    }

    // Fetch the spot associated with the image
    const spot = await Spot.findOne({
      where: {
        id: spotImageFromId.spotId,
      },
    });

    // Check if the user is the owner of the spot
    if (spot.ownerId === user.id) {
      // Delete the image if the user is the owner
      await spotImageFromId.destroy();
      return res.status(200).json({ message: "Successfully deleted" });
    } else {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
  } catch (error) {
    console.error("Error deleting spot image:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
