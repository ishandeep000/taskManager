import { User } from "../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("name email systemRole").sort({ name: 1 });
  res.json(users);
};
