function register(req, res) {
  //Read name, email, and password from req.body
  const { name, email, password } = req.body;
  // create a new user object
  const newUser = {
    name: name,
    email: email,
    password: password,
  };
  // add that user to global.users
  global.users.push(newUser);

  //set global.user_id to that user
  global.user_id = newUser;

  // return status 201
  res.status(201).json({
    //return JSON with the user's name and email
    name: newUser.name,
    email: newUser.email,
  });
}

function logon(req, res) {
  // logon an existing user
  //read email and password from req.body
  const { email, password } = req.body;
  //find the matching user in global.users
  const user = global.users.find(
    (u) => u.email === email && u.password === password,
  );
  if (user) {
    //If the email and password match, set global.user id to that user
    global.user_id = user;
    //return status 200
    res.status(200).json({
      //return JSON wit the user's name and email
      name: user.name,
      email: user.email,
    });
  } else {
    //If the email or passwords do not match, return status 401
    res.status(401).json({
      message: "Invalid email or password.",
    });
  }
}

function logoff(req, res) {
  // logoff the current user
  //set global.user_id to null
  global.user_id = null;
  //return status 200
  res.status(200).json({
    message: "User logged off successfully.",
  });
}

module.exports = {
  register,
  logon,
  logoff,
};
