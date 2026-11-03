const express = require("express");
const timeRouter = require("./routes/timeRoutes");

const userRoutes = require("./routes/userRoutes");

const notFound = require("./middleware/not-found");

const errorHandler = require("./middleware/error-handler");

const app = express();

const authMiddleware = require("./middleware/auth");

const taskRouter = require("./routes/taskRoutes");

// initialize global.user_id = null
global.user_id = null;

//initialize global.users = [];
global.users = [];

//initialize global.tasks = [];
global.tasks = [];

//Parse incoming JSON request bodies
app.use(express.json());

//Protect task routes
app.use("/api/tasks", authMiddleware, taskRouter);

app.use("/api", timeRouter);
//mount the user router at /api/users
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/testpost", (req, res) => {
  res.status(200).json({
    message: "POST route works",
  });
});

//add a not-found middleware after your routes
app.use(notFound);

//add a error-handler middleware at the end
app.use(errorHandler);

// app.all("/{*splat}", (req, res) => {
//   res.status(404).json({
//     message: `No route found for ${req.method} ${req.path}`,
//   });
// });

const port = process.env.PORT || 3000;

const server = app.listen(port, (error) => {
  if (error) {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error("Server startup error:", error);
    }
    process.exit(1);
    return;
  }

  console.log(`Server is listening on port ${port}...`);
});

let isShuttingDown = false;

async function shutdown(code = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("Shutting down gracefully...");

  try {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log("HTTP server closed.");
  } catch (err) {
    console.error("Error during shutdown:", err);
    code = 1;
  } finally {
    process.exit(code);
  }
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

module.exports = { app, server };
