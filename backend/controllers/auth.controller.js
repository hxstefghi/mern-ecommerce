import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  generateToken(user._id, res);

  res.json({ message: "Registered", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  generateToken(user._id, res);

  res.json({ message: "Logged in", user });
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
