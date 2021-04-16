const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');

exports.getUsername = asyncHandler(async (req, res, next) => {
	const config = {
		mode: 'cors',
		credentials: 'include',
		headers: {
			authorization: `Bearer ${process.env.TWITTER_BEARER}`,
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost',
			'Access-Control-Allow-Credentials': true,
			Accept: 'application/json'
		}
	};
	try {
		const user_id = await axios.get(
			`https://api.twitter.com/2/users/by/username/${req.params.username}`,
			config
		);
		console.log(user_id);
		// if (res.status === '400') {
		// 	res.status(400).json({ msg: 'There was an error' });
		// 	console.log('400 Error');
		// }

		if (user_id.data) {
			res
				.status(200)
				.json({ msg: 'Successful getUsername Route hit', data: user_id.data });
		}
	} catch (err) {
		res.status(400).json({ error: err });
		console.log(err.errors);
	}

	// res.status(200).json({ msg: `${req.params.username} param captured` });
});

exports.getTimeline = asyncHandler(async (req, res, next) => {
	const config = {
		mode: 'cors',
		credentials: 'include',
		headers: {
			authorization: `Bearer ${process.env.TWITTER_BEARER}`,
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost',
			'Access-Control-Allow-Credentials': true,
			Accept: 'application/json'
		}
	};

	try {
		const timeline = await axios.get(
			`https://api.twitter.com/2/users/${req.params.id}/tweets?max_results=${req.params.results}&tweet.fields=created_at`,
			config
		);
		if (!timeline) {
			res.status(400).json({ msg: 'There was an error' });
			console.log('400 Error');
		}
		if (timeline) {
			console.log(timeline);
			res
				.status(200)
				.json({ msg: 'Successful Timeline Route hit', data: timeline.data });
		}
	} catch (err) {
		res.status(500).json({ error: err });
		console.log(err);
	}
});

exports.getTicker = asyncHandler(async (req, res, next) => {
	try {
		const ticker = await axios.get(
			`https://api.polygon.io/v2/aggs/ticker/${req.params.ticker}/range/${req.params.multiplier}/${req.params.timespan}/${req.params.from}/${req.params.to}?unadjusted=true&sort=asc&limit=120&apiKey=_${process.env.POLYGON_KEY}`
		);

		if (ticker) {
			console.log(ticker);
			res
				.status(200)
				.json({ msg: 'Successful Ticker Route hit', data: ticker.data });
		}
	} catch (err) {
		console.log(err);
	}
});
