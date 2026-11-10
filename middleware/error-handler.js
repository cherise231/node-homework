// export an error-handling middleware function with four parameters: err, req, res, next

function errorHandler(err, req, res, next) {

    if (err.code === "ECONNREFUSED" && err.port === 5432) { // the postgresql port
    console.log("The database connection was refused.  Is your database service running?");
  }
  //return status 500
  res.status(500).json({
    // return a JSON response
    message: "Something went wrong.",
  });
}

module.exports = errorHandler;
