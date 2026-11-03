const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

const { userSchema } = require("../validation/userSchema");

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(inputPassword, storedHash) {
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scrypt(inputPassword, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

async function register(req, res) {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) return res.status(400).json({ message: error.message });

  const hashedPassword = await hashPassword(value.password);

  // create a new user object
  const newUser = {
    email: value.email,
    name: value.name,
    hashedPassword,
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

async function logon(req, res) {
  // logon an existing user
  //read email and password from req.body
  const { email, password } = req.body;

  //find the matching user in global.users
  const user = global.users.find((u) => u.email === email);
  if (!user) {
    //If the email or passwords do not match, return status 401
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const goodCredentials = user && await comparePassword(password, user.hashedPassword);

  if (!goodCredentials) {
    //If the email or passwords do not match, return status 401
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }
  //If the email and password match, set global.user id to that user
  global.user_id = user;

  //return status 200
  res.status(200).json({
    //return JSON wit the user's name and email
    name: user.name,
    email: user.email,
  });
}

function logoff(req, res) {
  // logoff the current user
  //set global.user_id to null
  global.user_id = null;
  //return status 200
  return res.status(200).json({
    message: "User logged off successfully.",
  });
}

module.exports = {
  register,
  logon,
  logoff,
};
