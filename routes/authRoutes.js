const router = require('express').Router();
const express = require('express');
const { getUsername, getTimeline, getTicker } = require('../controllers/auth');

//router.get('/twitter/:username', getUsername);
router.get('/twitter/:username', getUsername);
router.get('/twitter/:id/timeline/:results', getTimeline);
router.get(
	'/polygon/:ticker/:multiplier/:timespan/:multiplier/:from/:to',
	getTicker
);

module.exports = router;
