const express = require("express");
const timeController = require("../controllers/timeController");

const router = express.Router();

router.get("/time", timeController.getTime);
router.post("/echo", timeController.echoBody);

module.exports = router;

----------------

const express = require("express");
const dogsRouter = require("./routes/dogs");

const userRoutes = require("../routes/userRoutes");

const notFound = require("../middleware/not-found");

const errorHandler = require("../middleware/error-handler");

const app = express();

// Assignment 3b and 3c ask you to add middleware in this file.

// initialize global.user_id = null
global.user_id = null;

//initialize global.users = [];
global.users = [];

//initialize global.tasks = [];
global.tasks = [];

//use express.json() before routes
app.use(express.json());

app.use("/", dogsRouter); // Do not remove this line

//mount the user router at /api/users
app.use("/api/users", userRoutes);

//add a not-found middleware after your routes
app.use(notFound);

//add a error-handler middleware at the end
app.use(errorHandler);

let server;

if (require.main === module) {
  server = app.listen(3000, () => {
    console.log("Dog rescue app is listening on port 3000...");
  });
}

//export { app, server}
module.exports = { app, server };
