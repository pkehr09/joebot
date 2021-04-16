//const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/error');
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const path = require('path');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
//connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File uploading
//app.use(fileupload());

// Sanitize Express
app.use(expressSanitizer());

// Sanitize Mongo Data
//app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross-site scripting attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// set up cors to allow us to accept requests from our client

const corsOptions = {
	origin: 'http://localhost:3000',
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'Access-Control-Allow-Methods',
		'Access-Control-Request-Headers'
	],
	credentials: true,
	enablePreflight: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// app.use(
// 	cors({
// 		origin: ['http://localhost'],
// 		allowedHeaders: [
// 			'Content-Type',
// 			'Authorization',
// 			'Access-Control-Allow-Methods',
// 			'Access-Control-Request-Headers'
// 		],
// 		credentials: true,
// 		enablePreflight: true
// 	})
// );

// Set static folder
//app.use(express.static(path.join(__dirname, 'public')));

// app.use(
// 	cookieSession({
// 		name: 'session',
// 		keys: config.get('COOKIE_KEY'),
// 		maxAge: 24 * 60 * 60 * 1000
// 	})
// );

// parse cookies

app.use(cookieParser());

// initialize passport

// app.use(passport.initialize());
// app.use(passport.session());

// set up routes

/*app.use('/api/v1/briefs', briefRoutes);
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/clients', clientRoutes);
//app.use('/auth', authRoutes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', userRoutes);*/

app.use(errorHandler);

//app.use('/auth', authRoutes);

/*const authCheck = (req, res, next) => {
	if (!req.user) {
		res.status(401).json({
			authenticated: false,
			message: 'user has not been authenticated',
			name: 'Pete'
		});
		console.log('You hit the home route but failed the auth check');
	} else {
		next();
	}
};*/

// if already logged in, send the profile response.
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page

/*app.get('/', authCheck, (req, res) => {
	res.status(200).json({
		authenticated: true,
		message: 'user successfully authenticated',
		user: req.user,
		cookies: req.cookies
	});
	console.log('You hit the home route');
});*/

// connect react to nodejs express server
const port = process.env.PORT || 5000;

const server = app.listen(
	port,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
			.bold
	)
);

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	server.close(() => process.exit(1));
});
