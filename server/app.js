require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var { errorHandler } = require("./middleware/errorHandler.js");

// Initialize Express app
var app = express();

// Set up rate limiter: maximum of twenty requests per minute
var RateLimit = require("express-rate-limit");
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

// Apply rate limiter to all requests
app.use(limiter);

//helmet

// Allows frontend application to make HTTP requests to Express application
app.use(cors());

// Connect to MongoDB
mongoose.set("strictQuery", false);
var mongoDB = process.env.DB_STRING;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Cloudinary config
require("./config/cloudinary");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/api", require("./routes/index"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/works", require("./routes/works"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/images", require("./routes/images"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/cld", require("./routes/cld"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/media", require("./routes/media"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
