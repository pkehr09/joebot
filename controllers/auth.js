const asyncHandler = require('../middleware/async');
const axios = require('axios');
const dotenv = require('dotenv');
const qs = require('qs');

///// GET ACCESS TOKEN /////

exports.getToken = asyncHandler(async (req, res, next) => {
	const REDDIT_BASE64 = process.env.base64;
	const data = qs.stringify({
		grant_type: 'client_credentials'
	});

	const config = {
		credentials: 'include',
		headers: {
			Authorization: `Basic ${REDDIT_BASE64}`,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': 'http://localhost',
			'Access-Control-Allow-Credentials': true,
			Accept: '*/*',
			'User-Agent': 'chrome:joebotgoalgetter:v1 (by /u/oopsie_dum_didley)'
		}
	};

	try {
		const token = await axios.post(
			`https://www.reddit.com/api/v1/access_token`,
			data,
			config
		);
		if (token) {
			if (token) {
				res.status(200).json({
					msg: 'Successfully fetched access token.',
					token: token.data.access_token
				});
			}
		}
	} catch (err) {
		res.status(400).json({ msg: 'There was an error', error: err });
		console.log(err);
	}
});
