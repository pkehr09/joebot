const errorHandler = require('./middleware/error');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const authRoutes = require('./routes/authRoutes');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Sanitize Express
app.use(expressSanitizer());

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
		'Access-Control-Request-Headers',
		'User-Agent',
		'Accept',
		'Accept-Encoding'
	],
	credentials: true,
	enablePreflight: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use(errorHandler);

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
