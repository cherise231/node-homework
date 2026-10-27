// export a middleware function

function notFound(req, res, next) {
  //return status 404
  res.status(404).json({
    //return JSON response
    message: "No route found.",
  });
}

module.exports = notFound;
