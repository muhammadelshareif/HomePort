const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,Booking,Review,SpotImage,ReviewImage } = require('../../db/models');
const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async(req, res) => {
   const reviews = await Review.findAll({
       where: {
           userId: req.user.id
       },
       include: [
           {
               model: User,
               attributes: ['id', 'firstName', 'lastName']
           },
           {
               model: Spot,
               attributes: ['id', 'ownerId', 'address', 'city', 'state', 
                          'country', 'lat', 'lng', 'name', 'price']
           },
           {
               model: ReviewImage,
               attributes: ['id', 'url']
           }
       ]
   });

   res.json({ Reviews: reviews });
});

const validateReview = [
   check('review')
       .exists({ checkFalsy: true })
       .withMessage('Review text is required'),
   check('stars')
       .exists({ checkFalsy: true })
       .isInt({ min: 1, max: 5 })
       .withMessage('Stars must be an integer from 1 to 5'),
   handleValidationErrors
];


//Update and return an existing review.
router.put('/:reviewId', requireAuth, validateReview, async(req, res) => {
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


module.exports = router;