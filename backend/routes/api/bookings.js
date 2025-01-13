const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User,Spot,Booking,Review,SpotImage,ReviewImage } = require('../../db/models');
const { Op } = require("sequelize");















module.exports = router;