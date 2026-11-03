module.exports = (req, res, next) => {
  //Checks whether a user is logged in
  if (!global.user_id) {
    //Rejects the request if nobody is logged in
    //Return status 401 if no  user is logged in.
    //Return JSON w/ a message unauthorized
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  //Allows the request to continue if the user is logged in
  next();
};
