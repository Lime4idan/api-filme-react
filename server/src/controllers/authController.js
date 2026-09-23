const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const publicUser = require("../utils/publicUser");

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

const issueSession = (res, user) => {
  const token = jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    { subject: String(user.id), expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
  res.cookie("moviehub_token", token, cookieOptions());
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "EMAIL_IN_USE", "This email is already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  issueSession(res, user);
  res.status(201).json({ user: publicUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!valid) throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  if (!user.isActive) throw new AppError(403, "USER_INACTIVE", "This account is disabled");

  issueSession(res, user);
  res.json({ user: publicUser(user) });
};

const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

const logout = async (_req, res) => {
  const { maxAge: _maxAge, ...clearOptions } = cookieOptions();
  res.clearCookie("moviehub_token", clearOptions);
  res.status(204).send();
};

module.exports = { register, login, me, logout };
