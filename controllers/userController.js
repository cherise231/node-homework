const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

const { userSchema } = require("../validation/userSchema");
// const pool = require("../db/pg-pool");
const prisma = require("../db/prisma");

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

async function register(req, res, next) {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) return res.status(400).json({ message: error.message });

  value.hashedPassword = await hashPassword(value.password);
  delete value.password; // Remove the plain password from the object

  let user = null;

  try {
    user = await prisma.user.create({
      data: {
        name: value.name,
        email: value.email,
        hashedPassword: value.hashedPassword,
      },
      select: { name: true, email: true, id: true },
    });
  } catch (e) {
    if (e.name === "PrismaClientKnownRequestError" && e.code === "P2002") {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    return next(e);
  }

  //set global.user_id to that user
  global.user_id = user.id;

  // return status 201
  return res.status(201).json({
    //return JSON with the user's name and email
    name: user.name,
    email: user.email,
  });
}

async function logon(req, res) {
  // logon an existing user
  //read email and password from req.body
  let { email, password } = req.body;

  // Joi validation always converts the email to lower case
  email = email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const goodCredentials = await comparePassword(password, user.hashedPassword);

  if (!goodCredentials) {
    //If the email or passwords do not match, return status 401
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }
  //If the email and password match, set global.user id to that user
  global.user_id = user.id;

  //return status 200
  return res.status(200).json({
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
