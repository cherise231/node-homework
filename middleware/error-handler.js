// export an error-handling middleware function with four parameters: err, req, res, next

function errorHandler(err, req, res, next) {
  //return status 500
  res.status(500).json({
    // return a JSON response
    message: "Something went wrong.",
  });
}

module.exports = errorHandler;
