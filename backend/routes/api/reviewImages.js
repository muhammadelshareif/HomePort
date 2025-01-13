const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,Booking,Review,SpotImage,ReviewImage } = require('../../db/models');
const router = express.Router();

//delete a review image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;

    const reviewImageFromId = await ReviewImage.findOne({
        where: {
            id: req.params.imageId
        },
    });

    if (!reviewImageFromId) {
        res.status(404);
        return res.json({
            "message": "Review Image couldn't be found"
          })
    }

    const review = await Review.findOne({
        where: {
            id: reviewImageFromId.reviewId
        }
    })

    if (review.userId === user.id) {
        await reviewImageFromId.destroy();
        res.status(200);
        return res.json({ "message": "Successfully deleted" })
    } else {
        return res.json({ message: 'You are not authorized to delete this image' })
    }
})



module.exports = router;