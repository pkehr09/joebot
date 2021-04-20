const router = require('express').Router();
const { getToken } = require('../controllers/auth');

router.post('/reddit', getToken);

module.exports = router;
