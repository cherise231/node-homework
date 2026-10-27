const express = require("express");
const dogsRouter = require("./routes/dogs");
const path = require("path");

const app = express();

// import crypto
const { randomUUID } = require("crypto");

// Assignment 3b and 3c ask you to add middleware in this file.

//Add express.json() so POST /adopt can read req.body

//middleware to request Id
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

//middleware logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]: ${req.method} ${req.path} (${req.requestId})`);
  next();
});

//middleware security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

//JSON parsing middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//static file middleware
app.use("/", dogsRouter); // Do not remove this line

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

//error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId,
  });
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Dog rescue app is listening on port 3000...");
  });
}

module.exports = app;
