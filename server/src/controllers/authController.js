import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const signup = async (req, res) => {
  const { name, email, password, systemRole } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name,
    email,
    password,
    systemRole: systemRole === "admin" ? "admin" : "member"
  });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      systemRole: user.systemRole
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      systemRole: user.systemRole
    }
  });
};

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      systemRole: req.user.systemRole
    }
  });
};
